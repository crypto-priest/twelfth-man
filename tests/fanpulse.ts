import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Fanpulse } from "../target/types/fanpulse";
import { assert } from "chai";

describe("fanpulse", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.fanpulse as Program<Fanpulse>;
  const admin = provider.wallet;

  const rival = Keypair.generate();

  const configPda = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  )[0];

  const fanPda = (owner: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("fan"), owner.toBuffer()],
      program.programId
    )[0];

  const teamPda = (code: string) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("team"), Buffer.from(code)],
      program.programId
    )[0];

  const matchPda = (id: number) => {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(id);
    return PublicKey.findProgramAddressSync(
      [Buffer.from("match"), buf],
      program.programId
    )[0];
  };

  const predictionPda = (match: PublicKey, owner: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("prediction"), match.toBuffer(), owner.toBuffer()],
      program.programId
    )[0];

  before(async () => {
    const sig = await provider.connection.requestAirdrop(
      rival.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig);
  });

  it("initializes config", async () => {
    await program.methods.initialize().rpc();
    const config = await program.account.config.fetch(configPda);
    assert.ok(config.admin.equals(admin.publicKey));
    assert.equal(config.matchCount, 0);
  });

  it("registers a fan and creates team stats", async () => {
    await program.methods.registerFan("ARG").rpc();
    const fan = await program.account.fanCard.fetch(fanPda(admin.publicKey));
    assert.deepEqual(Array.from(fan.team), [65, 82, 71]); // "ARG"
    assert.equal(fan.chantCount, 0);

    const team = await program.account.teamStats.fetch(teamPda("ARG"));
    assert.equal(team.fanCount, 1);
  });

  it("rejects lowercase team codes", async () => {
    try {
      await program.methods
        .registerFan("arg")
        .accounts({ owner: rival.publicKey })
        .signers([rival])
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "InvalidTeamCode");
    }
  });

  it("registers a second fan for another team", async () => {
    await program.methods
      .registerFan("BRA")
      .accounts({ owner: rival.publicKey })
      .signers([rival])
      .rpc();
    const team = await program.account.teamStats.fetch(teamPda("BRA"));
    assert.equal(team.fanCount, 1);
  });

  it("posts a chant and bumps counters", async () => {
    await program.methods.postChant("Vamos Argentina!", 0).rpc();
    const fan = await program.account.fanCard.fetch(fanPda(admin.publicKey));
    assert.equal(fan.chantCount, 1);
    const team = await program.account.teamStats.fetch(teamPda("ARG"));
    assert.equal(team.chantCount.toNumber(), 1);

    const chants = await program.account.chant.all();
    assert.equal(chants.length, 1);
    assert.equal(chants[0].account.text, "Vamos Argentina!");
  });

  it("rejects chants over 140 chars", async () => {
    try {
      await program.methods.postChant("x".repeat(141), 0).rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "ChantTooLong");
    }
  });

  it("admin creates a match", async () => {
    const kickoff = Math.floor(Date.now() / 1000) + 3600;
    await program.methods
      .createMatch(1, "ARG", "BRA", new anchor.BN(kickoff))
      .rpc();
    const m = await program.account.matchAccount.fetch(matchPda(1));
    assert.equal(m.id, 1);
    assert.isFalse(m.settled);
  });

  it("non-admin cannot create a match", async () => {
    try {
      await program.methods
        .createMatch(9, "FRA", "ESP", new anchor.BN(0))
        .accounts({ admin: rival.publicKey })
        .signers([rival])
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.notInclude(e.toString(), "should have thrown");
    }
  });

  it("locks a prediction before kickoff", async () => {
    await program.methods
      .predict(3, 1)
      .accounts({ matchAccount: matchPda(1) })
      .rpc();
    const p = await program.account.prediction.fetch(
      predictionPda(matchPda(1), admin.publicKey)
    );
    assert.equal(p.homeScore, 3);
    assert.equal(p.awayScore, 1);
    assert.isFalse(p.settled);
  });

  it("rejects predictions after kickoff", async () => {
    const past = Math.floor(Date.now() / 1000) - 60;
    await program.methods
      .createMatch(2, "ENG", "NOR", new anchor.BN(past))
      .rpc();
    try {
      await program.methods
        .predict(1, 0)
        .accounts({ matchAccount: matchPda(2) })
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "PredictionClosed");
    }
  });

  it("cannot settle before a result is posted", async () => {
    try {
      await program.methods
        .settlePrediction()
        .accounts({
          matchAccount: matchPda(1),
          prediction: predictionPda(matchPda(1), admin.publicKey),
          fanCard: fanPda(admin.publicKey),
          teamStats: teamPda("ARG"),
        })
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "MatchNotSettled");
    }
  });

  it("settles an exact-score prediction for 3 points", async () => {
    await program.methods
      .postResult(3, 1)
      .accounts({ matchAccount: matchPda(1) })
      .rpc();

    await program.methods
      .settlePrediction()
      .accounts({
        matchAccount: matchPda(1),
        prediction: predictionPda(matchPda(1), admin.publicKey),
        fanCard: fanPda(admin.publicKey),
        teamStats: teamPda("ARG"),
      })
      .rpc();

    const p = await program.account.prediction.fetch(
      predictionPda(matchPda(1), admin.publicKey)
    );
    assert.equal(p.points, 3);
    assert.isTrue(p.settled);

    const fan = await program.account.fanCard.fetch(fanPda(admin.publicKey));
    assert.equal(fan.points, 3);
    const team = await program.account.teamStats.fetch(teamPda("ARG"));
    assert.equal(team.points.toNumber(), 3);
  });

  it("cannot settle twice", async () => {
    try {
      await program.methods
        .settlePrediction()
        .accounts({
          matchAccount: matchPda(1),
          prediction: predictionPda(matchPda(1), admin.publicKey),
          fanCard: fanPda(admin.publicKey),
          teamStats: teamPda("ARG"),
        })
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "PredictionAlreadySettled");
    }
  });

  it("cannot post a result twice", async () => {
    try {
      await program.methods
        .postResult(0, 0)
        .accounts({ matchAccount: matchPda(1) })
        .rpc();
      assert.fail("should have thrown");
    } catch (e: any) {
      assert.include(e.toString(), "MatchAlreadySettled");
    }
  });
});

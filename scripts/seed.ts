// Seeds the deployed program with the current World Cup knockout fixtures.
// Usage: ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=~/.config/solana/id.json yarn seed
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Fanpulse } from "../target/types/fanpulse";
import fixtures from "./fixtures.json";

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.fanpulse as Program<Fanpulse>;

  const configPda = PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    program.programId
  )[0];

  const config = await provider.connection.getAccountInfo(configPda);
  if (!config) {
    await program.methods.initialize().rpc();
    console.log("config initialized, admin =", provider.wallet.publicKey.toBase58());
  }

  for (const f of fixtures.fixtures) {
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(f.id);
    const matchPda = PublicKey.findProgramAddressSync(
      [Buffer.from("match"), buf],
      program.programId
    )[0];

    const existing = await provider.connection.getAccountInfo(matchPda);
    if (!existing) {
      const kickoff = Math.floor(new Date(f.kickoffUtc).getTime() / 1000);
      await program.methods
        .createMatch(f.id, f.home, f.away, new anchor.BN(kickoff))
        .rpc();
      console.log(`match ${f.id}: ${f.home} vs ${f.away} (${f.round})`);
    }

    if (f.status === "played" && f.homeScore !== null && f.awayScore !== null) {
      const m = await program.account.matchAccount.fetch(matchPda);
      if (!m.settled) {
        await program.methods
          .postResult(f.homeScore, f.awayScore)
          .accounts({ matchAccount: matchPda })
          .rpc();
        console.log(`  result: ${f.homeScore}-${f.awayScore}`);
      }
    }
  }

  console.log("done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

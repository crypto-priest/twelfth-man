// Results oracle: watches the ESPN scoreboard and posts final scores on-chain,
// then settles every open prediction for the match. Run alongside the admin
// wallet during match windows:
//
//   ANCHOR_PROVIDER_URL=https://api.devnet.solana.com ANCHOR_WALLET=~/.config/solana/id.json yarn oracle
//
// A result is only posted after "completed" shows up on two polls in a row
// (~2.5 min apart) so a stray API blip can't push a bad score on-chain.
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { TwelfthMan } from "../target/types/twelfth_man";

const SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";
const POLL_MS = 300_000;

function recentDates(): string[] {
  const days = [];
  for (const back of [1, 0]) {
    const d = new Date(Date.now() - back * 86_400_000);
    days.push(d.toISOString().slice(0, 10).replace(/-/g, ""));
  }
  return days;
}

type Final = { homeScore: number; awayScore: number };

const pendingConfirm = new Map<string, Final>();

async function fetchFinals(): Promise<Map<string, Final & { completed: boolean }>> {
  const out = new Map();
  // yesterday + today, so a result can't rotate off the default view before
  // we see it; keyed in both orientations since ESPN's home/away designation
  // can differ from ours
  for (const day of recentDates()) {
    const res = await fetch(`${SCOREBOARD}?dates=${day}`);
    if (!res.ok) continue;
    const data = (await res.json()) as any;
    for (const e of data.events ?? []) {
      const comp = e.competitions?.[0];
      const side = (ha: string) =>
        comp?.competitors?.find((c: any) => c.homeAway === ha);
      const home = side("home");
      const away = side("away");
      if (!home?.team?.abbreviation || !away?.team?.abbreviation) continue;
      const entry = {
        homeScore: Number(home.score ?? 0),
        awayScore: Number(away.score ?? 0),
        completed: Boolean(comp?.status?.type?.completed),
      };
      out.set(`${home.team.abbreviation}-${away.team.abbreviation}`, entry);
      out.set(`${away.team.abbreviation}-${home.team.abbreviation}`, {
        ...entry,
        homeScore: entry.awayScore,
        awayScore: entry.homeScore,
      });
    }
  }
  return out;
}

async function settleOpenPredictions(
  program: Program<TwelfthMan>,
  matchId: number,
  matchPk: PublicKey
) {
  const preds = await program.account.prediction.all();
  const open = preds.filter(
    (p) => p.account.matchId === matchId && !p.account.settled
  );
  for (const p of open) {
    const fanCard = PublicKey.findProgramAddressSync(
      [Buffer.from("fan"), p.account.owner.toBuffer()],
      program.programId
    )[0];
    const fan = await program.account.fanCard.fetch(fanCard);
    const teamStats = PublicKey.findProgramAddressSync(
      [Buffer.from("team"), Buffer.from(fan.team)],
      program.programId
    )[0];
    try {
      await program.methods
        .settlePrediction()
        .accounts({
          matchAccount: matchPk,
          prediction: p.publicKey,
          fanCard,
          teamStats,
        })
        .rpc();
      console.log(`  settled ${p.account.owner.toBase58().slice(0, 8)}…`);
    } catch (e: any) {
      console.error(`  settle failed: ${e.message}`);
    }
  }
  console.log(`  ${open.length} prediction(s) processed`);
}

async function tick(program: Program<TwelfthMan>) {
  const matches = await program.account.matchAccount.all();
  const unsettled = matches.filter((m) => !m.account.settled);
  if (unsettled.length === 0) {
    console.log("nothing unsettled on-chain");
    return;
  }

  const finals = await fetchFinals();
  for (const m of unsettled) {
    const home = Buffer.from(m.account.home).toString();
    const away = Buffer.from(m.account.away).toString();
    const key = `${home}-${away}`;
    const feed = finals.get(key);
    if (!feed) continue;

    if (!feed.completed) {
      pendingConfirm.delete(key);
      console.log(`${key}: ${feed.homeScore}-${feed.awayScore} (in progress)`);
      continue;
    }

    const seen = pendingConfirm.get(key);
    if (
      !seen ||
      seen.homeScore !== feed.homeScore ||
      seen.awayScore !== feed.awayScore
    ) {
      pendingConfirm.set(key, feed);
      console.log(`${key}: final ${feed.homeScore}-${feed.awayScore}, confirming next poll`);
      continue;
    }

    console.log(`${key}: posting result ${feed.homeScore}-${feed.awayScore}`);
    await program.methods
      .postResult(feed.homeScore, feed.awayScore)
      .accounts({ matchAccount: m.publicKey })
      .rpc();
    await settleOpenPredictions(program, m.account.id, m.publicKey);
    pendingConfirm.delete(key);
  }
}

async function main() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.twelfthMan as Program<TwelfthMan>;
  console.log("oracle up, watching the scoreboard");

  for (;;) {
    try {
      await tick(program);
    } catch (e: any) {
      console.error("tick failed:", e.message);
    }
    await new Promise((r) => setTimeout(r, POLL_MS));
  }
}

main();

import { NextResponse } from "next/server";
import { Connection } from "@solana/web3.js";
import {
  RPC_URL,
  fetchAllChants,
  fetchAllMatches,
  fetchAllTeamStats,
} from "@/lib/fanpulse";

export const dynamic = "force-dynamic";

// one server-side reader with a short cache, so a room full of judges
// doesn't turn into a rate-limit storm against the public rpc
const TTL = 15000;

const conn = new Connection(RPC_URL, "confirmed");

type Snapshot = {
  at: number;
  chants: unknown[];
  matches: unknown[];
  teams: unknown[];
};

let cache: Snapshot | null = null;
let inflight: Promise<Snapshot> | null = null;

async function load(): Promise<Snapshot> {
  const [chants, matches, teams] = await Promise.all([
    fetchAllChants(conn),
    fetchAllMatches(conn),
    fetchAllTeamStats(conn),
  ]);
  return {
    at: Date.now(),
    chants: chants.map((c) => ({
      address: c.address.toBase58(),
      author: c.author.toBase58(),
      team: c.team,
      text: c.text,
      matchId: c.matchId,
      timestamp: c.timestamp,
    })),
    matches: matches.map((m) => ({
      address: m.address.toBase58(),
      id: m.id,
      home: m.home,
      away: m.away,
      kickoffTs: m.kickoffTs,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      settled: m.settled,
    })),
    teams,
  };
}

export async function GET() {
  if (cache && Date.now() - cache.at < TTL) {
    return NextResponse.json(cache);
  }
  if (!inflight) {
    inflight = load()
      .then((snap) => {
        cache = snap;
        return snap;
      })
      .finally(() => {
        inflight = null;
      });
  }
  try {
    return NextResponse.json(await inflight);
  } catch (e) {
    // rpc hiccup: serve the stale snapshot if we have one
    if (cache) return NextResponse.json(cache);
    console.error("chain snapshot failed:", e);
    return NextResponse.json({ error: "chain unavailable" }, { status: 503 });
  }
}

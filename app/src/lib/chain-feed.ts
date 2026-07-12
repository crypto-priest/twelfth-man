import { PublicKey } from "@solana/web3.js";
import type { Chant, Match, TeamStats } from "./fanpulse";

// client-side reader for the cached /api/chain snapshot

export type ChainFeed = {
  chants: Chant[];
  matches: Match[];
  teams: TeamStats[];
};

type RawChant = Omit<Chant, "address" | "author"> & { address: string; author: string };
type RawMatch = Omit<Match, "address"> & { address: string };

export async function fetchFeed(): Promise<ChainFeed> {
  const res = await fetch("/api/chain");
  if (!res.ok) throw new Error("feed unavailable");
  const raw = await res.json();
  return {
    chants: (raw.chants as RawChant[]).map((c) => ({
      ...c,
      address: new PublicKey(c.address),
      author: new PublicKey(c.author),
    })),
    matches: (raw.matches as RawMatch[]).map((m) => ({
      ...m,
      address: new PublicKey(m.address),
    })),
    teams: raw.teams as TeamStats[],
  };
}

"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { fetchAllTeamStats, type TeamStats } from "@/lib/fanpulse";

// Ranked loudest-first: chants, then points, then headcount.
export function rankTeams(stats: TeamStats[]): TeamStats[] {
  return [...stats].sort(
    (a, b) =>
      b.chantCount - a.chantCount ||
      b.points - a.points ||
      b.fanCount - a.fanCount
  );
}

export function useTeamStats(intervalMs = 15000) {
  const { connection } = useConnection();
  const [stats, setStats] = useState<TeamStats[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const fetched = await fetchAllTeamStats(connection);
        if (alive) setStats(rankTeams(fetched));
      } catch {}
    };
    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [connection, intervalMs]);

  return stats;
}

"use client";

import { useEffect, useState } from "react";
import type { TeamStats } from "@/lib/fanpulse";
import { fetchFeed } from "@/lib/chain-feed";

// Ranked loudest-first: chants, then points, then headcount.
export function rankTeams(stats: TeamStats[]): TeamStats[] {
  return [...stats].sort(
    (a, b) =>
      b.chantCount - a.chantCount ||
      b.points - a.points ||
      b.fanCount - a.fanCount
  );
}

export function useTeamStats(intervalMs = 30000) {
  const [stats, setStats] = useState<TeamStats[] | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const feed = await fetchFeed();
        if (alive) setStats(rankTeams(feed.teams));
      } catch {}
    };
    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return stats;
}

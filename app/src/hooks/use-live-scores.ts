"use client";

import { useEffect, useState } from "react";

export type LiveScore = {
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  state: "pre" | "in" | "post";
  completed: boolean;
  clock: string;
};

// Live scores from the broadcast feed, keyed "HOME-AWAY" by FIFA code.
// Display-only: the chain is still the source of truth for settlement.
export function useLiveScores(intervalMs = 30000) {
  const [scores, setScores] = useState<Map<string, LiveScore>>(new Map());

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch("/api/scores");
        const { scores } = await res.json();
        if (alive) {
          setScores(
            new Map(
              (scores as LiveScore[]).map((s) => [`${s.home}-${s.away}`, s])
            )
          );
        }
      } catch {
        // feed hiccups shouldn't touch the UI
      }
    };
    load();
    const timer = setInterval(load, intervalMs);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [intervalMs]);

  return scores;
}

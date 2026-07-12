"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchPredictions, type Match, type Prediction } from "@/lib/fanpulse";
import { fetchFeed } from "@/lib/chain-feed";

// Fixtures come from the cached server snapshot on a slow poll; the user's
// own predictions are read directly, but only on demand (mount, wallet
// change, or after an action) instead of on a loop.
export function useMatches(intervalMs = 30000) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [predictions, setPredictions] = useState<Map<number, Prediction>>(
    new Map()
  );

  const loadMatches = useCallback(async () => {
    try {
      const feed = await fetchFeed();
      setMatches(feed.matches);
    } catch {
      // stale data beats a blank screen
    }
  }, []);

  const loadPredictions = useCallback(async () => {
    if (!publicKey) {
      setPredictions(new Map());
      return;
    }
    try {
      const ps = await fetchPredictions(connection, publicKey);
      setPredictions(new Map(ps.map((p) => [p.matchId, p])));
    } catch {}
  }, [connection, publicKey]);

  useEffect(() => {
    loadMatches();
    const timer = setInterval(loadMatches, intervalMs);
    return () => clearInterval(timer);
  }, [loadMatches, intervalMs]);

  useEffect(() => {
    loadPredictions();
  }, [loadPredictions]);

  const refresh = useCallback(() => {
    loadMatches();
    loadPredictions();
  }, [loadMatches, loadPredictions]);

  return { matches, predictions, refresh };
}

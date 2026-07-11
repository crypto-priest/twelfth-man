"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  fetchAllMatches,
  fetchPredictions,
  type Match,
  type Prediction,
} from "@/lib/fanpulse";

export function useMatches(intervalMs = 30000) {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [predictions, setPredictions] = useState<Map<number, Prediction>>(
    new Map()
  );

  const refresh = useCallback(async () => {
    try {
      const [ms, ps] = await Promise.all([
        fetchAllMatches(connection),
        publicKey ? fetchPredictions(connection, publicKey) : Promise.resolve([]),
      ]);
      setMatches(ms);
      setPredictions(new Map(ps.map((p) => [p.matchId, p])));
    } catch {
      // stale data beats a blank screen
    }
  }, [connection, publicKey]);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, intervalMs);
    return () => clearInterval(timer);
  }, [refresh, intervalMs]);

  return { matches, predictions, refresh };
}

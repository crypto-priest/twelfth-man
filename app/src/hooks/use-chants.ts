"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import {
  PROGRAM_ID,
  fetchAllChants,
  parseChantEvents,
  type Chant,
} from "@/lib/fanpulse";

export type FeedChant = Chant & { live?: boolean };

// Polls the chant accounts and layers onLogs events on top so new chants
// land in the feed the moment they confirm.
export function useChants(intervalMs = 8000) {
  const { connection } = useConnection();
  const [chants, setChants] = useState<FeedChant[] | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const fetched = await fetchAllChants(connection);
        if (alive) setChants(fetched);
      } catch {
        // keep whatever we have; rpc hiccups shouldn't blank the feed
      }
    };

    load();
    const timer = setInterval(load, intervalMs);

    const sub = connection.onLogs(
      PROGRAM_ID,
      (entry) => {
        if (entry.err) return;
        const events = parseChantEvents(entry.logs);
        if (!events.length) return;
        setChants((prev) => {
          const seen = prev ?? [];
          const fresh = events
            .filter(
              (e) =>
                !seen.some(
                  (c) => c.timestamp === e.timestamp && c.author.equals(e.author)
                )
            )
            .map((e) => ({
              address: PublicKey.default,
              author: e.author,
              team: e.team,
              text: e.text,
              matchId: e.matchId,
              timestamp: e.timestamp,
              live: true,
            }));
          return fresh.length ? [...fresh, ...seen] : prev;
        });
      },
      "confirmed"
    );

    return () => {
      alive = false;
      clearInterval(timer);
      connection.removeOnLogsListener(sub).catch(() => {});
    };
  }, [connection, intervalMs]);

  return chants;
}

export function chantKey(c: FeedChant) {
  return `${c.author.toBase58()}-${c.timestamp}-${c.text.slice(0, 12)}`;
}

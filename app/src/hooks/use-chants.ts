"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, parseChantEvents, type Chant } from "@/lib/fanpulse";
import { fetchFeed } from "@/lib/chain-feed";

export type FeedChant = Chant & { live?: boolean };

// Polls the cached server snapshot and layers onLogs events on top so new
// chants still land in the feed the moment they confirm.
export function useChants(intervalMs = 30000) {
  const { connection } = useConnection();
  const [chants, setChants] = useState<FeedChant[] | null>(null);

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        const feed = await fetchFeed();
        if (alive) setChants(feed.chants);
      } catch {
        // keep whatever we have; hiccups shouldn't blank the feed
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

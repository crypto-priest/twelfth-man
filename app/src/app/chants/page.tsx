"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { chantKey, useChants } from "@/hooks/use-chants";
import { useFanCard } from "@/hooks/use-fan-card";
import { useMatches } from "@/hooks/use-matches";
import { getTeam } from "@/lib/teams";
import { ChantCard } from "@/components/chant-card";
import { ComposeBox } from "@/components/compose-box";
import { ConnectPrompt } from "@/components/connect-prompt";
import { EmptyState } from "@/components/empty-state";

export default function ChantsPage() {
  const { connected } = useWallet();
  const chants = useChants();
  const { fan, loading: fanLoading, refresh: refreshFan } = useFanCard();
  const { matches } = useMatches(60000);
  const [filter, setFilter] = useState<string | null>(null);

  const teams = useMemo(() => {
    const codes = new Set((chants ?? []).map((c) => c.team));
    return Array.from(codes).sort();
  }, [chants]);

  const visible = filter
    ? (chants ?? []).filter((c) => c.team === filter)
    : chants ?? [];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight">
          The Chant Wall
        </h1>
        <p className="mt-1 text-grass">
          Every chant lives on-chain. Tag a match to mint a Moment.
        </p>
      </header>

      {!connected ? (
        <ConnectPrompt body="Connect your wallet to join the chorus." />
      ) : fanLoading ? (
        <div className="skeleton h-40" />
      ) : fan ? (
        <ComposeBox
          fan={fan}
          matches={matches?.filter((m) => !m.settled)}
          onPosted={refreshFan}
        />
      ) : (
        <EmptyState
          icon="🪪"
          title="No Fan Card yet"
          body="You need colors before you can chant. Pick your team and mint your card."
        >
          <Link
            href="/card"
            className="mt-2 rounded-full bg-pitch px-6 py-2.5 text-sm font-semibold text-night transition hover:bg-[#33ff9f]"
          >
            Mint your Fan Card
          </Link>
        </EmptyState>
      )}

      {teams.length > 1 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter(null)}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
              filter === null
                ? "border-pitch/50 bg-pitch/10 text-pitch"
                : "border-edge text-grass hover:text-chalk"
            }`}
          >
            All fanbases
          </button>
          {teams.map((code) => {
            const team = getTeam(code);
            return (
              <button
                key={code}
                onClick={() => setFilter(filter === code ? null : code)}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  filter === code
                    ? "border-pitch/50 bg-pitch/10 text-pitch"
                    : "border-edge text-grass hover:text-chalk"
                }`}
              >
                {team.flag} {team.code}
              </button>
            );
          })}
        </div>
      )}

      <div className="space-y-3">
        {chants === null ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-28" />
          ))
        ) : visible.length === 0 ? (
          <EmptyState
            icon="📣"
            title="Dead silence"
            body={
              filter
                ? `No ${getTeam(filter).name} chants yet. Their fans must still be in the car park.`
                : "No chants yet — be the first voice in the stadium."
            }
          />
        ) : (
          visible.map((c) => <ChantCard key={chantKey(c)} chant={c} />)
        )}
      </div>
    </div>
  );
}

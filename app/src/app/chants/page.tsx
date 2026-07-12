"use client";

import { useMemo, useState } from "react";
import { chantKey, useChants } from "@/hooks/use-chants";
import { useFanCard } from "@/hooks/use-fan-card";
import { useMatches } from "@/hooks/use-matches";
import { getTeam } from "@/lib/teams";
import { ChantCard } from "@/components/chant-card";
import { ComposeBox } from "@/components/compose-box";
import { EmptyState } from "@/components/empty-state";
import { StartBanner } from "@/components/start-banner";

export default function ChantsPage() {
  const chants = useChants();
  const { fan, loading, connected, refresh: refreshFan } = useFanCard();
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
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          The Chant Wall
        </h1>
        <p className="mt-1 text-grass">
          Shout for your team. Every chant is saved forever — nobody can edit
          it, nobody can delete it.
        </p>
      </header>

      <StartBanner
        connected={connected}
        fan={fan}
        loading={loading}
        action="add your voice to the wall"
      />

      {connected &&
        (loading ? (
          <div className="skeleton h-40" />
        ) : (
          fan && (
            <ComposeBox
              fan={fan}
              matches={matches?.filter((m) => !m.settled)}
              onPosted={refreshFan}
            />
          )
        ))}

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
            All teams
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
          visible.map((c, i) => (
            <div
              key={chantKey(c)}
              className="animate-slide-up"
              style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}
            >
              <ChantCard chant={c} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

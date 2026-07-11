"use client";

import { useMatches } from "@/hooks/use-matches";
import { useFanCard } from "@/hooks/use-fan-card";
import { useLiveScores } from "@/hooks/use-live-scores";
import { MatchCard } from "@/components/match-card";
import { EmptyState } from "@/components/empty-state";

export default function MatchesPage() {
  const { matches, predictions, refresh } = useMatches();
  const { fan, refresh: refreshFan } = useFanCard();
  const liveScores = useLiveScores();

  const fixtures = (matches ?? []).filter((m) => !m.settled);
  const finished = (matches ?? []).filter((m) => m.settled).reverse();

  const onChanged = () => {
    refresh();
    refreshFan();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <header>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight">
          Matches
        </h1>
        <p className="mt-1 text-grass">
          Call the score before kickoff. Exact score is 3 points, right outcome
          is 1 — locked forever, brag forever.
        </p>
      </header>

      {matches === null ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-48" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No fixtures yet"
          body="The schedule hasn't hit the chain. Check back before the group stage."
        />
      ) : (
        <>
          {fixtures.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-grass">
                Fixtures
              </h2>
              {fixtures.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  prediction={predictions.get(m.id)}
                  fan={fan}
                  live={liveScores.get(`${m.home}-${m.away}`)}
                  onChanged={onChanged}
                />
              ))}
            </section>
          )}

          {finished.length > 0 && (
            <section className="space-y-4">
              <h2 className="font-display text-2xl font-bold uppercase tracking-wide text-grass">
                Full time
              </h2>
              {finished.map((m) => (
                <MatchCard
                  key={m.id}
                  match={m}
                  prediction={predictions.get(m.id)}
                  fan={fan}
                  onChanged={onChanged}
                />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

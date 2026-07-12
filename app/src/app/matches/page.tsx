"use client";

import { useMatches } from "@/hooks/use-matches";
import { useFanCard } from "@/hooks/use-fan-card";
import { useLiveScores } from "@/hooks/use-live-scores";
import { MatchCard } from "@/components/match-card";
import { EmptyState } from "@/components/empty-state";
import { SectionTitle } from "@/components/section-title";
import { StartBanner } from "@/components/start-banner";
import { PageHeader } from "@/components/page-header";

export default function MatchesPage() {
  const { matches, predictions, refresh } = useMatches();
  const { fan, loading, connected, refresh: refreshFan } = useFanCard();
  const liveScores = useLiveScores();

  const fixtures = (matches ?? []).filter((m) => !m.settled);
  const finished = (matches ?? []).filter((m) => m.settled).reverse();

  const onChanged = () => {
    refresh();
    refreshFan();
  };

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        kicker="Fixtures and results"
        title="Matches"
        sub="Call the score before kickoff. Nail the exact score: 3 pts. Call the right result: 1 pt."
      />

      <StartBanner
        connected={connected}
        fan={fan}
        loading={loading}
        action="call your scores"
      />

      {matches === null ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-48" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <EmptyState
          icon="🗓️"
          title="No matches yet"
          body="The fixture list lands here soon. Check back before kickoff."
        />
      ) : (
        <>
          {fixtures.length > 0 && (
            <section className="space-y-4">
              <SectionTitle live kicker="Fixtures">
                Up next: make your call
              </SectionTitle>
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
            <section className="space-y-4 border-t border-edge pt-8">
              <SectionTitle kicker="Results">Finished: final scores</SectionTitle>
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

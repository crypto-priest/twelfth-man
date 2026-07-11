"use client";

import Link from "next/link";
import { useFanCard } from "@/hooks/use-fan-card";
import { FanCardView, shareOnXUrl } from "@/components/fan-card-view";
import { RegisterPanel } from "@/components/register-panel";
import { EmptyState } from "@/components/empty-state";
import { WalletButton } from "@/components/wallet-button";

export default function CardPage() {
  const { fan, loading, connected, refresh } = useFanCard();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
          Your Fan Card
        </h1>
        <p className="mt-1 text-grass">
          One team. One card. Yours for the whole tournament.
        </p>
      </header>

      {!connected ? (
        <EmptyState
          icon="🎟️"
          title="Step 1: connect your wallet"
          body="That's your way into the stadium. Then pick your team and your card is ready in seconds."
        >
          <div className="mt-2">
            <WalletButton />
          </div>
        </EmptyState>
      ) : loading ? (
        <div className="mx-auto max-w-sm">
          <div className="skeleton h-[480px] rounded-3xl" />
        </div>
      ) : fan ? (
        <div className="space-y-6">
          <FanCardView fan={fan} />
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href={shareOnXUrl(fan)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pitch px-6 py-2.5 text-sm font-semibold text-night transition hover:bg-[#33ff9f]"
            >
              Share on X
            </a>
            <Link
              href="/chants"
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold transition hover:border-pitch/50 hover:text-pitch"
            >
              Post a chant
            </Link>
            <Link
              href="/matches"
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold transition hover:border-pitch/50 hover:text-pitch"
            >
              Call a score
            </Link>
          </div>
        </div>
      ) : (
        <RegisterPanel onRegistered={refresh} />
      )}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useFanCard } from "@/hooks/use-fan-card";
import { FanCardView, shareOnXUrl } from "@/components/fan-card-view";
import { RegisterPanel } from "@/components/register-panel";
import { EmptyState } from "@/components/empty-state";
import { WalletButton } from "@/components/wallet-button";
import { PageHeader } from "@/components/page-header";

export default function CardPage() {
  const { fan, loading, connected, refresh } = useFanCard();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        kicker="Your badge"
        title="Your Fan Card"
        sub="One team. One card. Yours for the whole tournament."
      />

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
              className="rounded-full bg-pitch px-6 py-2.5 text-sm font-semibold text-night transition hover:bg-pitch-2"
            >
              Share on X
            </a>
            <Link
              href="/chants"
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold transition hover:border-gold/50 hover:text-gold"
            >
              Post a chant
            </Link>
            <Link
              href="/matches"
              className="rounded-full border border-edge px-6 py-2.5 text-sm font-semibold transition hover:border-gold/50 hover:text-gold"
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

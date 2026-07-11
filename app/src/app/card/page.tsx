"use client";

import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useFanCard } from "@/hooks/use-fan-card";
import { FanCardView, shareOnXUrl } from "@/components/fan-card-view";
import { RegisterPanel } from "@/components/register-panel";
import { ConnectPrompt } from "@/components/connect-prompt";

export default function CardPage() {
  const { connected } = useWallet();
  const { fan, loading, refresh } = useFanCard();

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight">
          My Fan Card
        </h1>
        <p className="mt-1 text-grass">
          Your allegiance, minted. One wallet, one team, no transfers.
        </p>
      </header>

      {!connected ? (
        <ConnectPrompt body="Connect your wallet to mint or view your Fan Card." />
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
              Lock a prediction
            </Link>
          </div>
        </div>
      ) : (
        <RegisterPanel onRegistered={refresh} />
      )}
    </div>
  );
}

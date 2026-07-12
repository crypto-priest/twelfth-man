"use client";

import Link from "next/link";
import type { FanCard } from "@/lib/fanpulse";
import { WalletButton } from "./wallet-button";

// The single "do this next" banner. Renders nothing once the fan is set up.
export function StartBanner({
  connected,
  fan,
  loading,
  action,
}: {
  connected: boolean;
  fan: FanCard | null;
  loading: boolean;
  action: string;
}) {
  if (loading || (connected && fan)) return null;

  return (
    <div className="panel flex flex-col items-center gap-4 border-edge px-5 py-4 sm:flex-row">
      <span className="text-3xl">{connected ? "🎽" : "🎟️"}</span>
      <div className="flex-1 text-center sm:text-left">
        <p className="font-semibold">
          {connected ? "One step left: pick your team" : "New here? Two quick steps"}
        </p>
        <p className="mt-0.5 text-sm text-grass">
          {connected
            ? `Grab your free Fan Card, then ${action}.`
            : `Connect your wallet, grab your free Fan Card, then ${action}.`}
        </p>
      </div>
      {connected ? (
        <Link
          href="/card"
          className="rounded-full bg-pitch px-6 py-2.5 text-sm font-semibold text-chalk transition hover:bg-pitch-2"
        >
          Get my Fan Card
        </Link>
      ) : (
        <WalletButton />
      )}
    </div>
  );
}

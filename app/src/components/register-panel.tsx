"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { registerFanIx, sendIx } from "@/lib/fanpulse";
import { TEAMS, getTeam } from "@/lib/teams";

export function RegisterPanel({ onRegistered }: { onRegistered?: () => void }) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [picked, setPicked] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register() {
    if (!picked || !publicKey || busy) return;
    setBusy(true);
    setError(null);
    try {
      await sendIx(
        connection,
        { publicKey, sendTransaction },
        registerFanIx(publicKey, picked)
      );
      onRegistered?.();
    } catch (e) {
      setError("That didn't go through. Give it another try.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel p-6">
      <h2 className="font-display text-3xl font-bold tracking-wide">
        Pick your team
      </h2>
      <p className="mt-1 text-sm text-grass">
        One Fan Card per fan, for the whole tournament. Choose with your heart.
      </p>

      <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
        {TEAMS.map((t) => {
          const active = picked === t.code;
          return (
            <button
              key={t.code}
              onClick={() => setPicked(t.code)}
              className={`flex flex-col items-center gap-1 rounded-xl border p-3 transition ${
                active
                  ? "border-gold bg-pitch/30"
                  : "border-edge bg-night/40 hover:border-grass/40"
              }`}
              style={active ? { boxShadow: `0 0 24px ${t.primary}44` } : undefined}
            >
              <span className="text-2xl">{t.flag}</span>
              <span
                className={`text-xs font-bold tracking-wider ${
                  active ? "text-gold" : "text-grass"
                }`}
              >
                {t.code}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          onClick={register}
          disabled={!picked || busy || !publicKey}
          className="rounded-full bg-pitch px-8 py-3 font-semibold text-night transition hover:bg-pitch-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy
            ? "Making your card…"
            : picked
              ? `Get my ${getTeam(picked).name} Fan Card`
              : "Pick a team first"}
        </button>
        {picked && !busy && (
          <span className="text-sm text-grass">
            {getTeam(picked).flag} {getTeam(picked).name}, no takebacks.
          </span>
        )}
      </div>
      {error && <p className="mt-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}

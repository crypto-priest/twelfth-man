"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { MAX_CHANT_LEN, postChantIx, sendIx, type FanCard, type Match } from "@/lib/fanpulse";
import { getTeam } from "@/lib/teams";

export function ComposeBox({
  fan,
  matches,
  onPosted,
}: {
  fan: FanCard;
  matches?: Match[];
  onPosted?: () => void;
}) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [text, setText] = useState("");
  const [matchId, setMatchId] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const team = getTeam(fan.team);
  const left = MAX_CHANT_LEN - text.length;
  const canPost = !busy && text.trim().length > 0 && left >= 0 && publicKey;

  async function post() {
    if (!canPost || !publicKey) return;
    setBusy(true);
    setError(null);
    try {
      await sendIx(
        connection,
        { publicKey, sendTransaction },
        postChantIx(fan, text.trim(), matchId)
      );
      setText("");
      setMatchId(0);
      onPosted?.();
    } catch (e) {
      setError("That didn't go through — give it another try.");
      console.error(e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="panel p-4">
      <div className="flex items-center gap-2 text-sm text-grass">
        <span>{team.flag}</span>
        <span>
          Chanting for <span className="font-semibold text-chalk">{team.name}</span>
        </span>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        maxLength={MAX_CHANT_LEN * 2}
        placeholder="Make some noise… VAMOS!"
        className="mt-3 w-full resize-none rounded-xl border border-edge bg-night/60 p-3 text-[15px] outline-none transition-colors placeholder:text-grass/50 focus:border-pitch/40"
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {matches && matches.length > 0 && (
          <select
            value={matchId}
            onChange={(e) => setMatchId(Number(e.target.value))}
            className="rounded-full border border-edge bg-night/60 px-3 py-1.5 text-sm text-grass outline-none focus:border-pitch/40"
          >
            <option value={0}>Just cheering</option>
            {matches.map((m) => (
              <option key={m.id} value={m.id}>
                For {getTeam(m.home).code} v {getTeam(m.away).code}
              </option>
            ))}
          </select>
        )}
        <span
          className={`ml-auto font-display text-lg font-semibold tabular-nums ${
            left < 0 ? "text-red-400" : left <= 20 ? "text-amber-400" : "text-grass"
          }`}
        >
          {left}
        </span>
        <button
          onClick={post}
          disabled={!canPost}
          className="rounded-full bg-pitch px-6 py-2 text-sm font-semibold text-night transition hover:bg-pitch-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? "Posting…" : "Post chant"}
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

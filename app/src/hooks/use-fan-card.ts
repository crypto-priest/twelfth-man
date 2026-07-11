"use client";

import { useCallback, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { fetchFanCard, type FanCard } from "@/lib/fanpulse";

export function useFanCard() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [fan, setFan] = useState<FanCard | null>(null);
  const [ready, setReady] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setReady(false);
    setFan(null);
    if (!publicKey) {
      setReady(true);
      return;
    }
    let alive = true;
    fetchFanCard(connection, publicKey)
      .then((f) => alive && setFan(f))
      .catch(() => {})
      .finally(() => alive && setReady(true));
    return () => {
      alive = false;
    };
  }, [connection, publicKey, nonce]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  return { fan, loading: !ready, refresh, connected: !!publicKey };
}

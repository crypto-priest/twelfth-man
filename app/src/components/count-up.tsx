"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({ value, className }: { value: number; className?: string }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);

  useEffect(() => {
    const start = performance.now();
    const base = from.current;
    const delta = value - base;
    if (delta === 0) return;
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = Math.round(base + delta * eased);
      setShown(next);
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = value;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span className={className}>{shown.toLocaleString()}</span>;
}

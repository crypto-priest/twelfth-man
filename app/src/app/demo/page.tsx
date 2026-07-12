"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const accounts = [
  {
    label: "Test account A",
    phrase:
      "discover hero tent veteran pole denial intact autumn list job finish gown",
    address: "31hosojNPTCvzqzsBPkLve95hn4qdmz26dvKnoX4woYe",
  },
  {
    label: "Test account B",
    phrase:
      "arrow kitten raise clip script capital sorry foot vendor twist oxygen rally",
    address: "CKz9PsKMGSQMRLvAaPewXeeddes7Wk2QgRGpbQxSE3Ys",
  },
];

const script = [
  { title: "Get your Fan Card", body: "Pick the country you back.", href: "/card" },
  {
    title: "Post a chant",
    body: "Watch it land on the live wall a few seconds later.",
    href: "/chants",
  },
  {
    title: "Call a score",
    body: "Lock a prediction on an upcoming match before kickoff.",
    href: "/matches",
  },
  {
    title: "Check the leaderboard",
    body: "See where your country's fans rank.",
    href: "/leaderboard",
  },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard blocked; the text is right there to select
    }
  }

  return (
    <button
      onClick={copy}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
        copied
          ? "border-gold/50 bg-pitch/40 text-gold"
          : "border-edge text-grass hover:border-gold/50 hover:text-gold"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 -rotate-3 items-center justify-center rounded-[7px] bg-gold/15 font-display text-base text-gold">
          {n}
        </span>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="mt-3 space-y-3 pl-10 text-sm text-grass">{children}</div>
    </section>
  );
}

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <PageHeader
        kicker="Two minutes"
        title="Take it for a spin"
        sub="Two minutes, play money, no signup. Here's the fastest way to try everything."
      />

      <Step n={1} title="What you need">
        <p>
          The{" "}
          <a
            href="https://phantom.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            Phantom
          </a>{" "}
          (or Solflare) browser extension, and about 2 minutes.
        </p>
      </Step>

      <Step n={2} title="Flip Phantom into play-money mode">
        <p>
          In Phantom: <span className="text-chalk">Settings → Developer Settings →
          Testnet Mode ON</span>. That switches it to Solana&apos;s practice
          network (devnet). Nothing here costs real money.
        </p>
      </Step>

      <Step n={3} title="Grab a ready-made test account">
        <p>
          Both accounts below are loaded with 1.5 devnet SOL. Import one in
          Phantom: <span className="text-chalk">Add / Connect Wallet → Import
          Recovery Phrase</span>.
        </p>
        {accounts.map((a) => (
          <div key={a.address} className="rounded-xl border border-edge bg-night/60 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-chalk">{a.label}</p>
              <span className="rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-amber-300">
                Shared public test account, devnet only, no real value
              </span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <code className="flex-1 rounded-lg bg-night px-3 py-2 font-mono text-[13px] leading-relaxed text-chalk">
                {a.phrase}
              </code>
              <CopyButton text={a.phrase} />
            </div>
            <p className="mt-2 font-mono text-[11px] text-grass">{a.address}</p>
          </div>
        ))}
        <p>
          One team per account, forever. If the account already has a Fan Card,
          that step is done for you; everything else still works. There are two
          accounts so a second tester can pick a rival team.
        </p>
      </Step>

      <Step n={4} title="Or use your own wallet">
        <p>
          Already have one? Switch it to devnet and grab free practice SOL from{" "}
          <a
            href="https://faucet.solana.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gold underline-offset-4 hover:underline"
          >
            faucet.solana.com
          </a>
          .
        </p>
      </Step>

      <Step n={5} title="The 2-minute test script">
        <ol className="space-y-2">
          {script.map((s, i) => (
            <li key={s.title} className="flex items-start gap-2.5">
              <span className="font-display text-base font-bold text-gold">
                {i + 1}.
              </span>
              <p>
                <Link
                  href={s.href}
                  className="font-semibold text-chalk underline-offset-4 hover:text-gold hover:underline"
                >
                  {s.title}
                </Link>. {s.body}
              </p>
            </li>
          ))}
        </ol>
        <p>
          Results land automatically after full time, and your points show up on
          your Fan Card.
        </p>
      </Step>

      <p className="px-2 pt-2 text-center text-xs text-grass">
        For the curious: the program lives at{" "}
        <a
          href="https://explorer.solana.com/address/EwCR98M9we9XSNpNA7jnSh9HKXdQWtZPonLdJZ6yM6Kc?cluster=devnet"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-gold underline-offset-4 hover:underline"
        >
          EwCR98M9…yM6Kc
        </a>{" "}
        on Solana devnet.
      </p>
    </div>
  );
}

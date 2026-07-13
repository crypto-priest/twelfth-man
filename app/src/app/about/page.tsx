"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SectionTitle } from "@/components/section-title";

const things = [
  {
    icon: "🎽",
    title: "Get your Fan Card",
    body: "Pick one team, one time. It's your permanent supporter badge, proof of who you backed and since when.",
    href: "/card",
    cta: "Pick your team",
  },
  {
    icon: "📣",
    title: "Post chants",
    body: "Your chants hit the live wall for the whole world to see, and they never disappear.",
    href: "/chants",
    cta: "See the wall",
  },
  {
    icon: "🎯",
    title: "Call scores before kickoff",
    body: "Locked at kickoff, no take-backs. Nail the exact score: 3 pts. Right result: 1 pt. Points land automatically after full time.",
    href: "/matches",
    cta: "See the fixtures",
  },
  {
    icon: "🏆",
    title: "Climb the leaderboard",
    body: "Every point and every chant counts toward your team's fanbase total. Loudest country wins.",
    href: "/card#leaderboard",
    cta: "Check the table",
  },
];

const steps = [
  {
    title: "Connect your wallet",
    body: "One tap. That's your ticket in.",
  },
  {
    title: "Pick your team",
    body: "Get your free Fan Card for the country you back. One card per fan, forever.",
  },
  {
    title: "Cheer and call scores",
    body: "Post chants, predict results before kickoff, climb the world table. Exact score: 3 pts. Right result: 1 pt.",
  },
];

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
  {
    label: "Test account C (alternate)",
    phrase:
      "drama draw law develop current unit found coral laptop clump leave right",
    address: "ChGYXBZhH3foXEgFFnZrYbjHtoknoBK9h4q6JKouRvGt",
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
    href: "/card#leaderboard",
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
          ? "border-gold/50 bg-pitch/30 text-gold"
          : "border-edge text-grass hover:border-gold/50 hover:text-gold"
      }`}
    >
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function TryStep({
  n,
  title,
  children,
}: {
  n: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="panel p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-chalk/10 font-display text-base text-chalk">
          {n}
        </span>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <div className="mt-3 space-y-3 pl-10 text-sm text-grass">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-14">
      <div>
        <PageHeader kicker="The idea" title="What is 12th Man?" />
        <p className="-mt-4 text-center text-grass">
          Every team has eleven players. The twelfth is the crowd, and that&apos;s
          you. This is where World Cup fans back their team, cheer, and call
          the scores. Everything you do here is saved permanently, so your
          support and your predictions are provable, forever.
        </p>
      </div>

      <section className="space-y-4">
        <SectionTitle kicker="The game">What can I do here?</SectionTitle>
        <div className="grid gap-3 sm:grid-cols-2">
          {things.map((t) => (
            <div key={t.title} className="panel lift flex flex-col gap-2 p-5">
              <span className="text-2xl">{t.icon}</span>
              <p className="font-semibold">{t.title}</p>
              <p className="text-sm text-grass">{t.body}</p>
              <Link
                href={t.href}
                className="mt-auto pt-1 text-sm font-semibold text-gold underline-offset-4 hover:underline"
              >
                {t.cta} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <SectionTitle kicker="Two minutes">How it works</SectionTitle>
        <div className="mt-2">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className="flex items-center gap-6 border-b border-edge-soft py-6 last:border-0"
            >
              <span
                aria-hidden
                className="metal-text score-slant w-20 shrink-0 font-display text-6xl leading-none opacity-70"
              >
                0{i + 1}
              </span>
              <div>
                <p className="font-display text-lg uppercase tracking-tight">
                  {s.title}
                </p>
                <p className="mt-1 text-sm text-grass">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionTitle kicker="Straight answer">
          Why &quot;saved forever&quot;? What&apos;s underneath?
        </SectionTitle>
        <p className="text-sm leading-relaxed text-grass">
          Every action here (a chant, a prediction, your Fan Card) is a tiny
          record on Solana, a public network that nobody controls alone. That&apos;s
          why nobody, including us, can edit it, fake it, or delete it. And
          it&apos;s why using it costs a fraction of a cent. That&apos;s the entire
          reason this isn&apos;t just another website: your bragging rights
          don&apos;t depend on trusting us.
        </p>
        <p className="text-sm leading-relaxed text-grass">
          Does it cost real money? No. Right now it runs on Solana&apos;s test
          network, so everything is play money. Try it below.
        </p>
      </section>

      <section id="try-it" className="scroll-mt-24 space-y-4">
        <SectionTitle kicker="Play money, no signup">Try it yourself</SectionTitle>

        <TryStep n={1} title="What you need">
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
        </TryStep>

        <TryStep n={2} title="Flip Phantom into play-money mode">
          <p>
            In Phantom: <span className="text-chalk">Settings → Developer
            Settings → Testnet Mode ON</span>. That switches it to Solana&apos;s
            practice network (devnet). Nothing here costs real money.
          </p>
        </TryStep>

        <TryStep n={3} title="Grab a ready-made test account">
          <p>
            Both accounts below are loaded with 1.5 devnet SOL. Import one in
            Phantom: <span className="text-chalk">Add / Connect Wallet → Import
            Recovery Phrase</span>.
          </p>
          {accounts.map((a) => (
            <div key={a.address} className="rounded-xl border border-edge bg-night/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
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
            One team per account, forever. If the account already has a Fan
            Card, that step is done for you; everything else still works. There
            are two accounts so a second tester can pick a rival team.
          </p>
        </TryStep>

        <TryStep n={4} title="Or use your own wallet">
          <p>
            Already have one? Switch it to devnet and grab free practice SOL
            from{" "}
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
        </TryStep>

        <TryStep n={5} title="The 2-minute test script">
          <ol className="space-y-2">
            {script.map((s, i) => (
              <li key={s.title} className="flex items-start gap-2.5">
                <span className="font-display text-base text-gold">{i + 1}.</span>
                <p>
                  <Link
                    href={s.href}
                    className="font-semibold text-chalk underline-offset-4 hover:text-gold hover:underline"
                  >
                    {s.title}
                  </Link>
                  . {s.body}
                </p>
              </li>
            ))}
          </ol>
          <p>
            Results land automatically after full time, and your points show up
            on your Fan Card.
          </p>
        </TryStep>

        <p className="px-2 pt-1 text-center text-xs text-muted">
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
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/card"
          className="rounded-full bg-pitch px-7 py-3 font-semibold text-night transition hover:bg-pitch-2"
        >
          Get your Fan Card
        </Link>
        <Link
          href="/matches"
          className="rounded-full border border-chalk/30 bg-night/40 px-7 py-3 font-semibold text-chalk backdrop-blur transition hover:border-chalk/60"
        >
          See the fixtures
        </Link>
      </div>
    </div>
  );
}

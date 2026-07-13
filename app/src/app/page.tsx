"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { PublicKey } from "@solana/web3.js";
import { useFanCard } from "@/hooks/use-fan-card";
import { useTeamStats } from "@/hooks/use-team-stats";
import { useChants } from "@/hooks/use-chants";
import { getTeam } from "@/lib/teams";
import type { FanCard } from "@/lib/fanpulse";
import { timeAgo } from "@/lib/format";
import { CountUp } from "@/components/count-up";
import { FanCardView } from "@/components/fan-card-view";
import { SectionTitle } from "@/components/section-title";

const features = [
  {
    title: "Fan Card",
    body: "Your permanent supporter badge. One team, one card, for the whole tournament.",
    href: "/card",
    cta: "Get yours",
  },
  {
    title: "Chant Wall",
    body: "Shout for your team on a live wall nobody can edit or delete.",
    href: "/chants",
    cta: "Hear the wall",
  },
  {
    title: "Score Calls",
    body: "Lock your prediction before kickoff. Exact score: 3 pts. Right result: 1 pt.",
    href: "/matches",
    cta: "See the fixtures",
  },
];

const steps = [
  { title: "Connect your wallet", body: "One tap. That's your ticket in." },
  {
    title: "Pick your team",
    body: "Get your free Fan Card for the country you back.",
  },
  {
    title: "Cheer and call scores",
    body: "Post chants, predict results, climb the world table.",
  },
];

export default function Home() {
  const { fan, loading, connected } = useFanCard();
  const stats = useTeamStats();
  const chants = useChants(20000);
  const [imgOk, setImgOk] = useState(true);

  const totalChants = stats?.reduce((n, t) => n + t.chantCount, 0) ?? 0;
  const totalFans = stats?.reduce((n, t) => n + t.fanCount, 0) ?? 0;
  const myTeam = fan ? getTeam(fan.team) : null;

  const showcaseFan = useMemo<FanCard>(
    () =>
      fan ?? {
        address: PublicKey.default,
        owner: PublicKey.default,
        team: "BRA",
        fanSince: 1749772800,
        chantCount: 214,
        points: 12,
      },
    [fan]
  );

  return (
    <div className="space-y-24">
      <section className="relative left-1/2 -mt-24 w-screen -translate-x-1/2 overflow-hidden">
        {/* spotlight glow behind the ball, like a piece under gallery light */}
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_22%,#3a4145,#15181a_72%)]" />
        {imgOk && (
          <Image
            src="/hero-crack.png"
            alt="A football smashing through cracked glass"
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover"
            onError={() => setImgOk(false)}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(21,24,26,0.45),rgba(21,24,26,0.06)_38%,rgba(21,24,26,0.12)_70%,#15181a_98%)]" />
        {/* scrim so the headline never fights the bright glass shatter */}
        <div className="absolute inset-0 bg-[radial-gradient(760px_460px_at_50%_46%,rgba(21,24,26,0.52),transparent_74%)]" />
        {/* darkened band so the nav always reads at the top */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-night/70 to-transparent" />

        {connected && !loading && fan && myTeam && (
          <div className="absolute right-4 top-20 z-10 hidden items-center gap-2.5 rounded-full border border-edge-soft bg-night/60 px-4 py-2 text-sm backdrop-blur-md sm:flex">
            <span>{myTeam.flag}</span>
            <span className="text-grass">
              Backing <span className="font-semibold text-chalk">{myTeam.name}</span>
            </span>
            <Link href="/card" className="font-semibold text-gold hover:underline">
              My card →
            </Link>
          </div>
        )}

        <div className="relative mx-auto flex min-h-[100svh] max-w-5xl flex-col items-center justify-center px-6 py-28 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-chalk">
            12th Man · World Cup 2026
          </p>
          <h1 className="metal-text mt-5 font-display text-5xl uppercase leading-[0.94] tracking-tight sm:text-7xl">
            Every team has eleven.
            <br />
            Be the twelfth.
          </h1>
          <p className="mt-6 max-w-xl text-sm font-medium text-chalk sm:text-base">
            Pick your nation, cheer with fans worldwide, and call the scores
            before kickoff. Every cheer and call is saved forever, so your
            bragging rights are provable.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/card"
              className="rounded-full bg-pitch px-8 py-3.5 font-semibold text-night shadow-[0_12px_40px_rgba(127,160,174,0.3)] transition hover:bg-pitch-2"
            >
              Get your Fan Card
            </Link>
            <Link
              href="/about#try-it"
              className="rounded-full border border-chalk/30 bg-night/40 px-8 py-3.5 font-semibold text-chalk backdrop-blur transition hover:border-chalk/60"
            >
              See the demo
            </Link>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
            <path d="M6 9.5 12 15.5l6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </section>

      <section className="mx-auto max-w-3xl text-center">
        <h2 className="metal-text font-display text-3xl uppercase leading-none tracking-tight sm:text-5xl">
          Every cheer, on the record.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-grass">
          The twelfth player is the crowd, and that&apos;s you. Back your nation,
          cheer, and call the scores. Everything you do here is saved
          permanently, so your support is provable, forever.{" "}
          <Link href="/about" className="text-gold hover:underline">
            More about 12th Man →
          </Link>
        </p>
      </section>

      <section>
        <SectionTitle kicker="The game">Three ways to show up</SectionTitle>
        <div className="mt-2">
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="group grid items-center gap-2 border-b border-edge-soft py-7 transition-colors last:border-0 hover:bg-chalk/[0.02] sm:grid-cols-[1fr_1.2fr_auto] sm:gap-6"
            >
              <p className="font-display text-2xl uppercase tracking-tight sm:text-3xl">
                {f.title}
              </p>
              <p className="text-sm text-grass">{f.body}</p>
              <span className="text-sm font-semibold text-gold transition group-hover:translate-x-1">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <SectionTitle kicker="Two minutes">How it works</SectionTitle>
        <div className="mt-2">
          {steps.map((s, i) => {
            const done = (i === 0 && connected) || (i === 1 && connected && !!fan);
            return (
              <div
                key={s.title}
                className="flex items-center gap-7 border-b border-edge-soft py-7 last:border-0"
              >
                <span
                  aria-hidden
                  className="metal-text score-slant w-24 shrink-0 font-display text-7xl leading-none opacity-70"
                >
                  0{i + 1}
                </span>
                <div>
                  <p className="font-display text-xl uppercase tracking-tight">
                    {s.title}
                    {done && <span className="ml-2 align-middle text-sm text-gold">✓ done</span>}
                  </p>
                  <p className="mt-1 text-sm text-grass">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid items-center gap-10 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          <SectionTitle kicker="The badge">One wallet. One nation. Forever.</SectionTitle>
          <p className="mt-4 max-w-md text-grass">
            Your Fan Card is minted the moment you pick your team, and it can
            never be changed. It carries your chants, your prediction points,
            and the day you joined. Choose with your heart.
          </p>
          <Link
            href="/card"
            className="mt-6 inline-block rounded-full bg-pitch px-7 py-3 font-semibold text-night transition hover:bg-pitch-2"
          >
            {fan ? "See your card" : "Pick your team"}
          </Link>
          {!fan && (
            <p className="mt-3 text-xs text-muted">Shown here: a preview card.</p>
          )}
        </div>
        <div className="order-1 lg:order-2">
          <FanCardView fan={showcaseFan} />
        </div>
      </section>

      <section>
        <SectionTitle live kicker="Right now">The pulse</SectionTitle>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-12 gap-y-6 border-b border-edge-soft pb-8">
          <div>
            <CountUp
              value={totalFans}
              className="metal-text score-slant font-display text-6xl tabular-nums sm:text-7xl"
            />
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted">
              Fans
            </p>
          </div>
          <div>
            <CountUp
              value={totalChants}
              className="metal-text score-slant font-display text-6xl tabular-nums sm:text-7xl"
            />
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted">
              Chants
            </p>
          </div>
          <div>
            <CountUp
              value={stats?.length ?? 0}
              className="metal-text score-slant font-display text-6xl tabular-nums sm:text-7xl"
            />
            <p className="mt-2 text-[11px] uppercase tracking-[0.3em] text-muted">
              Nations
            </p>
          </div>
        </div>

        <div className="divide-y divide-edge-soft">
          {chants === null ? (
            <div className="space-y-2 py-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton h-10" />
              ))}
            </div>
          ) : chants.length === 0 ? (
            <p className="py-6 text-sm text-grass">
              No chants yet. Be the first voice in the stadium.
            </p>
          ) : (
            chants.slice(0, 3).map((c) => {
              const team = getTeam(c.team);
              return (
                <div
                  key={`${c.author.toBase58()}-${c.timestamp}`}
                  className="flex items-center gap-4 py-4"
                >
                  <span className="text-xl">{team.flag}</span>
                  <p className="min-w-0 flex-1 truncate text-sm">{c.text}</p>
                  <span className="shrink-0 text-[11px] uppercase tracking-widest text-muted">
                    {team.code} · {timeAgo(c.timestamp)}
                  </span>
                </div>
              );
            })
          )}
          <Link
            href="/chants"
            className="block py-4 text-sm font-semibold text-gold hover:underline"
          >
            Hear them all →
          </Link>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(700px_320px_at_50%_20%,rgba(140,148,148,0.14),transparent_70%)]" />
        <h2 className="metal-text relative font-display text-4xl uppercase leading-none tracking-tight sm:text-6xl">
          Your nation needs you
        </h2>
        <p className="relative mt-4 text-sm text-grass">
          Free to join, two minutes to set up, bragging rights forever.
        </p>
        <div className="relative mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/card"
            className="rounded-full bg-pitch px-8 py-3.5 font-semibold text-night transition hover:bg-pitch-2"
          >
            Get your Fan Card
          </Link>
          <Link
            href="/about#try-it"
            className="rounded-full border border-chalk/30 bg-night/40 px-8 py-3.5 font-semibold text-chalk backdrop-blur transition hover:border-chalk/60"
          >
            Try the demo
          </Link>
        </div>
      </section>
    </div>
  );
}

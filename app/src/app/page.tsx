"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useFanCard } from "@/hooks/use-fan-card";
import { useTeamStats } from "@/hooks/use-team-stats";
import { useChants } from "@/hooks/use-chants";
import { getTeam } from "@/lib/teams";
import { timeAgo } from "@/lib/format";
import { CountUp } from "@/components/count-up";
import { SectionTitle } from "@/components/section-title";

const features = [
  {
    icon: "🎽",
    title: "Fan Card",
    body: "Your permanent supporter badge. One team, one card, for the whole tournament.",
    href: "/card",
    cta: "Get yours",
  },
  {
    icon: "📣",
    title: "Chant Wall",
    body: "Shout for your team on a live wall nobody can edit or delete.",
    href: "/chants",
    cta: "Hear the wall",
  },
  {
    icon: "🎯",
    title: "Score Calls",
    body: "Lock your prediction before kickoff. Exact score: 3 pts. Right result: 1 pt.",
    href: "/matches",
    cta: "See the fixtures",
  },
];

const steps = [
  {
    title: "Connect your wallet",
    body: "One tap. That's your ticket in.",
  },
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
  const chants = useChants(15000);
  const [imgOk, setImgOk] = useState(true);

  const totalChants = stats?.reduce((n, t) => n + t.chantCount, 0) ?? 0;
  const totalFans = stats?.reduce((n, t) => n + t.fanCount, 0) ?? 0;
  const myTeam = fan ? getTeam(fan.team) : null;

  return (
    <div className="space-y-16">
      <section className="relative left-1/2 -mt-24 w-screen -translate-x-1/2 overflow-hidden">
        {/* spotlight glow behind the ball, like a piece under gallery light */}
        <div className="absolute inset-0 bg-[radial-gradient(1000px_600px_at_50%_22%,#3a4145,#15181a_72%)]" />
        {imgOk && (
          <Image
            src="/hero-crack.png"
            alt="A football smashing through cracked glass"
            fill
            priority
            sizes="100vw"
            className="object-cover"
            onError={() => setImgOk(false)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-night/40 via-night/10 to-night" />
        {/* scrim so the headline never fights the bright glass shatter */}
        <div className="absolute inset-0 bg-[radial-gradient(700px_420px_at_50%_50%,rgba(21,24,26,0.45),transparent_70%)]" />
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
          <h1 className="metal-text mt-5 font-display text-6xl uppercase leading-[0.92] tracking-tight sm:text-8xl">
            Pick your nation.
            <br />
            Own the match.
          </h1>
          <p className="mt-6 max-w-xl text-sm font-medium text-chalk sm:text-base">
            Cheer with fans worldwide and call the scores before kickoff. Every
            cheer and call is saved forever, so your bragging rights are
            provable.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              href="/card"
              className="rounded-full bg-pitch px-8 py-3.5 font-semibold text-night shadow-[0_12px_40px_rgba(18,78,102,0.45)] transition hover:bg-pitch-2"
            >
              Get your Fan Card
            </Link>
            <Link
              href="/demo"
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
        <SectionTitle kicker="What is 12th Man?">The crowd, counted</SectionTitle>
        <p className="mt-4 text-grass">
          Every team has eleven players. The twelfth is the crowd, and that&apos;s
          you. Back your nation, cheer, and call the scores. Everything you do
          here is saved permanently, so your support is provable, forever.{" "}
          <Link href="/about" className="text-gold hover:underline">
            More about 12th Man →
          </Link>
        </p>
      </section>

      <section>
        <SectionTitle kicker="The game">Three ways to show up</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <Link key={f.title} href={f.href} className="panel lift flex flex-col gap-2.5 p-6">
              <span className="text-3xl">{f.icon}</span>
              <p className="font-display text-xl uppercase tracking-tight">{f.title}</p>
              <p className="text-sm text-grass">{f.body}</p>
              <span className="mt-auto pt-2 text-sm font-semibold text-gold">
                {f.cta} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24">
        <SectionTitle kicker="Two minutes">How it works</SectionTitle>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {steps.map((s, i) => {
            const done = (i === 0 && connected) || (i === 1 && connected && !!fan);
            return (
              <div key={s.title} className="panel flex items-start gap-3.5 p-5">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-display text-base ${
                    done ? "bg-pitch text-night" : "bg-chalk/10 text-chalk"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold">{s.title}</p>
                  <p className="mt-0.5 text-xs text-grass">{s.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <SectionTitle live kicker="Right now">The pulse</SectionTitle>
        <div className="mt-5 grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="panel flex items-center justify-around gap-4 px-6 py-7">
            <div className="text-center">
              <CountUp
                value={totalFans}
                className="score-slant font-display text-4xl tabular-nums"
              />
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Fans
              </p>
            </div>
            <div className="text-center">
              <CountUp
                value={totalChants}
                className="score-slant font-display text-4xl tabular-nums text-gold"
              />
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Chants
              </p>
            </div>
            <div className="text-center">
              <CountUp
                value={stats?.length ?? 0}
                className="score-slant font-display text-4xl tabular-nums"
              />
              <p className="mt-1 text-[11px] uppercase tracking-widest text-muted">
                Countries
              </p>
            </div>
          </div>

          <div className="panel overflow-hidden">
            {chants === null ? (
              <div className="space-y-2 p-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-12" />
                ))}
              </div>
            ) : chants.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-grass">
                No chants yet. Be the first voice in the stadium.
              </p>
            ) : (
              chants.slice(0, 3).map((c) => {
                const team = getTeam(c.team);
                return (
                  <div
                    key={`${c.author.toBase58()}-${c.timestamp}`}
                    className="flex items-start gap-3 border-b border-edge-soft px-4 py-3 last:border-0"
                  >
                    <span className="text-xl">{team.flag}</span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm">{c.text}</p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {team.code} · {timeAgo(c.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <Link
              href="/chants"
              className="block border-t border-edge-soft px-4 py-2.5 text-center text-sm text-gold transition hover:bg-pitch/20"
            >
              Hear them all →
            </Link>
          </div>
        </div>
      </section>

      <section className="panel relative overflow-hidden px-6 py-12 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(600px_260px_at_50%_0%,rgba(18,78,102,0.35),transparent_70%)]" />
        <h2 className="metal-text relative font-display text-4xl uppercase tracking-tight sm:text-5xl">
          Your nation needs you
        </h2>
        <p className="relative mt-3 text-sm text-grass">
          Free to join, two minutes to set up, bragging rights forever.
        </p>
        <div className="relative mt-7 flex flex-wrap justify-center gap-3">
          <Link
            href="/card"
            className="rounded-full bg-pitch px-7 py-3 font-semibold text-night transition hover:bg-pitch-2"
          >
            Get your Fan Card
          </Link>
          <Link
            href="/demo"
            className="rounded-full border border-edge px-7 py-3 font-semibold text-chalk transition hover:border-gold/50 hover:text-gold"
          >
            Try the demo
          </Link>
        </div>
      </section>
    </div>
  );
}

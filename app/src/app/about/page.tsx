import Link from "next/link";
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
    href: "/leaderboard",
    cta: "Check the table",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <header>
        <h1 className="font-display text-4xl uppercase leading-none tracking-tight sm:text-5xl">
          What is <span className="text-gold">12</span>th Man?
        </h1>
        <p className="mt-3 text-grass">
          Every team has eleven players. The twelfth is the crowd, and that&apos;s
          you. This is where World Cup fans back their team, cheer, and call
          the scores. Everything you do here is saved permanently, so your
          support and your predictions are provable, forever.
        </p>
      </header>

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
      </section>

      <section className="space-y-3">
        <SectionTitle kicker="Money">Does it cost real money?</SectionTitle>
        <p className="text-sm leading-relaxed text-grass">
          No. Right now it runs on Solana&apos;s test network, so everything is play
          money, nothing costs anything real. There are even{" "}
          <Link
            href="/demo"
            className="text-gold underline-offset-4 hover:underline"
          >
            ready-made test accounts
          </Link>{" "}
          so you can try it in two minutes.
        </p>
      </section>

      <section className="space-y-3">
        <SectionTitle kicker="The fine print">Good to know</SectionTitle>
        <ul className="space-y-2 text-sm leading-relaxed text-grass">
          <li>
            Match results come from the live broadcast feed and are posted
            automatically after full time.
          </li>
          <li>One Fan Card per wallet, forever. Choose your team with your heart.</li>
        </ul>
      </section>

      <div className="flex flex-wrap gap-3 pt-2">
        <Link
          href="/demo"
          className="rounded-full bg-pitch px-7 py-3 font-semibold text-chalk transition hover:bg-pitch-2"
        >
          Try the demo
        </Link>
        <Link
          href="/card"
          className="rounded-full border border-edge px-7 py-3 font-semibold text-chalk transition hover:border-gold/50 hover:text-gold"
        >
          Get your Fan Card
        </Link>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";

const SCOREBOARD =
  "https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/scoreboard";

// ESPN's soccer abbreviations are FIFA codes, so we can key by home-away
// and match against on-chain fixtures directly.
export async function GET() {
  const res = await fetch(SCOREBOARD, { next: { revalidate: 30 } });
  if (!res.ok) {
    return NextResponse.json({ scores: [] }, { status: 200 });
  }
  const data = await res.json();

  const scores = (data.events ?? []).map((e: any) => {
    const comp = e.competitions?.[0];
    const side = (ha: string) =>
      comp?.competitors?.find((c: any) => c.homeAway === ha);
    const home = side("home");
    const away = side("away");
    return {
      home: home?.team?.abbreviation ?? "",
      away: away?.team?.abbreviation ?? "",
      homeScore: Number(home?.score ?? 0),
      awayScore: Number(away?.score ?? 0),
      state: comp?.status?.type?.state ?? "pre", // pre | in | post
      completed: Boolean(comp?.status?.type?.completed),
      clock: comp?.status?.displayClock ?? "",
    };
  });

  return NextResponse.json({ scores });
}

import { getTeam } from "@/lib/teams";

export function TeamBadge({ code, name = false }: { code: string; name?: boolean }) {
  const team = getTeam(code);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold"
      style={{
        borderColor: `${team.primary}55`,
        background: `${team.primary}14`,
      }}
    >
      <span className="text-sm leading-none">{team.flag}</span>
      <span className="tracking-wide">{name ? team.name : team.code}</span>
    </span>
  );
}

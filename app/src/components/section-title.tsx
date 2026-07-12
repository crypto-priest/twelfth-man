// broadcast lower-third: tiny kicker line, gold slash, big condensed title
export function SectionTitle({
  children,
  kicker,
  live = false,
}: {
  children: React.ReactNode;
  kicker?: string;
  live?: boolean;
}) {
  return (
    <div>
      {(kicker || live) && (
        <div className="mb-1.5 flex items-center gap-2">
          {live && <span className="live-bug">Live</span>}
          {kicker && (
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              {kicker}
            </span>
          )}
        </div>
      )}
      <h2 className="flex items-center gap-2.5 font-head text-lg font-semibold uppercase leading-none tracking-wide text-chalk">
        <span
          aria-hidden
          className="h-[16px] w-[5px] -skew-x-[14deg] rounded-[1px] bg-gold"
        />
        {children}
      </h2>
    </div>
  );
}

export function SectionTitle({
  children,
  live = false,
}: {
  children: React.ReactNode;
  live?: boolean;
}) {
  return (
    <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-grass">
      {live && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inset-0 rounded-full bg-pitch animate-pulse-ring" />
          <span className="relative h-1.5 w-1.5 rounded-full bg-pitch" />
        </span>
      )}
      {children}
    </h2>
  );
}

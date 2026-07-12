// every page opens like a small cut of the hero
export function PageHeader({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <header className="relative left-1/2 -mt-8 mb-10 w-screen -translate-x-1/2 overflow-hidden border-b border-edge-soft">
      <div className="absolute inset-0 bg-[radial-gradient(700px_280px_at_50%_-10%,rgba(211,217,212,0.1),transparent_70%)]" />
      <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-14 text-center sm:px-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-muted">
          {kicker}
        </p>
        <h1 className="metal-text mt-3 font-display text-4xl uppercase leading-none tracking-tight sm:text-6xl">
          {title}
        </h1>
        {sub && <p className="mx-auto mt-4 max-w-xl text-sm text-grass">{sub}</p>}
      </div>
    </header>
  );
}

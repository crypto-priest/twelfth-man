export function EmptyState({
  icon,
  title,
  body,
  children,
}: {
  icon: string;
  title: string;
  body?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="text-4xl">{icon}</span>
      <p className="font-display text-2xl font-semibold uppercase tracking-wide">
        {title}
      </p>
      {body && <p className="max-w-md text-sm text-grass">{body}</p>}
      {children}
    </div>
  );
}

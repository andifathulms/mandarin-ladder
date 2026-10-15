export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="label inline-flex items-center rounded-full border border-rule px-2 py-px text-muted">
      {children}
    </span>
  );
}

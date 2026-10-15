export function StepLabel({ children, id }: { children: React.ReactNode; id?: string }) {
  return (
    <h2 id={id} tabIndex={-1} className="label text-accent outline-none">
      {children}
    </h2>
  );
}

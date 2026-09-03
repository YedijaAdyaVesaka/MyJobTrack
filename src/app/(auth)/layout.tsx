export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-muted/40 p-4">
      {/* Decorative gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-[340px] w-[340px] rounded-full bg-primary/5 blur-3xl" />
      <div className="relative z-10 animate-slide-up">{children}</div>
    </div>
  );
}

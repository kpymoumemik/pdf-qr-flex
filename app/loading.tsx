export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-5">
        <div className="mb-6 h-10 w-48 animate-pulse rounded-md bg-white/10" />
        <div className="grid gap-4">
          <div className="h-28 animate-pulse rounded-md border border-white/10 bg-white/8" />
          <div className="h-28 animate-pulse rounded-md border border-white/10 bg-white/8" />
          <div className="h-28 animate-pulse rounded-md border border-white/10 bg-white/8" />
        </div>
      </div>
    </main>
  );
}

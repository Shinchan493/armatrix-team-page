"use client";

export default function TeamSkeleton() {
  return (
    <section className="page-container grid grid-cols-1 gap-6 pb-28 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative overflow-hidden rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-card)] p-5"
        >
          <div className="mb-4 h-56 animate-pulse rounded-2xl bg-[var(--bg-card-hover)]" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--bg-card-hover)]" />
          <div className="mt-3 h-3 w-1/2 animate-pulse rounded bg-[var(--bg-card-hover)]" />
          <div className="mt-6 h-12 animate-pulse rounded bg-[var(--bg-card-hover)]" />
          <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
      ))}
    </section>
  );
}

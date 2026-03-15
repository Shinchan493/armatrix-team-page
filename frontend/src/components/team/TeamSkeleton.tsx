"use client";

export default function TeamSkeleton() {
  return (
    <section className="page-container flex flex-col items-center pt-16 pb-20 sm:pt-24 sm:pb-32 md:pt-32 md:pb-40">
      <div className="mx-auto grid w-full max-w-full justify-center gap-6 sm:gap-10 md:gap-14 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),360px))] md:[grid-template-columns:repeat(auto-fit,minmax(320px,380px))]">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="group relative min-h-[440px] w-full max-w-[380px] overflow-hidden rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-card)] p-6 md:p-8"
          >
            <div className="mb-4 h-80 animate-pulse rounded-2xl bg-[var(--bg-card-hover)]" />
            <div className="mx-auto h-3 w-1/3 animate-pulse rounded bg-[var(--bg-card-hover)] mt-2" />
            <div className="mx-auto mt-4 h-6 w-3/4 animate-pulse rounded bg-[var(--bg-card-hover)]" />
            <div className="mx-auto mt-5 h-4 w-full animate-pulse rounded bg-[var(--bg-card-hover)]" />
            <div className="mx-auto mt-2 h-4 w-5/6 animate-pulse rounded bg-[var(--bg-card-hover)]" />
            <div className="pointer-events-none absolute inset-0 -translate-x-full animate-[shimmer_2.2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        ))}
      </div>
    </section>
  );
}

"use client";

import { useSiteStats } from "@/hooks/queries/useSiteStats";
import { Reveal } from "@/components/landing/Reveal";

export function StatsSection() {
  const { data: stats, isLoading } = useSiteStats();

  if (!isLoading && (!stats || stats.length === 0)) {
    return null;
  }

  return (
    <section className="border-y border-brand-border bg-white py-10">
      <div className="container">
        <Reveal className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="text-center">
                  <div className="mx-auto h-9 w-16 animate-pulse rounded-md bg-slate-200" />
                  <div className="mx-auto mt-2 h-4 w-20 animate-pulse rounded-md bg-slate-200" />
                </div>
              ))
            : stats!.map((stat) => (
                <div key={stat.id} className="text-center">
                  <p className="gradient-text text-3xl font-extrabold sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-bold uppercase tracking-wider text-brand-muted sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
        </Reveal>
      </div>
    </section>
  );
}

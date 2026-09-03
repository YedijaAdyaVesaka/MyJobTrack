"use client";

import * as React from "react";
import { type JobApplication, STATUS_OPTIONS, STATUS_COLORS } from "@/lib/types";
import { Briefcase, CheckCircle2, Trophy, Clock, MapPin, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatistikView({ applications }: { applications: JobApplication[] }) {
  const total = applications.length;
  const countByStatus = (status: string) => applications.filter((a) => a.status === status).length;

  const respondedCount = total - countByStatus("applied");
  const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;
  const interviewRate = total > 0 ? Math.round(((countByStatus("interview") + countByStatus("offer") + countByStatus("accepted")) / total) * 100) : 0;
  const offerRate = total > 0 ? Math.round(((countByStatus("offer") + countByStatus("accepted")) / total) * 100) : 0;

  const sourceMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      const src = a.source || "Lainnya";
      map[src] = (map[src] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [applications]);

  const locationMap = React.useMemo(() => {
    const map: Record<string, number> = {};
    applications.forEach((a) => {
      const loc = a.location || "Tidak Ditentukan";
      map[loc] = (map[loc] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [applications]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistik & Analitik</h1>
        <p className="text-sm text-muted-foreground mt-1">Analisis dan visualisasi progres lamaran kamu.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Lamaran" val={total} icon={<Briefcase className="h-4 w-4 text-blue-500" />} gradient="from-blue-500/10 to-blue-500/5" border="border-blue-500/20" />
        <StatCard label="Tingkat Respons" val={`${responseRate}%`} icon={<Clock className="h-4 w-4 text-amber-500" />} gradient="from-amber-500/10 to-amber-500/5" border="border-amber-500/20" />
        <StatCard label="Lolos Wawancara" val={`${interviewRate}%`} icon={<CheckCircle2 className="h-4 w-4 text-indigo-500" />} gradient="from-indigo-500/10 to-indigo-500/5" border="border-indigo-500/20" />
        <StatCard label="Tingkat Penawaran" val={`${offerRate}%`} icon={<Trophy className="h-4 w-4 text-emerald-500" />} gradient="from-emerald-500/10 to-emerald-500/5" border="border-emerald-500/20" />
      </div>

      <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold">Distribusi Status Lamaran</h2>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data lamaran.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {STATUS_OPTIONS.map((st) => {
              const cnt = countByStatus(st.value);
              const pct = Math.round((cnt / total) * 100);
              const statusColor = STATUS_COLORS[st.value];
              return (
                <div key={st.value} className="rounded-xl border p-3.5 bg-muted/20 hover:bg-muted/40 transition-colors space-y-1">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className={cn("h-2 w-2 rounded-full", statusColor.split(" ")[0])} />
                    <span>{st.label}</span>
                  </div>
                  <div className="text-2xl font-bold tracking-tight tabular-nums">{cnt}</div>
                  <div className="text-[11px] text-muted-foreground tabular-nums font-medium">{pct}% dari total</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <BreakdownList title="Sumber Lamaran" icon={<Globe className="h-4 w-4 text-primary" />} items={sourceMap} total={total} />
        <BreakdownList title="Lokasi Perusahaan" icon={<MapPin className="h-4 w-4 text-primary" />} items={locationMap} total={total} />
      </div>
    </div>
  );
}

function StatCard({ label, val, icon, gradient, border }: { label: string; val: string | number; icon: React.ReactNode; gradient: string; border: string }) {
  return (
    <div className={cn("rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-all duration-200 hover:shadow-md", gradient, border)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</span>
        <div className="rounded-lg p-2 bg-background/80 shadow-xs backdrop-blur-xs">{icon}</div>
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight tabular-nums">{val}</div>
    </div>
  );
}

function BreakdownList({ title, icon, items, total }: { title: string; icon: React.ReactNode; items: [string, number][]; total: number }) {
  return (
    <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        <div className="rounded-lg p-2 bg-primary/10 text-primary">{icon}</div>
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada data.</p>
      ) : (
        <div className="space-y-3">
          {items.slice(0, 5).map(([key, count]) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={key} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-semibold tabular-nums">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

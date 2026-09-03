"use client";

import * as React from "react";
import { type JobApplication, STATUS_OPTIONS } from "@/lib/types";
import { Briefcase, CheckCircle2, Trophy, Clock, MapPin, Globe } from "lucide-react";

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
        <h1 className="text-2xl font-semibold tracking-tight">Statistik & Analitik</h1>
        <p className="text-sm text-muted-foreground mt-1">Analisis dan visualisasi progres lamaran kamu.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Lamaran" val={total} icon={<Briefcase className="h-4 w-4 text-blue-500" />} />
        <StatCard label="Tingkat Respons" val={`${responseRate}%`} icon={<Clock className="h-4 w-4 text-amber-500" />} />
        <StatCard label="Lolos Wawancara" val={`${interviewRate}%`} icon={<CheckCircle2 className="h-4 w-4 text-indigo-500" />} />
        <StatCard label="Tingkat Penawaran" val={`${offerRate}%`} icon={<Trophy className="h-4 w-4 text-emerald-500" />} />
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-base font-semibold">Distribusi Status Lamaran</h2>
        {total === 0 ? (
          <p className="text-sm text-muted-foreground">Belum ada data lamaran.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {STATUS_OPTIONS.map((st) => {
              const cnt = countByStatus(st.value);
              const pct = Math.round((cnt / total) * 100);
              return (
                <div key={st.value} className="rounded-lg border p-3 bg-muted/20">
                  <div className="text-xs text-muted-foreground">{st.label}</div>
                  <div className="text-lg font-bold mt-0.5">{cnt}</div>
                  <div className="text-[11px] text-muted-foreground">{pct}%</div>
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

function StatCard({ label, val, icon }: { label: string; val: string | number; icon: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase">{label}</span>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-bold">{val}</div>
    </div>
  );
}

function BreakdownList({ title, icon, items, total }: { title: string; icon: React.ReactNode; items: [string, number][]; total: number }) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Belum ada data.</p>
      ) : (
        <div className="space-y-2">
          {items.slice(0, 5).map(([key, count]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{key}</span>
              <span className="font-medium">{count} ({total > 0 ? Math.round((count / total) * 100) : 0}%)</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

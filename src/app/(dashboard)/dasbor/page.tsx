import { getApplications } from "@/lib/actions";
import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Calendar,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { DasborGreeting } from "@/components/dasbor-greeting";

export const dynamic = "force-dynamic";

export default async function DasborPage() {
  const applications = await getApplications();

  const total = applications.length;
  const interviewCount = applications.filter(
    (a) => a.status === "interview"
  ).length;
  const offerCount = applications.filter(
    (a) => a.status === "offer" || a.status === "accepted"
  ).length;
  const respondedCount = applications.filter(
    (a) => a.status !== "applied"
  ).length;
  const responseRate = total > 0 ? Math.round((respondedCount / total) * 100) : 0;

  const stats = [
    { label: "Total Lamaran", value: total.toString(), icon: Briefcase, gradient: "from-blue-500/10 to-blue-600/5", iconColor: "text-blue-500" },
    { label: "Wawancara", value: interviewCount.toString(), icon: MessageSquare, gradient: "from-amber-500/10 to-amber-600/5", iconColor: "text-amber-500" },
    { label: "Penawaran", value: offerCount.toString(), icon: CheckCircle2, gradient: "from-emerald-500/10 to-emerald-600/5", iconColor: "text-emerald-500" },
    { label: "Tingkat Respons", value: `${responseRate}%`, icon: TrendingUp, gradient: "from-violet-500/10 to-violet-600/5", iconColor: "text-violet-500" },
  ];

  const recent = applications.slice(0, 5);
  const upcomingFollowUps = applications
    .filter((a) => a.follow_up_date && new Date(a.follow_up_date) >= new Date())
    .sort((a, b) => new Date(a.follow_up_date!).getTime() - new Date(b.follow_up_date!).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <DasborGreeting />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-2xl border bg-gradient-to-br ${s.gradient} p-4 sm:p-5 shadow-sm transition-shadow hover:shadow-md`}>
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{s.label}</span>
              <div className={`rounded-xl p-1.5 sm:p-2 bg-background/60 ${s.iconColor} shrink-0`}>
                <s.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </div>
            </div>
            <p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold tabular-nums tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Applications */}
        <div className="lg:col-span-2 rounded-2xl border bg-card p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-base sm:text-lg font-semibold">Lamaran Terbaru</h2>
            <Link href="/lamaran" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Lihat semua <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex h-36 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-xs sm:text-sm text-center px-4">
              Belum ada lamaran. Mulai tambahkan lamaran pertamamu!
            </div>
          ) : (
            <div className="space-y-1">
              {recent.map((app) => (
                <div key={app.id} className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl px-3 py-2.5 hover:bg-muted/50 transition-colors gap-2 sm:gap-0">
                  <div>
                    <p className="font-semibold text-sm">{app.company_name}</p>
                    <p className="text-xs text-muted-foreground">{app.position}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                      {new Date(app.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agenda / Follow ups */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold">Agenda Mendatang</h2>
          </div>
          {upcomingFollowUps.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-xl border border-dashed text-muted-foreground text-sm text-center px-4">
              Belum ada agenda follow-up mendatang.
            </div>
          ) : (
            <div className="space-y-1">
              {upcomingFollowUps.map((app) => (
                <div key={app.id} className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-muted/50 transition-colors">
                  <div className="rounded-lg bg-primary/10 p-2 mt-0.5">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-xs">{app.company_name} — {app.position}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Follow-up: {new Date(app.follow_up_date!).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


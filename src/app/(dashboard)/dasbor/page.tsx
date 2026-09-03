import { getApplications } from "@/lib/actions";
import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Calendar,
  Building2,
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
    { label: "Total Lamaran", value: total.toString(), icon: Briefcase, color: "text-primary" },
    { label: "Wawancara", value: interviewCount.toString(), icon: MessageSquare, color: "text-warning" },
    { label: "Penawaran", value: offerCount.toString(), icon: CheckCircle2, color: "text-success" },
    { label: "Tingkat Respons", value: `${responseRate}%`, icon: TrendingUp, color: "text-primary" },
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Applications */}
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Lamaran Terbaru</h2>
            <Link href="/lamaran" className="text-xs text-primary hover:underline">
              Lihat semua →
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-muted-foreground text-sm">
              Belum ada lamaran. Mulai tambahkan lamaran pertamamu!
            </div>
          ) : (
            <div className="space-y-3">
              {recent.map((app) => (
                <div key={app.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm">{app.company_name}</p>
                    <p className="text-xs text-muted-foreground">{app.position}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={app.status} />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(app.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Agenda / Follow ups */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Agenda Mendatang</h2>
          </div>
          {upcomingFollowUps.length === 0 ? (
            <div className="flex h-36 items-center justify-center text-muted-foreground text-sm text-center">
              Belum ada agenda follow-up mendatang.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingFollowUps.map((app) => (
                <div key={app.id} className="flex items-start gap-2.5 text-sm border-b pb-2.5 last:border-b-0">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-xs">{app.company_name} — {app.position}</p>
                    <p className="text-[11px] text-muted-foreground">
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


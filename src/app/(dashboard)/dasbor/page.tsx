import {
  Briefcase,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";

const stats = [
  { label: "Total Lamaran", value: "0", icon: Briefcase, color: "text-primary" },
  { label: "Wawancara", value: "0", icon: MessageSquare, color: "text-warning" },
  { label: "Penawaran", value: "0", icon: CheckCircle2, color: "text-success" },
  { label: "Tingkat Respons", value: "0%", icon: TrendingUp, color: "text-primary" },
];

export default function DasborPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dasbor</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Selamat datang! Berikut ringkasan lamaran kamu.
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder sections — will be populated in Phase 2+ */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Progres Bulanan</h2>
          </div>
          <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
            Belum ada data lamaran. Mulai tambahkan lamaran pertamamu!
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Agenda Mendatang</h2>
          </div>
          <div className="flex h-48 items-center justify-center text-muted-foreground text-sm">
            Belum ada jadwal mendatang.
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Lamaran Terbaru</h2>
        </div>
        <div className="flex h-32 items-center justify-center text-muted-foreground text-sm">
          Belum ada lamaran. Klik &quot;Tambah Lamaran&quot; untuk memulai.
        </div>
      </div>
    </div>
  );
}

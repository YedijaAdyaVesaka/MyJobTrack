"use client";

import * as React from "react";
import { User, Download, ShieldCheck, Database, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { JobApplication } from "@/lib/types";

export function PengaturanView({
  userEmail,
  applications,
}: {
  userEmail: string;
  applications: JobApplication[];
}) {
  const [copied, setCopied] = React.useState(false);

  function exportCSV() {
    if (applications.length === 0) {
      alert("Belum ada data lamaran untuk diexport.");
      return;
    }

    const headers = ["Perusahaan", "Posisi", "Lokasi", "Tanggal Melamar", "Status", "Sumber", "Range Gaji", "URL Lowongan", "Catatan"];
    const rows = applications.map((a) => [
      `"${a.company_name.replace(/"/g, '""')}"`,
      `"${a.position.replace(/"/g, '""')}"`,
      `"${(a.location || "").replace(/"/g, '""')}"`,
      `"${a.applied_date}"`,
      `"${a.status}"`,
      `"${(a.source || "").replace(/"/g, '""')}"`,
      `"${(a.salary_range || "").replace(/"/g, '""')}"`,
      `"${(a.job_url || "").replace(/"/g, '""')}"`,
      `"${(a.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `myjobtrack_lamaran_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pengaturan Akun</h1>
        <p className="text-sm text-muted-foreground mt-1">Kelola akun dan ekspor data aplikasi kamu.</p>
      </div>

      <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3.5 pb-4 border-b">
          <div className="rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-3 text-primary ring-1 ring-primary/20 shadow-sm">
            <User className="h-6 w-6" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight">{userEmail}</div>
            <div className="text-xs text-muted-foreground font-medium">Akun Terverifikasi</div>
          </div>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Keamanan Akun</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="h-3.5 w-3.5" /> Dilindungi Supabase Auth
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border bg-card/80 backdrop-blur-sm p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl p-2 bg-primary/10 text-primary">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold">Manajemen Data</h2>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Kamu memiliki <strong className="text-foreground font-semibold">{applications.length}</strong> lamaran tersimpan. Unduh file CSV cadangan data lamaran kamu kapan saja.
        </p>

        <div className="pt-2">
          <Button onClick={exportCSV} variant="outline" className="gap-2 rounded-xl">
            <Download className="h-4 w-4" /> Ekspor Data (CSV)
          </Button>
        </div>
      </div>
    </div>
  );
}

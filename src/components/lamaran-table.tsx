"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, X, Search, Calendar, DollarSign, Clock, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LamaranForm } from "@/components/lamaran-form";
import { deleteApplication } from "@/lib/actions";
import type { JobApplication } from "@/lib/types";
import { STATUS_OPTIONS, STATUS_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { exportApplicationsToCSV } from "@/lib/export-csv";

interface LamaranTableProps {
  data: JobApplication[];
}

export function LamaranTable({ data }: LamaranTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") || searchParams.get("search") || "";
  const urlStatus = searchParams.get("status") || "all";

  const [formOpen, setFormOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<JobApplication | null>(null);
  const [queryState, setQueryState] = React.useState<string | null>(null);
  const [statusState, setStatusState] = React.useState<string | null>(null);
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const search = queryState ?? urlQ;
  const filterStatus = statusState ?? urlStatus;

  const filtered = data.filter((app) => {
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      app.company_name.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q)) ||
      (app.source && app.source.toLowerCase().includes(q)) ||
      (app.notes && app.notes.toLowerCase().includes(q)) ||
      (app.salary_range && app.salary_range.toLowerCase().includes(q));

    const matchStatus = filterStatus === "all" || app.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Apakah Anda yakin ingin menghapus lamaran ini?")) return;
    setDeleting(id);
    try {
      const res = await deleteApplication(id);
      if (res.success) {
        router.refresh();
      } else {
        alert(res.error || "Gagal menghapus");
      }
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Cari perusahaan, posisi, lokasi..."
              value={search}
              onChange={(e) => setQueryState(e.target.value)}
              className="pl-8 pr-8 w-full"
            />
            {search && (
              <button
                type="button"
                onClick={() => setQueryState("")}
                title="Hapus pencarian"
                aria-label="Hapus pencarian"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => exportApplicationsToCSV(filtered)}
              className="gap-1.5 cursor-pointer"
              title="Ekspor data lamaran ke file CSV"
              aria-label="Ekspor data lamaran ke file CSV"
            >
              <Download className="h-4 w-4" /> Ekspor CSV
            </Button>
            <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="cursor-pointer">
              <Plus className="h-4 w-4 mr-1.5" /> Tambah Lamaran
            </Button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
          <button
            type="button"
            onClick={() => setStatusState("all")}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer shrink-0",
              filterStatus === "all"
                ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold"
                : "bg-muted/50 text-muted-foreground border-transparent hover:bg-muted"
            )}
          >
            Semua ({data.length})
          </button>
          {STATUS_OPTIONS.map((s) => {
            const isSelected = filterStatus === s.value;
            const colorClass = STATUS_COLORS[s.value];
            const count = data.filter((item) => item.status === s.value).length;
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setStatusState(s.value)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border cursor-pointer shrink-0 inline-flex items-center gap-1.5",
                  isSelected
                    ? cn(colorClass, "shadow-xs ring-1 ring-primary/40 font-bold")
                    : "bg-card text-muted-foreground border-border hover:bg-muted"
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", isSelected ? "bg-current" : "bg-muted-foreground/40")} />
                {s.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* View Konten: Mobile Cards (< md) & Table Desktop (>= md) */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">Tidak ada lamaran yang ditemukan.</p>
          {(search || filterStatus !== "all") && (
            <Button variant="link" onClick={() => { setQueryState(""); setStatusState("all"); }} className="mt-2 text-xs">
              Reset filter
            </Button>
          )}
        </div>
      ) : (
        <>
          {/* Mobile View: Cards Layout */}
          <div className="grid gap-3 md:hidden">
            {filtered.map((app) => (
              <MobileCard
                key={app.id}
                app={app}
                deleting={deleting}
                onDelete={handleDelete}
                onEdit={(a) => {
                  setEditItem(a);
                  setFormOpen(true);
                }}
              />
            ))}
          </div>

          {/* Desktop View: Table Layout */}
          <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Perusahaan</th>
                    <th className="px-4 py-3">Posisi</th>
                    <th className="px-4 py-3">Lokasi</th>
                    <th className="px-4 py-3">Tanggal Melamar</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Sumber</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((app) => (
                    <Row
                      key={app.id}
                      app={app}
                      deleting={deleting}
                      onDelete={handleDelete}
                      onEdit={(a) => {
                        setEditItem(a);
                        setFormOpen(true);
                      }}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <LamaranForm
        open={formOpen}
        onOpenChange={setFormOpen}
        initialData={editItem}
      />
    </div>
  );
}
  


function MobileCard({ app, deleting, onDelete, onEdit }: {
  app: JobApplication;
  deleting: string | null;
  onDelete: (id: string) => void;
  onEdit: (app: JobApplication) => void;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 font-semibold text-sm">
            {app.company_name}
            {app.job_url && (
              <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">{app.position}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(app)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(app.id)} disabled={deleting === app.id} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs border-t border-b py-2 text-muted-foreground">
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 block">Lokasi</span>
          <span className="text-foreground font-medium">{app.location ?? "—"}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground/70 block">Tanggal Melamar</span>
          <span className="text-foreground font-medium">
            {new Date(app.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
          </span>
        </div>
      </div>

      {(app.salary_range || app.follow_up_date) && (
        <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
          {app.salary_range && (
            <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-md font-medium">
              <DollarSign className="h-3 w-3" /> {app.salary_range}
            </span>
          )}
          {app.follow_up_date && (
            <span className="inline-flex items-center gap-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md font-medium">
              <Calendar className="h-3 w-3" /> Follow-up: {new Date(app.follow_up_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
            </span>
          )}
        </div>
      )}

      {app.notes && (
        <p className="text-[11px] text-muted-foreground/90 italic bg-muted/40 p-2 rounded-lg line-clamp-2">
          &quot;{app.notes}&quot;
        </p>
      )}

      <div className="flex items-center justify-between pt-1">
        <span className="text-xs text-muted-foreground font-medium">Status:</span>
        <StatusBadge status={app.status} />
      </div>
    </div>
  );
}

function Row({ app, deleting, onDelete, onEdit }: {
  app: JobApplication;
  deleting: string | null;
  onDelete: (id: string) => void;
  onEdit: (app: JobApplication) => void;
}) {
  return (
    <tr className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3 font-medium">
        <div className="flex items-center gap-2">
          <span>{app.company_name}</span>
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {app.salary_range && (
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium block mt-0.5">
            {app.salary_range}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        <div>{app.position}</div>
        {app.follow_up_date && (
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1 mt-0.5">
            <Clock className="h-2.5 w-2.5" /> Follow-up: {new Date(app.follow_up_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">{app.location ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
        {new Date(app.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
      </td>
      <td className="px-4 py-3">
        <StatusBadge status={app.status} />
      </td>
      <td className="px-4 py-3 text-muted-foreground">{app.source ?? "—"}</td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(app)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer" title="Edit">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(app.id)} disabled={deleting === app.id} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 cursor-pointer" title="Hapus">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

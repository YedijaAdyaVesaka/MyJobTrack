"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LamaranForm } from "@/components/lamaran-form";
import { deleteApplication } from "@/lib/actions";
import type { JobApplication, JobStatus } from "@/lib/types";
import { STATUS_OPTIONS, STATUS_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";

interface LamaranTableProps {
  data: JobApplication[];
}

export function LamaranTable({ data }: LamaranTableProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<JobApplication | null>(null);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState<string>("all");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const filtered = data.filter((app) => {
    const matchSearch =
      app.company_name.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
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
          <Input
            placeholder="Cari perusahaan atau posisi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-72"
          />
          <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="shrink-0">
            <Plus className="h-4 w-4 mr-1.5" /> Tambah Lamaran
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar -mx-1 px-1">
          <button
            type="button"
            onClick={() => setFilterStatus("all")}
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
                onClick={() => setFilterStatus(s.value)}
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
            <Button variant="link" onClick={() => { setSearch(""); setFilterStatus("all"); }} className="mt-2 text-xs">
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
          <button onClick={() => onEdit(app)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(app.id)} disabled={deleting === app.id} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50">
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
          {app.company_name}
          {app.job_url && (
            <a href={app.job_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{app.position}</td>
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
          <button onClick={() => onEdit(app)} className="rounded p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => onDelete(app.id)} disabled={deleting === app.id} className="rounded p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

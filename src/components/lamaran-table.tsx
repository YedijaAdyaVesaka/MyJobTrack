"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, ExternalLink, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { LamaranForm } from "@/components/lamaran-form";
import { deleteApplication, updateApplicationStatus } from "@/lib/actions";
import type { JobApplication, JobStatus } from "@/lib/types";
import { STATUS_OPTIONS, STATUS_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LamaranTableProps {
  data: JobApplication[];
}

function StatusDropdown({ status, onChange }: { status: JobStatus; onChange: (s: JobStatus) => void }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  const currentOption = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
  const colorClass = STATUS_COLORS[status] || "bg-secondary text-secondary-foreground border-border";

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all hover:scale-[1.02] active:scale-[0.98]",
          colorClass
        )}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
        <span>{currentOption.label}</span>
        <ChevronDown className={cn("h-3 w-3 opacity-60 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 sm:left-0 z-50 mt-1.5 w-40 rounded-xl border bg-popover/95 backdrop-blur-md p-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 zoom-in-95">
          {STATUS_OPTIONS.map((opt) => {
            const isSelected = opt.value === status;
            const badgeColor = STATUS_COLORS[opt.value];
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors",
                  isSelected ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-muted text-popover-foreground"
                )}
              >
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", badgeColor.split(" ")[0])} />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function LamaranTable({ data }: LamaranTableProps) {
  const router = useRouter();
  const [formOpen, setFormOpen] = React.useState(false);
  const [editItem, setEditItem] = React.useState<JobApplication | null>(null);
  const [search, setSearch] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("all");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  const filtered = data.filter((d) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      d.company_name.toLowerCase().includes(q) ||
      d.position.toLowerCase().includes(q) ||
      (d.location && d.location.toLowerCase().includes(q));
    const matchStatus = filterStatus === "all" || d.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function handleDelete(id: string) {
    if (!confirm("Yakin ingin menghapus lamaran ini?")) return;
    setDeleting(id);
    const res = await deleteApplication(id);
    if (!res.success) {
      alert(res.error || "Gagal menghapus lamaran.");
    } else {
      router.refresh();
    }
    setDeleting(null);
  }

  async function handleStatusChange(id: string, status: JobStatus) {
    const res = await updateApplicationStatus(id, status);
    if (!res.success) {
      alert(res.error || "Gagal mengubah status lamaran.");
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input placeholder="Cari perusahaan atau posisi..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full sm:w-64" />
          <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full sm:w-44">
            <option value="all">Semua Status</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </Select>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }}>
          <Plus className="h-4 w-4" /> Tambah Lamaran
        </Button>
      </div>
      {/* View Konten: Mobile Cards (< md) & Table Desktop (>= md) */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 shadow-sm flex flex-col items-center justify-center text-muted-foreground text-sm gap-2">
          {data.length === 0
            ? "Belum ada lamaran. Klik tombol di atas untuk menambahkan!"
            : "Tidak ada lamaran yang cocok."}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {filtered.map((app) => (
              <MobileCard
                key={app.id}
                app={app}
                deleting={deleting}
                onDelete={handleDelete}
                onStatusChange={handleStatusChange}
                onEdit={(a) => { setEditItem(a); setFormOpen(true); }}
              />
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block rounded-xl border bg-card shadow-sm overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <th className="px-4 py-3">Perusahaan</th>
                  <th className="px-4 py-3">Posisi</th>
                  <th className="px-4 py-3">Lokasi</th>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Sumber</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <Row key={app.id} app={app} deleting={deleting} onDelete={handleDelete} onStatusChange={handleStatusChange} onEdit={(a) => { setEditItem(a); setFormOpen(true); }} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="text-xs text-muted-foreground text-right">
        Menampilkan {filtered.length} dari {data.length} lamaran
      </div>

      <LamaranForm open={formOpen} onOpenChange={setFormOpen} initialData={editItem} />
    </div>
  );
}

function MobileCard({ app, deleting, onDelete, onStatusChange, onEdit }: {
  app: JobApplication;
  deleting: string | null;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
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
        <StatusDropdown status={app.status} onChange={(status) => onStatusChange(app.id, status)} />
      </div>
    </div>
  );
}

function Row({ app, deleting, onDelete, onStatusChange, onEdit }: {
  app: JobApplication;
  deleting: string | null;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: JobStatus) => void;
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
        <StatusDropdown status={app.status} onChange={(status) => onStatusChange(app.id, status)} />
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

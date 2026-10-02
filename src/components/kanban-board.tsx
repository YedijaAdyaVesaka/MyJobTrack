"use client";

import * as React from "react";
import { type JobApplication, type JobStatus, STATUS_OPTIONS, STATUS_COLORS } from "@/lib/types";
import { updateApplicationStatus, deleteApplication } from "@/lib/actions";
import { Trash2, Pencil, MapPin, Calendar, ChevronRight, ChevronLeft, Plus, DollarSign, Clock } from "lucide-react";
import { LamaranForm } from "@/components/lamaran-form";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function KanbanBoard({ initialApplications }: { initialApplications: JobApplication[] }) {
  const [apps, setApps] = React.useState<JobApplication[]>(initialApplications);
  const [prevInitialApps, setPrevInitialApps] = React.useState(initialApplications);
  const [editItem, setEditItem] = React.useState<JobApplication | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [dragOverCol, setDragOverCol] = React.useState<JobStatus | null>(null);

  if (initialApplications !== prevInitialApps) {
    setPrevInitialApps(initialApplications);
    setApps(initialApplications);
  }

  const columns: JobStatus[] = ["applied", "screening", "interview", "offer", "accepted", "rejected"];

  async function moveStatus(id: string, status: JobStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    const res = await updateApplicationStatus(id, status);
    if (!res.success) {
      setApps(initialApplications);
      alert(res.error || "Gagal mengubah status lamaran.");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus lamaran ini?")) return;
    setApps((prev) => prev.filter((a) => a.id !== id));
    const res = await deleteApplication(id);
    if (!res.success) {
      setApps(initialApplications);
      alert(res.error || "Gagal menghapus lamaran.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kanban Board</h1>
          <p className="text-sm text-muted-foreground mt-1">Pantau & kelola alur tahapan lamaran kamu (drag & drop atau gunakan tombol arah).</p>
        </div>
        <Button onClick={() => { setEditItem(null); setFormOpen(true); }} className="shrink-0 cursor-pointer self-start sm:self-auto">
          <Plus className="h-4 w-4 mr-1.5" /> Tambah Lamaran
        </Button>
      </div>

      {/* Mobile-optimized Kanban grid with swipe snapping */}
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 md:overflow-visible items-start">
        {columns.map((colKey) => {
          const info = STATUS_OPTIONS.find((s) => s.value === colKey);
          const colApps = apps.filter((a) => a.status === colKey);
          const isOver = dragOverCol === colKey;

          return (
            <div
              key={colKey}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverCol(colKey);
              }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverCol(null);
                const id = e.dataTransfer.getData("text/plain");
                if (id) moveStatus(id, colKey);
              }}
              className={cn(
                "flex flex-col rounded-2xl border bg-muted/20 w-[85vw] max-w-[300px] shrink-0 snap-center md:w-auto md:max-w-none md:shrink min-h-[460px] overflow-hidden transition-all duration-200",
                isOver ? "ring-2 ring-primary/70 bg-primary/5" : "border-border/60"
              )}
            >
              <div className="flex items-center justify-between px-3.5 py-3 border-b border-border/60 bg-card/50">
                <div className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full", STATUS_COLORS[colKey].split(" ")[0])} />
                  <span className="font-semibold text-sm">{info?.label}</span>
                </div>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground tabular-nums">{colApps.length}</span>
              </div>

              <div className="flex-1 space-y-2.5 p-3">
                {colApps.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-muted-foreground/50 border border-dashed rounded-xl">
                    Tarik kartu ke sini
                  </div>
                ) : (
                  colApps.map((a) => {
                    const idx = columns.indexOf(a.status);
                    const prev = idx > 0 ? columns[idx - 1] : null;
                    const next = idx < columns.length - 1 ? columns[idx + 1] : null;

                    return (
                      <div
                        key={a.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", a.id);
                          e.dataTransfer.effectAllowed = "move";
                        }}
                        className="rounded-xl border bg-card p-3.5 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{a.company_name}</h3>
                          <div className="flex items-center">
                            <button onClick={() => { setEditItem(a); setFormOpen(true); }} className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer" title="Edit">
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer" title="Hapus">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">{a.position}</p>

                        <div className="mt-2.5 space-y-1 text-xs text-muted-foreground">
                          {a.location && (
                            <div className="flex items-center gap-1.5 line-clamp-1">
                              <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                              <span>{a.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                            <span className="tabular-nums">{new Date(a.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                          </div>
                          {a.salary_range && (
                            <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                              <DollarSign className="h-3 w-3 shrink-0" />
                              <span className="line-clamp-1">{a.salary_range}</span>
                            </div>
                          )}
                          {a.follow_up_date && (
                            <div className="flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span>Follow-up: {new Date(a.follow_up_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between">
                          <button disabled={!prev} onClick={() => prev && moveStatus(a.id, prev)} className="rounded-lg p-1 text-muted-foreground disabled:opacity-20 hover:text-foreground hover:bg-muted transition-colors cursor-pointer" title="Geser ke kiri">
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button disabled={!next} onClick={() => next && moveStatus(a.id, next)} className="rounded-lg p-1 text-primary disabled:opacity-20 hover:bg-primary/10 transition-colors cursor-pointer" title="Geser ke kanan">
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <LamaranForm open={formOpen} onOpenChange={setFormOpen} initialData={editItem} />
    </div>
  );
}

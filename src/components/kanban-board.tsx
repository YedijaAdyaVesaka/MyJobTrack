"use client";

import * as React from "react";
import { type JobApplication, type JobStatus, STATUS_OPTIONS } from "@/lib/types";
import { updateApplicationStatus, deleteApplication } from "@/lib/actions";
import { Trash2, Pencil, MapPin, Calendar, ChevronRight, ChevronLeft } from "lucide-react";
import { LamaranForm } from "@/components/lamaran-form";

export function KanbanBoard({ initialApplications }: { initialApplications: JobApplication[] }) {
  const [apps, setApps] = React.useState<JobApplication[]>(initialApplications);
  const [editItem, setEditItem] = React.useState<JobApplication | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  React.useEffect(() => { setApps(initialApplications); }, [initialApplications]);

  const columns: JobStatus[] = ["applied", "screening", "interview", "offer", "accepted", "rejected"];

  async function moveStatus(id: string, status: JobStatus) {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    try { await updateApplicationStatus(id, status); }
    catch { setApps(initialApplications); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Hapus lamaran ini?")) return;
    setApps((prev) => prev.filter((a) => a.id !== id));
    try { await deleteApplication(id); }
    catch { setApps(initialApplications); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Kanban Board</h1>
        <p className="text-sm text-muted-foreground mt-1">Pantau & kelola alur tahapan lamaran kamu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 items-start overflow-x-auto pb-4">
        {columns.map((colKey) => {
          const info = STATUS_OPTIONS.find((s) => s.value === colKey);
          const colApps = apps.filter((a) => a.status === colKey);

          return (
            <div key={colKey} className="flex flex-col rounded-xl border bg-muted/30 p-3 min-w-[240px] min-h-[460px]">
              <div className="flex items-center justify-between pb-3 mb-2 border-b">
                <span className="font-semibold text-sm">{info?.label}</span>
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{colApps.length}</span>
              </div>

              <div className="flex-1 space-y-3">
                {colApps.length === 0 ? (
                  <div className="h-24 flex items-center justify-center text-xs text-muted-foreground/60 border border-dashed rounded-lg">Kosong</div>
                ) : (
                  colApps.map((a) => {
                    const idx = columns.indexOf(a.status);
                    const prev = idx > 0 ? columns[idx - 1] : null;
                    const next = idx < columns.length - 1 ? columns[idx + 1] : null;

                    return (
                      <div key={a.id} className="rounded-lg border bg-card p-3 shadow-sm hover:shadow transition-shadow">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="font-semibold text-sm line-clamp-1">{a.company_name}</h3>
                          <div className="flex items-center">
                            <button onClick={() => { setEditItem(a); setFormOpen(true); }} className="p-1 text-muted-foreground hover:text-foreground">
                              <Pencil className="h-3 w-3" />
                            </button>
                            <button onClick={() => handleDelete(a.id)} className="p-1 text-muted-foreground hover:text-destructive">
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground font-medium mt-0.5 line-clamp-1">{a.position}</p>

                        <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                          {a.location && (
                            <div className="flex items-center gap-1 line-clamp-1">
                              <MapPin className="h-3 w-3 shrink-0" />
                              <span>{a.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{new Date(a.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</span>
                          </div>
                        </div>

                        <div className="mt-3 pt-2 border-t flex items-center justify-between">
                          <button disabled={!prev} onClick={() => prev && moveStatus(a.id, prev)} className="p-1 text-muted-foreground disabled:opacity-20 hover:text-foreground">
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </button>
                          <button disabled={!next} onClick={() => next && moveStatus(a.id, next)} className="p-1 text-primary disabled:opacity-20 hover:text-primary/80">
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

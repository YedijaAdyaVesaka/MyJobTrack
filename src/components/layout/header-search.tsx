"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, X, MapPin, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { StatusBadge } from "@/components/ui/status-badge";
import type { JobApplication } from "@/lib/types";

export function HeaderSearch() {
  const router = useRouter();
  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [applications, setApplications] = React.useState<JobApplication[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const loadData = React.useCallback(async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("job_applications")
        .select("*")
        .eq("is_deleted", false)
        .order("applied_date", { ascending: false });
      if (data) setApplications(data);
    } catch {}
  }, []);

  React.useEffect(() => {
    let ignore = false;
    async function init() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("job_applications")
          .select("*")
          .eq("is_deleted", false)
          .order("applied_date", { ascending: false });
        if (!ignore && data) setApplications(data);
      } catch {}
    }
    init();
    return () => { ignore = true; };
  }, []);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsOpen(true);
        loadData();
        setTimeout(() => inputRef.current?.focus(), 50);
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loadData]);

  React.useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const results = React.useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return applications.filter((app) =>
      app.company_name.toLowerCase().includes(q) ||
      app.position.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q)) ||
      (app.source && app.source.toLowerCase().includes(q)) ||
      (app.notes && app.notes.toLowerCase().includes(q))
    );
  }, [applications, query]);

  function submit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (query.trim()) {
      router.push(`/lamaran?q=${encodeURIComponent(query.trim())}`);
      setIsOpen(false);
    }
  }

  function pick(company: string) {
    router.push(`/lamaran?q=${encodeURIComponent(company)}`);
    setIsOpen(false);
    setQuery("");
  }

  return (
    <div className="relative" ref={containerRef}>
      {isOpen ? (
        <div className="flex items-center">
          <form onSubmit={submit} className="relative flex items-center">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Cari perusahaan, posisi, lokasi..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              className="h-8 w-44 sm:w-60 md:w-72 rounded-xl border border-primary/50 bg-background pl-8 pr-7 py-1 text-xs shadow-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-7 top-1/2 -translate-y-1/2 p-0.5 text-muted-foreground hover:text-foreground cursor-pointer"
                title="Kosongkan"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="ml-1 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer"
              title="Tutup"
            >
              <X className="h-4 w-4" />
            </button>
          </form>

          {query.trim().length > 0 && (
            <div className="absolute right-0 top-full mt-2 w-[calc(100vw-2rem)] sm:w-96 md:w-[420px] rounded-2xl border border-border/80 bg-popover p-2 text-popover-foreground shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-border/60 text-xs">
                <span className="font-semibold text-muted-foreground">Hasil Pencarian</span>
                <span className="text-[11px] bg-primary/10 text-primary font-medium px-2 py-0.5 rounded-full">
                  {results.length} ditemukan
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto py-1 space-y-1">
                {results.length === 0 ? (
                  <div className="py-6 text-center text-xs text-muted-foreground space-y-1">
                    <p className="font-medium text-foreground">Tidak ada lamaran yang cocok</p>
                    <p className="text-[11px]">Coba cari nama perusahaan, posisi pekerjaan, atau lokasi.</p>
                  </div>
                ) : (
                  results.slice(0, 6).map((app) => (
                    <div
                      key={app.id}
                      onClick={() => pick(app.company_name)}
                      className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/70 transition-colors cursor-pointer group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors truncate">
                          {app.company_name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">{app.position}</p>
                        {app.location && (
                          <p className="text-[10px] text-muted-foreground/80 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="h-2.5 w-2.5 shrink-0" /> {app.location}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StatusBadge status={app.status} />
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {new Date(app.applied_date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {results.length > 0 && (
                <div className="border-t border-border/60 pt-1.5 px-1">
                  <button
                    onClick={() => submit()}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                  >
                    Lihat semua {results.length} hasil di tabel lamaran <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => {
            setIsOpen(true);
            loadData();
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          title="Cari lamaran (Ctrl+K)"
          className="flex items-center gap-2 rounded-xl border border-input/60 bg-muted/40 px-2.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-all cursor-pointer shadow-2xs"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="max-sm:hidden">Cari lamaran...</span>
          <kbd className="hidden md:inline-flex h-4 items-center gap-0.5 rounded border border-border/80 bg-background px-1 text-[10px] font-mono text-muted-foreground/80">
            ⌘K
          </kbd>
        </button>
      )}
    </div>
  );
}

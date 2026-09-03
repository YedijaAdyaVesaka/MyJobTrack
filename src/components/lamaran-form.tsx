"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { STATUS_OPTIONS, SOURCE_OPTIONS, STATUS_COLORS, type JobApplication, type JobStatus } from "@/lib/types";
import { INDONESIA_LOCATIONS } from "@/lib/locations";
import { createApplication, updateApplication } from "@/lib/actions";
import { cn } from "@/lib/utils";

interface LamaranFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: JobApplication | null;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function LocationInput({ defaultValue }: { defaultValue?: string }) {
  const [query, setQuery] = React.useState(defaultValue ?? "");
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setQuery(defaultValue ?? "");
  }, [defaultValue]);

  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = React.useMemo(() => {
    if (!query.trim()) return INDONESIA_LOCATIONS.slice(0, 30);
    const q = query.toLowerCase();
    return INDONESIA_LOCATIONS.filter((loc) => loc.toLowerCase().includes(q)).slice(0, 40);
  }, [query]);

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      <Label htmlFor="location">Lokasi Perusahaan</Label>
      <input type="hidden" name="location" value={query} />
      <Input
        id="location"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        placeholder="Contoh: Kota Malang / Kabupaten Malang / Remote"
        autoComplete="off"
      />
      {isOpen && filtered.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1 z-[100] max-h-56 overflow-y-auto rounded-md border bg-popover py-1 shadow-lg text-popover-foreground text-sm">
          {filtered.map((loc) => (
            <li
              key={loc}
              onClick={() => {
                setQuery(loc);
                setIsOpen(false);
              }}
              className="cursor-pointer px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {loc}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function LamaranForm({ open, onOpenChange, initialData }: LamaranFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = React.useState<JobStatus>("applied");
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (open) {
      setError(null);
      setSelectedStatus(initialData?.status ?? "applied");
      if (formRef.current) formRef.current.reset();
    }
  }, [open, initialData]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {


      const fd = new FormData(formRef.current!);
      fd.set("status", selectedStatus);
      const res = initialData
        ? await updateApplication(initialData.id, fd)
        : await createApplication(fd);

      if (!res.success) {
        setError(res.error || "Terjadi kesalahan saat menyimpan data.");
        return;
      }

      onOpenChange(false);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle className="text-xl">{initialData ? "Edit Lamaran" : "Tambah Lamaran Baru"}</DialogTitle>
      </DialogHeader>

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="company_name">Nama Perusahaan *</Label>
            <Input id="company_name" name="company_name" required placeholder="Contoh: Google" defaultValue={initialData?.company_name ?? ""} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="position">Posisi *</Label>
            <Input id="position" name="position" required placeholder="Contoh: Frontend Developer" defaultValue={initialData?.position ?? ""} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Status Lamaran</Label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {STATUS_OPTIONS.map((s) => {
              const isSelected = selectedStatus === s.value;
              const colorClass = STATUS_COLORS[s.value];
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSelectedStatus(s.value)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer",
                    isSelected
                      ? cn(colorClass, "ring-2 ring-primary/40 scale-[1.02] shadow-xs font-bold")
                      : "bg-muted/40 text-muted-foreground border-transparent hover:bg-muted"
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", isSelected ? "bg-current" : "bg-muted-foreground/40")} />
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <LocationInput defaultValue={initialData?.location ?? ""} />
          <div className="space-y-1.5">
            <Label htmlFor="applied_date">Tanggal Melamar *</Label>
            <Input id="applied_date" name="applied_date" type="date" required defaultValue={initialData?.applied_date ?? today()} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="source">Sumber Lamaran</Label>
            <Select id="source" name="source" defaultValue={initialData?.source ?? ""}>
              <option value="">Pilih sumber...</option>
              {SOURCE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="job_url">URL Lowongan</Label>
            <Input id="job_url" name="job_url" type="text" placeholder="https://..." defaultValue={initialData?.job_url ?? ""} />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="notes">Catatan</Label>
          <Textarea id="notes" name="notes" placeholder="Catatan tambahan..." rows={3} defaultValue={initialData?.notes ?? ""} />
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Batal
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : initialData ? "Simpan Perubahan" : "Tambah Lamaran"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}


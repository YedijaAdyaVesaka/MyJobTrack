import { STATUS_OPTIONS, type JobApplication } from "@/lib/types";

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

export function formatDateIndonesian(dateStr?: string | null): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const y = parts[0];
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (m >= 1 && m <= 12 && !isNaN(d)) {
      return `${d} ${MONTHS_ID[m - 1]} ${y}`;
    }
  }
  const dt = new Date(dateStr);
  return isNaN(dt.getTime())
    ? dateStr
    : dt.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function escapeCSV(val: string | number | null | undefined): string {
  if (val === null || val === undefined || val === "") return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

export function generateCSVContent(applications: JobApplication[]): string {
  const headers = [
    "No.",
    "Perusahaan",
    "Posisi",
    "Status",
    "Lokasi",
    "Tanggal Melamar",
    "Sumber",
    "Perkiraan Gaji",
    "Tanggal Follow-up",
    "URL Lowongan",
    "Catatan",
  ];

  const rows = applications.map((a, index) => {
    const statusLabel = STATUS_OPTIONS.find((s) => s.value === a.status)?.label ?? a.status;
    const cleanNotes = a.notes ? a.notes.replace(/\r?\n+/g, " ").trim() : "-";

    return [
      escapeCSV(index + 1),
      escapeCSV(a.company_name),
      escapeCSV(a.position),
      escapeCSV(statusLabel),
      escapeCSV(a.location || "-"),
      escapeCSV(formatDateIndonesian(a.applied_date)),
      escapeCSV(a.source || "-"),
      escapeCSV(a.salary_range || "-"),
      escapeCSV(formatDateIndonesian(a.follow_up_date)),
      escapeCSV(a.job_url || "-"),
      escapeCSV(cleanNotes),
    ].join(",");
  });

  return "\uFEFF" + [headers.map(escapeCSV).join(","), ...rows].join("\r\n");
}

export function exportApplicationsToCSV(
  applications: JobApplication[],
  filenamePrefix = "myjobtrack_lamaran"
) {
  if (applications.length === 0) {
    alert("Belum ada data lamaran untuk diekspor.");
    return;
  }

  const csvContent = generateCSVContent(applications);
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenamePrefix}_${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

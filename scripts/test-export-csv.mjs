import assert from "node:assert";

const STATUS_OPTIONS = [
  { value: "applied", label: "Dilamar" },
  { value: "screening", label: "Seleksi Administrasi" },
  { value: "interview", label: "Wawancara" },
  { value: "offer", label: "Penawaran" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

const MONTHS_ID = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function formatDateIndonesian(dateStr) {
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

function escapeCSV(val) {
  if (val === null || val === undefined || val === "") return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function generateCSVContent(applications) {
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

// Test cases
const mockApps = [
  {
    company_name: 'PT "Teknologi" Jaya',
    position: "Senior Frontend Engineer",
    status: "interview",
    location: "Jakarta Selatan",
    applied_date: "2026-10-02",
    source: "LinkedIn",
    salary_range: "Rp 15.000.000 - Rp 20.000.000",
    follow_up_date: "2026-10-10",
    job_url: "https://example.com/job/1",
    notes: "Tahap HR lolos.\nUser interview jam 14:00.",
  },
  {
    company_name: "Startup ABC",
    position: "React Developer",
    status: "applied",
    location: null,
    applied_date: "2026-09-15",
    source: null,
    salary_range: null,
    follow_up_date: null,
    job_url: null,
    notes: null,
  },
];

const csv = generateCSVContent(mockApps);

// Assertions
assert(csv.startsWith("\uFEFF"), "Must start with UTF-8 BOM");
const lines = csv.replace("\uFEFF", "").split("\r\n");
assert.strictEqual(lines.length, 3, "Header + 2 rows");

// Verify row 1
assert(lines[1].includes('"1"'), "First column is No. 1");
assert(lines[1].includes('"PT ""Teknologi"" Jaya"'), "Escapes quotes correctly");
assert(lines[1].includes('"Wawancara"'), "Maps interview to Wawancara");
assert(lines[1].includes('"2 Okt 2026"'), "Formats applied_date in Indonesian");
assert(lines[1].includes('"10 Okt 2026"'), "Formats follow_up_date in Indonesian");
assert(lines[1].includes('"Tahap HR lolos. User interview jam 14:00."'), "Collapses multiline notes");

// Verify row 2 (null values)
assert(lines[2].includes('"2"'), "Second column is No. 2");
assert(lines[2].includes('"Dilamar"'), "Maps applied to Dilamar");
assert(lines[2].includes('"15 Sep 2026"'), "Formats applied_date in Indonesian");
assert(lines[2].includes('"-"'), "Null fields fallback to dash");

console.log("All CSV export self-checks passed!");

export type JobStatus = "applied" | "screening" | "interview" | "offer" | "accepted" | "rejected";

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  position: string;
  location: string | null;
  applied_date: string;
  status: JobStatus;
  source: string | null;
  job_url: string | null;
  salary_range: string | null;
  recruiter_name?: string | null;
  recruiter_contact?: string | null;
  notes: string | null;
  follow_up_date?: string | null;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
}

export const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "applied", label: "Dilamar" },
  { value: "screening", label: "Seleksi Administrasi" },
  { value: "interview", label: "Wawancara" },
  { value: "offer", label: "Penawaran" },
  { value: "accepted", label: "Diterima" },
  { value: "rejected", label: "Ditolak" },
];

export const STATUS_COLORS: Record<JobStatus, string> = {
  applied: "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:text-blue-200 dark:border-blue-800",
  screening: "bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-950/80 dark:text-indigo-200 dark:border-indigo-800",
  interview: "bg-amber-100 text-amber-950 border-amber-300 dark:bg-amber-950/80 dark:text-amber-200 dark:border-amber-800",
  offer: "bg-emerald-100 text-emerald-950 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-200 dark:border-emerald-800",
  accepted: "bg-green-100 text-green-950 border-green-300 dark:bg-green-950/80 dark:text-green-200 dark:border-green-800",
  rejected: "bg-rose-100 text-rose-950 border-rose-300 dark:bg-rose-950/80 dark:text-rose-200 dark:border-rose-800",
};

export const SOURCE_OPTIONS = [
  "LinkedIn",
  "JobStreet",
  "Glints",
  "Kalibrr",
  "Indeed",
  "Website Perusahaan",
  "Referral",
  "Lainnya",
];


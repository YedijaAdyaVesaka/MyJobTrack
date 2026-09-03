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
  applied: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/90 dark:text-blue-400 dark:border-blue-800/60",
  screening: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/90 dark:text-indigo-400 dark:border-indigo-800/60",
  interview: "bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/90 dark:text-amber-400 dark:border-amber-800/60",
  offer: "bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-400 dark:border-emerald-800/60",
  accepted: "bg-green-100 text-green-900 border-green-200 dark:bg-green-950/90 dark:text-green-400 dark:border-green-800/60",
  rejected: "bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/90 dark:text-rose-400 dark:border-rose-800/60",
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


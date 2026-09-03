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
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  screening: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
  interview: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  offer: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  accepted: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-rose-100 text-rose-500 dark:bg-rose-900/30 dark:text-rose-300",
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


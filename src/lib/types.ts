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
  applied: "bg-blue-100/90 text-blue-700 border-blue-200 dark:bg-[#182649] dark:text-[#60a5fa] dark:border-blue-900/50",
  screening: "bg-indigo-100/90 text-indigo-700 border-indigo-200 dark:bg-[#1f1947] dark:text-[#818cf8] dark:border-indigo-900/50",
  interview: "bg-amber-100/90 text-amber-800 border-amber-200 dark:bg-[#3b280c] dark:text-[#fbbf24] dark:border-amber-900/50",
  offer: "bg-emerald-100/90 text-emerald-800 border-emerald-200 dark:bg-[#0e382b] dark:text-[#34d399] dark:border-emerald-900/50",
  accepted: "bg-green-100/90 text-green-800 border-green-200 dark:bg-[#133a18] dark:text-[#4ade80] dark:border-green-900/50",
  rejected: "bg-rose-100/90 text-rose-800 border-rose-200 dark:bg-[#42161e] dark:text-[#f87171] dark:border-rose-900/50",
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


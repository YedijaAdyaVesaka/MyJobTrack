"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { JobApplication, JobStatus } from "@/lib/types";

export async function getApplications(): Promise<JobApplication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("is_deleted", false)
    .order("applied_date", { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getApplicationById(id: string): Promise<JobApplication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("job_applications")
    .select("*")
    .eq("id", id)
    .eq("is_deleted", false)
    .single();

  if (error) return null;
  return data;
}

export async function createApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("job_applications").insert({
    user_id: user.id,
    company_name: formData.get("company_name") as string,
    position: formData.get("position") as string,
    location: (formData.get("location") as string) || null,
    applied_date: formData.get("applied_date") as string,
    status: (formData.get("status") as JobStatus) || "applied",
    source: (formData.get("source") as string) || null,
    job_url: (formData.get("job_url") as string) || null,
    salary_range: (formData.get("salary_range") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  if (error) throw new Error(error.message);
  revalidatePath("/lamaran");
  revalidatePath("/dasbor");
}

export async function updateApplication(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("job_applications")
    .update({
      company_name: formData.get("company_name") as string,
      position: formData.get("position") as string,
      location: (formData.get("location") as string) || null,
      applied_date: formData.get("applied_date") as string,
      status: formData.get("status") as JobStatus,
      source: (formData.get("source") as string) || null,
      job_url: (formData.get("job_url") as string) || null,
      salary_range: (formData.get("salary_range") as string) || null,
      notes: (formData.get("notes") as string) || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/lamaran");
  revalidatePath("/dasbor");
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();

  // Soft delete
  const { error } = await supabase
    .from("job_applications")
    .update({ is_deleted: true })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/lamaran");
  revalidatePath("/dasbor");
}

export async function updateApplicationStatus(id: string, status: JobStatus) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("job_applications")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/lamaran");
  revalidatePath("/dasbor");
}

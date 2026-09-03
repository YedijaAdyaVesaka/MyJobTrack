"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { JobApplication, JobStatus } from "@/lib/types";

export async function getApplications(): Promise<JobApplication[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("is_deleted", false)
      .order("applied_date", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return [];
    }
    return data ?? [];
  } catch (err) {
    console.error("Exception fetching applications:", err);
    return [];
  }
}

export async function getApplicationById(id: string): Promise<JobApplication | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("job_applications")
      .select("*")
      .eq("id", id)
      .eq("is_deleted", false)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function createApplication(formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi kamu telah berakhir. Silakan login kembali." };

    const company_name = (formData.get("company_name") as string || "").trim();
    const position = (formData.get("position") as string || "").trim();
    const location = (formData.get("location") as string || "").trim() || null;
    const applied_date = (formData.get("applied_date") as string || "").trim();
    const status = (formData.get("status") as JobStatus) || "applied";
    const source = (formData.get("source") as string || "").trim() || null;
    let job_url = (formData.get("job_url") as string || "").trim() || null;
    const notes = (formData.get("notes") as string || "").trim() || null;

    if (!company_name || !position || !applied_date) {
      return { success: false, error: "Nama Perusahaan, Posisi, dan Tanggal Melamar wajib diisi." };
    }

    if (job_url && !job_url.startsWith("http://") && !job_url.startsWith("https://")) {
      job_url = `https://${job_url}`;
    }

    const { error } = await supabase.from("job_applications").insert({
      user_id: user.id,
      company_name,
      position,
      location,
      applied_date,
      status,
      source,
      job_url,
      notes,
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/lamaran");
    revalidatePath("/dasbor");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menambah lamaran." };
  }
}

export async function updateApplication(id: string, formData: FormData): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: "Sesi kamu telah berakhir. Silakan login kembali." };

    const company_name = (formData.get("company_name") as string || "").trim();
    const position = (formData.get("position") as string || "").trim();
    const location = (formData.get("location") as string || "").trim() || null;
    const applied_date = (formData.get("applied_date") as string || "").trim();
    const status = formData.get("status") as JobStatus;
    const source = (formData.get("source") as string || "").trim() || null;
    let job_url = (formData.get("job_url") as string || "").trim() || null;
    const notes = (formData.get("notes") as string || "").trim() || null;

    if (!company_name || !position || !applied_date) {
      return { success: false, error: "Nama Perusahaan, Posisi, dan Tanggal Melamar wajib diisi." };
    }

    if (job_url && !job_url.startsWith("http://") && !job_url.startsWith("https://")) {
      job_url = `https://${job_url}`;
    }

    const { error } = await supabase
      .from("job_applications")
      .update({
        company_name,
        position,
        location,
        applied_date,
        status,
        source,
        job_url,
        notes,
      })
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return { success: false, error: error.message };
    }

    revalidatePath("/lamaran");
    revalidatePath("/dasbor");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengubah lamaran." };
  }
}

export async function deleteApplication(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("job_applications")
      .update({ is_deleted: true })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/lamaran");
    revalidatePath("/dasbor");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal menghapus lamaran." };
  }
}

export async function updateApplicationStatus(id: string, status: JobStatus): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("job_applications")
      .update({ status })
      .eq("id", id);

    if (error) return { success: false, error: error.message };

    revalidatePath("/lamaran");
    revalidatePath("/dasbor");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Gagal mengubah status lamaran." };
  }
}

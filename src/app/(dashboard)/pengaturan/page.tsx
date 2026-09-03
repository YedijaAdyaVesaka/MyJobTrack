import { createClient } from "@/lib/supabase/server";
import { getApplications } from "@/lib/actions";
import { PengaturanView } from "@/components/pengaturan-view";

export default async function PengaturanPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const applications = await getApplications();

  return <PengaturanView userEmail={user?.email ?? "User"} applications={applications} />;
}


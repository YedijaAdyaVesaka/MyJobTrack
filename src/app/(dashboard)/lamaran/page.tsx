import { getApplications } from "@/lib/actions";
import { LamaranTable } from "@/components/lamaran-table";

export const dynamic = "force-dynamic";

export default async function LamaranPage() {
  const data = await getApplications();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Daftar Lamaran</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola semua lamaran kerja kamu di sini.
        </p>
      </div>
      <LamaranTable data={data} />
    </div>
  );
}


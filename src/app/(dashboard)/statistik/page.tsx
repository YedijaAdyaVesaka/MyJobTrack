import { getApplications } from "@/lib/actions";
import { StatistikView } from "@/components/statistik-view";

export const dynamic = "force-dynamic";

export default async function StatistikPage() {
  const applications = await getApplications();
  return <StatistikView applications={applications} />;
}


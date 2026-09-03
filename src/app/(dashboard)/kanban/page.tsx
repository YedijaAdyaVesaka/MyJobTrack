import { getApplications } from "@/lib/actions";
import { KanbanBoard } from "@/components/kanban-board";

export const dynamic = "force-dynamic";

export default async function KanbanPage() {
  const applications = await getApplications();
  return <KanbanBoard initialApplications={applications} />;
}


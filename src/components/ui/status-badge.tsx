import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, STATUS_COLORS, type JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        STATUS_COLORS[status]
      )}
    >
      {label}
    </span>
  );
}

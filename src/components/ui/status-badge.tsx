import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, STATUS_COLORS, type JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold border shadow-2xs",
        STATUS_COLORS[status]
      )}
    >
      <span>{label}</span>
    </span>
  );
}

import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, STATUS_COLORS, type JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-3.5 py-1 text-xs font-semibold border transition-colors",
        STATUS_COLORS[status]
      )}
    >
      {label}
    </span>
  );
}


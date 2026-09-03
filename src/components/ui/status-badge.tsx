import { cn } from "@/lib/utils";
import { STATUS_OPTIONS, STATUS_COLORS, type JobStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: JobStatus }) {
  const label = STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status;
  const isActive = status === "interview" || status === "screening";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold border shadow-2xs",
        STATUS_COLORS[status]
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full bg-current shrink-0", isActive && "animate-dot-pulse")} />
      <span>{label}</span>
    </span>
  );
}

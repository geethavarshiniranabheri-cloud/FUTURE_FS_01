import { cn } from "@/lib/utils";
import type { LeadStatus } from "@/types/lead";

const statusConfig: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-info/15 text-info border-info/30" },
  contacted: { label: "Contacted", className: "bg-warning/15 text-warning border-warning/30" },
  converted: { label: "Converted", className: "bg-success/15 text-success border-success/30" },
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}

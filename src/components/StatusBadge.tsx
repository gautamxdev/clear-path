import type { ComplianceItemStatus } from "@/lib/types";

const statusConfig: Record<ComplianceItemStatus, { bg: string; text: string }> = {
  Completed: { bg: "bg-status-completed-bg", text: "text-status-completed" },
  Reviewed: { bg: "bg-status-reviewed-bg", text: "text-status-reviewed" },
};

export function StatusBadge({ status }: { status: ComplianceItemStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

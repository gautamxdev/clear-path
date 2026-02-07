import type { TaskStatus } from "@/lib/types";

const statusConfig: Record<TaskStatus, { bg: string; text: string }> = {
  Filed: { bg: "bg-status-filed-bg", text: "text-status-filed" },
  Pending: { bg: "bg-status-pending-bg", text: "text-status-pending" },
  "In Progress": { bg: "bg-status-in-progress-bg", text: "text-status-in-progress" },
  Overdue: { bg: "bg-status-overdue-bg", text: "text-status-overdue" },
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {status}
    </span>
  );
}

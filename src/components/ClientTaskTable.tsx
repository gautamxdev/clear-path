import { useNavigate } from "react-router-dom";
import type { ComplianceTask } from "@/lib/types";
import { getUserName, getLastActivity } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface ClientTaskTableProps {
  tasks: ComplianceTask[];
}

export function ClientTaskTable({ tasks }: ClientTaskTableProps) {
  const navigate = useNavigate();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No compliance tasks for this client and financial year.
      </div>
    );
  }

  return (
    <div className="border rounded-lg bg-card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-secondary/50">
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Task</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Status</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Assigned To</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Due Date</th>
            <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Last Activity</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const lastActivity = getLastActivity(task.id);
            const isOverdue = task.status === "Overdue";
            return (
              <tr
                key={task.id}
                onClick={() => navigate(`/task/${task.id}`)}
                className={cn(
                  "border-b last:border-b-0 cursor-pointer transition-colors",
                  isOverdue
                    ? "bg-status-overdue-bg/50 hover:bg-status-overdue-bg/80"
                    : "hover:bg-secondary/30"
                )}
              >
                <td className={cn("px-4 py-2.5 font-medium", isOverdue && "text-status-overdue")}>
                  {task.name}
                </td>
                <td className="px-4 py-2.5">
                  <StatusBadge status={task.status} />
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">{getUserName(task.assignedTo)}</td>
                <td className={cn("px-4 py-2.5 text-muted-foreground", isOverdue && "text-status-overdue font-medium")}>
                  {format(new Date(task.dueDate), "dd MMM yyyy")}
                </td>
                <td className="px-4 py-2.5 text-muted-foreground">
                  {lastActivity ? (
                    <div className="min-w-0">
                      <span className="text-xs">
                        {lastActivity.userName} · {lastActivity.action}
                      </span>
                      <span className="text-xs text-muted-foreground/60 ml-1">
                        {formatDistanceToNow(new Date(lastActivity.timestamp), { addSuffix: true })}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground/50">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

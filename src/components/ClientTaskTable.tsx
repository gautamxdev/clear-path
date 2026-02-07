import { useNavigate } from "react-router-dom";
import type { ComplianceTask } from "@/lib/types";
import { getUserName } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { format } from "date-fns";

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
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned To</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              onClick={() => navigate(`/task/${task.id}`)}
              className="border-b last:border-b-0 hover:bg-secondary/30 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 font-medium">{task.name}</td>
              <td className="px-4 py-3">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">{getUserName(task.assignedTo)}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {format(new Date(task.dueDate), "dd MMM yyyy")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

import { mockActivityLog, getUserName } from "@/lib/mock-data";
import { format } from "date-fns";
import { Clock } from "lucide-react";

interface ActivityLogProps {
  taskId: string;
}

export function ActivityLog({ taskId }: ActivityLogProps) {
  const entries = mockActivityLog
    .filter((e) => e.taskId === taskId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No activity yet.</p>;
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <div key={entry.id} className="flex gap-3 py-3 relative">
          {/* Timeline line */}
          {i < entries.length - 1 && (
            <div className="absolute left-[11px] top-[30px] bottom-0 w-px bg-border" />
          )}
          <div className="mt-1 flex-shrink-0">
            <div className="w-[22px] h-[22px] rounded-full bg-secondary flex items-center justify-center">
              <Clock className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{getUserName(entry.userId)}</span>{" "}
              <span className="text-muted-foreground">{entry.action}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(entry.timestamp), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useActivityLogs } from "@/hooks/useActivityLogs";
import { useProfiles } from "@/hooks/useProfiles";
import { formatDistanceToNow } from "date-fns";
import { Clock, Loader2 } from "lucide-react";

interface ActivityLogProps {
  complianceItemId: string;
}

function formatAction(entry: { action_type: string; metadata: any }): string {
  const meta = entry.metadata ?? {};
  switch (entry.action_type) {
    case "document_uploaded":
      return `Uploaded ${meta.fileName || "a document"}`;
    case "status_changed":
      return meta.from ? `Status changed from ${meta.from} to ${meta.to}` : `Status set to ${meta.status || meta.to || "unknown"}`;
    case "prepared_by_set":
      return `Prepared by updated`;
    case "reviewed_by_set":
      return `Reviewed by updated`;
    case "item_created":
      return `Item created: ${meta.title || ""}`;
    default:
      return entry.action_type.replace(/_/g, " ");
  }
}

export function ActivityLog({ complianceItemId }: ActivityLogProps) {
  const { data: logs, isLoading } = useActivityLogs(complianceItemId);
  const { data: profiles } = useProfiles();

  const getUserName = (userId: string | null) => {
    if (!userId || !profiles) return "System";
    const p = profiles.find((pr) => pr.id === userId);
    return p?.full_name || p?.email || "Unknown";
  };

  if (isLoading) {
    return <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
  }

  if (!logs || logs.length === 0) {
    return <p className="text-sm text-muted-foreground py-4">No activity yet.</p>;
  }

  return (
    <div className="space-y-0">
      {logs.map((entry, i) => (
        <div key={entry.id} className="flex gap-3 py-3 relative">
          {i < logs.length - 1 && (
            <div className="absolute left-[11px] top-[30px] bottom-0 w-px bg-border" />
          )}
          <div className="mt-1 flex-shrink-0">
            <div className="w-[22px] h-[22px] rounded-full bg-secondary flex items-center justify-center">
              <Clock className="w-3 h-3 text-muted-foreground" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              <span className="font-medium">{getUserName(entry.performed_by)}</span>{" "}
              <span className="text-muted-foreground">{formatAction(entry)}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

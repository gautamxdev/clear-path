import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Upload, User, Calendar, Building2, FolderOpen, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ActivityLog } from "@/components/ActivityLog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { useComplianceItem, useUpdateComplianceItem } from "@/hooks/useComplianceItems";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/contexts/AuthContext";

function DetailCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="border rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

export default function ComplianceItemDetail() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { data: item, isLoading } = useComplianceItem(itemId ?? null);
  const { data: profiles } = useProfiles();
  const { user } = useAuth();
  const updateItem = useUpdateComplianceItem();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Item not found.</p>
      </div>
    );
  }

  const section = item.section as any;
  const clientName = section?.client?.name ?? "Unknown";
  const sectionName = section?.name ?? "Unknown";
  const fyLabel = section?.financial_year?.label ?? "";
  const documents = (item.documents ?? []) as Array<{
    id: string; file_name: string; file_url: string; uploaded_by: string | null; uploaded_at: string; size: string | null;
  }>;

  const getUserName = (userId: string | null) => {
    if (!userId || !profiles) return "—";
    const p = profiles.find((pr) => pr.id === userId);
    return p?.full_name || p?.email || "—";
  };

  const handleStatusChange = (newStatus: string) => {
    const updates: Record<string, unknown> = { status: newStatus };
    if (newStatus === "Reviewed") {
      updates.reviewed_by = user?.id;
      updates.reviewed_at = new Date().toISOString();
    }
    updateItem.mutate({ id: item.id, updates });
  };

  const handlePreparedByChange = (userId: string) => {
    updateItem.mutate({ id: item.id, updates: { prepared_by: userId, prepared_at: new Date().toISOString() } });
  };

  const handleReviewedByChange = (userId: string) => {
    updateItem.mutate({ id: item.id, updates: { reviewed_by: userId, reviewed_at: new Date().toISOString() } });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
              <span>{clientName}</span><span>›</span><span>{fyLabel}</span><span>›</span><span>{sectionName}</span>
            </div>
            <h1 className="text-lg font-semibold">{item.title}</h1>
          </div>
          <StatusBadge status={item.status as "Completed" | "Reviewed"} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DetailCard icon={Building2} label="Client" value={clientName} />
          <DetailCard icon={Calendar} label="Financial Year" value={fyLabel} />
          <DetailCard icon={FolderOpen} label="Section" value={sectionName} />
          <DetailCard icon={User} label="Status" value={item.status} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3 space-y-2">
            <label className="text-xs text-muted-foreground">Prepared By</label>
            <Select value={item.prepared_by ?? ""} onValueChange={handlePreparedByChange}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select..." /></SelectTrigger>
              <SelectContent>
                {profiles?.map((u) => <SelectItem key={u.id} value={u.id}>{u.full_name || u.email}</SelectItem>)}
              </SelectContent>
            </Select>
            {item.prepared_at && <p className="text-xs text-muted-foreground">{format(new Date(item.prepared_at), "dd MMM yyyy, hh:mm a")}</p>}
          </div>
          <div className="border rounded-lg p-3 space-y-2">
            <label className="text-xs text-muted-foreground">Reviewed By</label>
            <Select value={item.reviewed_by ?? ""} onValueChange={handleReviewedByChange} disabled={item.status !== "Reviewed"}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder={item.status === "Reviewed" ? "Select..." : "Complete first"} /></SelectTrigger>
              <SelectContent>
                {profiles?.map((u) => <SelectItem key={u.id} value={u.id}>{u.full_name || u.email}</SelectItem>)}
              </SelectContent>
            </Select>
            {item.reviewed_at && <p className="text-xs text-muted-foreground">{format(new Date(item.reviewed_at), "dd MMM yyyy, hh:mm a")}</p>}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-1.5"><FileText className="w-4 h-4" /> Documents</h3>
            <Button variant="outline" size="sm" className="gap-1.5"><Upload className="w-3.5 h-3.5" /> Upload</Button>
          </div>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No documents uploaded.</p>
          ) : (
            <div className="border rounded-lg divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium">{doc.file_name}</span>
                    {doc.size && <span className="text-xs text-muted-foreground">{doc.size}</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getUserName(doc.uploaded_by)} · {format(new Date(doc.uploaded_at), "dd MMM yyyy")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Activity Timeline</h3>
          <ActivityLog complianceItemId={item.id} />
        </div>
      </div>
    </div>
  );
}

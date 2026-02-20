import { useParams, useNavigate } from "react-router-dom";
import { mockComplianceItems, mockDocuments, getUserName, getClientName, getFYLabel, getSectionName, mockUsers } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ActivityLog } from "@/components/ActivityLog";
import { ArrowLeft, FileText, Upload, User, Calendar, Building2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const item = mockComplianceItems.find((i) => i.id === itemId);
  if (!item) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Item not found.</p>
      </div>
    );
  }

  const documents = mockDocuments.filter((d) => d.complianceItemId === item.id);
  const staffUsers = mockUsers.filter((u) => u.role === "staff" || u.role === "admin");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-0.5">
              <span>{getClientName(item.clientId)}</span>
              <span>›</span>
              <span>{getFYLabel(item.financialYearId)}</span>
              <span>›</span>
              <span>{getSectionName(item.sectionId)}</span>
            </div>
            <h1 className="text-lg font-semibold">{item.title}</h1>
          </div>
          <StatusBadge status={item.status} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Detail cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <DetailCard icon={Building2} label="Client" value={getClientName(item.clientId)} />
          <DetailCard icon={Calendar} label="Financial Year" value={getFYLabel(item.financialYearId)} />
          <DetailCard icon={FolderOpen} label="Section" value={getSectionName(item.sectionId)} />
          <DetailCard icon={User} label="Status" value={item.status} />
        </div>

        {/* Prepared / Reviewed */}
        <div className="grid grid-cols-2 gap-3">
          <div className="border rounded-lg p-3 space-y-2">
            <label className="text-xs text-muted-foreground">Prepared By</label>
            <Select defaultValue={item.preparedBy ?? undefined}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select..." />
              </SelectTrigger>
              <SelectContent>
                {staffUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {item.preparedAt && (
              <p className="text-xs text-muted-foreground">{format(new Date(item.preparedAt), "dd MMM yyyy, hh:mm a")}</p>
            )}
          </div>
          <div className="border rounded-lg p-3 space-y-2">
            <label className="text-xs text-muted-foreground">Reviewed By</label>
            <Select defaultValue={item.reviewedBy ?? undefined} disabled={item.status !== "Reviewed"}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder={item.status === "Reviewed" ? "Select..." : "Complete first"} />
              </SelectTrigger>
              <SelectContent>
                {staffUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {item.reviewedAt && (
              <p className="text-xs text-muted-foreground">{format(new Date(item.reviewedAt), "dd MMM yyyy, hh:mm a")}</p>
            )}
          </div>
        </div>

        {/* Documents */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> Documents
            </h3>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Upload className="w-3.5 h-3.5" /> Upload
            </Button>
          </div>
          {documents.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No documents uploaded.</p>
          ) : (
            <div className="border rounded-lg divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-medium">{doc.name}</span>
                    <span className="text-xs text-muted-foreground">{doc.size}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {getUserName(doc.uploadedBy)} · {format(new Date(doc.uploadedAt), "dd MMM yyyy")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Timeline */}
        <div>
          <h3 className="text-sm font-medium mb-3">Activity Timeline</h3>
          <ActivityLog complianceItemId={item.id} />
        </div>
      </div>
    </div>
  );
}

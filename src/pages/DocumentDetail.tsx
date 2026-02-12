import { useParams, useNavigate } from "react-router-dom";
import { mockDocuments, mockDocumentVersions, getUserName, getClientName, getFYLabel } from "@/lib/mock-data";
import { ActivityLog } from "@/components/ActivityLog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Calendar, User, Layers } from "lucide-react";
import { format } from "date-fns";

export default function DocumentDetail() {
  const { documentId } = useParams();
  const navigate = useNavigate();

  const doc = mockDocuments.find(d => d.id === documentId);
  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Document not found.
      </div>
    );
  }

  const versions = mockDocumentVersions
    .filter(v => v.documentId === documentId)
    .sort((a, b) => b.version - a.version);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{doc.name}</h1>
            <p className="text-sm text-muted-foreground">
              {getClientName(doc.clientId)} · {getFYLabel(doc.financialYearId)} · {doc.section}
            </p>
          </div>
          <Button size="sm" variant="outline" className="gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            Upload New Version
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Document Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <MetaField icon={User} label="Prepared By" value={getUserName(doc.preparedBy)} />
          <MetaField icon={User} label="Reviewed By" value={doc.reviewedBy ? getUserName(doc.reviewedBy) : "Not reviewed"} />
          <MetaField icon={Calendar} label="Date Prepared" value={format(new Date(doc.datePrepared), "dd MMM yyyy")} />
          <MetaField icon={Calendar} label="Last Modified" value={format(new Date(doc.lastModified), "dd MMM yyyy, hh:mm a")} />
          <MetaField icon={Layers} label="Version" value={`v${doc.version}`} />
          <MetaField icon={FileText} label="Size" value={doc.size} />
        </div>

        {doc.description && (
          <div className="border rounded-lg bg-card p-4">
            <p className="text-xs text-muted-foreground mb-1">Description</p>
            <p className="text-sm">{doc.description}</p>
          </div>
        )}

        {/* Version History */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Version History · {versions.length} version{versions.length !== 1 ? "s" : ""}</h2>
          {versions.length === 0 ? (
            <div className="border rounded-lg bg-card p-6 text-center text-sm text-muted-foreground">
              No version history available.
            </div>
          ) : (
            <div className="border rounded-lg bg-card overflow-hidden divide-y">
              {versions.map(v => (
                <div key={v.id} className="px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-medium text-muted-foreground">v{v.version}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{getUserName(v.uploadedBy)}</span>
                      {v.notes && <span className="text-muted-foreground"> · {v.notes}</span>}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(v.uploadedAt), "dd MMM yyyy, hh:mm a")} · {v.size}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Activity Log */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Activity History</h2>
          <div className="border rounded-lg bg-card px-4">
            <ActivityLog documentId={doc.id} />
          </div>
        </section>
      </div>
    </div>
  );
}

function MetaField({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="border rounded-lg bg-card p-3">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

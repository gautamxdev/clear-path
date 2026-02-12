import { useNavigate } from "react-router-dom";
import type { Document } from "@/lib/types";
import { getUserName } from "@/lib/mock-data";
import { format } from "date-fns";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentTableProps {
  documents: Document[];
  sectionLabel: string;
}

export function DocumentTable({ documents, sectionLabel }: DocumentTableProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          {sectionLabel} · {documents.length} document{documents.length !== 1 ? "s" : ""}
        </h2>
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
          <Upload className="w-3 h-3" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <div className="border rounded-lg bg-card p-8 text-center text-sm text-muted-foreground">
          No documents in this section yet.
        </div>
      ) : (
        <div className="border rounded-lg bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Document Name</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Description</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Prepared By</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Reviewed By</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Date Prepared</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Last Modified</th>
                <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs w-12">Ver.</th>
              </tr>
            </thead>
            <tbody>
              {documents.map(doc => (
                <tr
                  key={doc.id}
                  onClick={() => navigate(`/document/${doc.id}`)}
                  className="border-b last:border-b-0 cursor-pointer hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-2.5 font-medium">{doc.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{doc.description || "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{getUserName(doc.preparedBy)}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{doc.reviewedBy ? getUserName(doc.reviewedBy) : "—"}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{format(new Date(doc.datePrepared), "dd MMM yyyy")}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{format(new Date(doc.lastModified), "dd MMM yyyy")}</td>
                  <td className="px-4 py-2.5 text-muted-foreground text-center">v{doc.version}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

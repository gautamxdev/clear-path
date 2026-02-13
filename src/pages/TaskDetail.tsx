import { useParams, useNavigate } from "react-router-dom";
import { mockTasks, mockDocuments, getClientName, getFYLabel, getUserName } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { ActivityLog } from "@/components/ActivityLog";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, FileText, Calendar, User, Briefcase } from "lucide-react";
import { format } from "date-fns";

export default function TaskDetail() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const task = mockTasks.find((t) => t.id === taskId);
  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Task not found.
      </div>
    );
  }

  const documents = mockDocuments.filter((d) => d.taskId === taskId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">{task.name}</h1>
            <p className="text-sm text-muted-foreground">
              {getClientName(task.clientId)} · {getFYLabel(task.financialYearId)}
            </p>
          </div>
          <StatusBadge status={task.status} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
        {/* Task Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <DetailCard icon={Briefcase} label="Client" value={getClientName(task.clientId)} />
          <DetailCard icon={Calendar} label="Due Date" value={format(new Date(task.dueDate), "dd MMM yyyy")} />
          <DetailCard icon={User} label="Assigned To" value={getUserName(task.assignedTo)} />
          <DetailCard icon={Calendar} label="Financial Year" value={getFYLabel(task.financialYearId)} />
        </div>

        {/* Documents */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-muted-foreground">
              Documents · {documents.length}
            </h2>
            <Button size="sm" variant="outline" className="gap-1.5">
              <Upload className="w-3.5 h-3.5" />
              Upload
            </Button>
          </div>
          {documents.length === 0 ? (
            <div className="border rounded-lg bg-card p-6 text-center text-sm text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="border rounded-lg bg-card overflow-hidden divide-y">
              {documents.map((doc) => (
                <div key={doc.id} className="px-4 py-3 flex items-center gap-3 hover:bg-secondary/30 transition-colors">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {getUserName(doc.uploadedBy)} · {format(new Date(doc.uploadedAt), "dd MMM yyyy, hh:mm a")} · {doc.size}
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
            <ActivityLog taskId={task.id} />
          </div>
        </section>
      </div>
    </div>
  );
}

function DetailCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
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

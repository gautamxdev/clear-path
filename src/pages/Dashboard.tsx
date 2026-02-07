import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { FYSelector } from "@/components/FYSelector";
import { ClientTaskTable } from "@/components/ClientTaskTable";
import { mockClients, mockTasks } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  const [selectedFY, setSelectedFY] = useState("fy-2024");

  const selectedClient = mockClients.find((c) => c.id === selectedClientId);
  const filteredTasks = mockTasks.filter(
    (t) => t.clientId === selectedClientId && t.financialYearId === selectedFY
  );

  // Summary counts
  const allClientTasks = mockTasks.filter((t) => t.financialYearId === selectedFY);
  const pendingCount = allClientTasks.filter((t) => t.status === "Pending").length;
  const overdueCount = allClientTasks.filter((t) => t.status === "Overdue").length;
  const inProgressCount = allClientTasks.filter((t) => t.status === "In Progress").length;
  const filedCount = allClientTasks.filter((t) => t.status === "Filed").length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar selectedClientId={selectedClientId} onSelectClient={setSelectedClientId} />

      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{selectedClient?.name ?? "Select a client"}</h2>
            {selectedClient && (
              <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                {selectedClient.type} · {selectedClient.pan}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <FYSelector value={selectedFY} onChange={setSelectedFY} />
            <Button size="sm" className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Task
            </Button>
          </div>
        </header>

        <div className="p-6 space-y-6 animate-fade-in">
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <SummaryCard label="Pending" count={pendingCount} accent="status-pending" />
            <SummaryCard label="In Progress" count={inProgressCount} accent="status-in-progress" />
            <SummaryCard label="Overdue" count={overdueCount} accent="status-overdue" />
            <SummaryCard label="Filed" count={filedCount} accent="status-filed" />
          </div>

          {/* Task Table */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Compliance Tasks · {filteredTasks.length} items
            </h3>
            <ClientTaskTable tasks={filteredTasks} />
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryCard({ label, count, accent }: { label: string; count: number; accent: string }) {
  return (
    <div className="border rounded-lg bg-card p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-2xl font-semibold text-${accent}`}>{count}</p>
    </div>
  );
}

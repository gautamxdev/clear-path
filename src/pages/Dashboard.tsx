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

        <div className="p-6 space-y-5">
          {/* Subtle inline summary */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span>Pending <strong className="text-status-pending ml-1">{pendingCount}</strong></span>
            <span>In Progress <strong className="text-status-in-progress ml-1">{inProgressCount}</strong></span>
            <span>Overdue <strong className="text-status-overdue ml-1">{overdueCount}</strong></span>
            <span>Filed <strong className="text-status-filed ml-1">{filedCount}</strong></span>
            <span className="ml-auto text-muted-foreground/70">{filteredTasks.length} tasks for this client</span>
          </div>

          {/* Task Table */}
          <ClientTaskTable tasks={filteredTasks} />
        </div>
      </main>
    </div>
  );
}

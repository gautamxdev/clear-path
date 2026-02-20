import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { FYSelector } from "@/components/FYSelector";
import { SectionTree } from "@/components/SectionTree";
import { ComplianceItemTable } from "@/components/ComplianceItemTable";
import { mockClients, getItemsForSection, getSectionName } from "@/lib/mock-data";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>(mockClients[0].id);
  const [selectedFY, setSelectedFY] = useState("fy-2024");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  const selectedClient = mockClients.find((c) => c.id === selectedClientId);
  const items = selectedSectionId ? getItemsForSection(selectedSectionId) : [];

  const completedCount = items.filter((i) => i.status === "Completed").length;
  const reviewedCount = items.filter((i) => i.status === "Reviewed").length;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar selectedClientId={selectedClientId} onSelectClient={(id) => { setSelectedClientId(id); setSelectedSectionId(null); }} />

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
        </header>

        <div className="flex">
          {/* Left column – FY + Section Tree */}
          <aside className="w-[240px] flex-shrink-0 border-r p-4 space-y-4">
            <FYSelector value={selectedFY} onChange={(fy) => { setSelectedFY(fy); setSelectedSectionId(null); }} />
            <SectionTree
              clientId={selectedClientId}
              financialYearId={selectedFY}
              selectedSectionId={selectedSectionId}
              onSelectSection={setSelectedSectionId}
            />
          </aside>

          {/* Right column – Items table */}
          <div className="flex-1 p-6">
            {selectedSectionId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-base font-medium">{getSectionName(selectedSectionId)}</h3>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Completed <strong className="text-status-completed ml-1">{completedCount}</strong></span>
                      <span>Reviewed <strong className="text-status-reviewed ml-1">{reviewedCount}</strong></span>
                      <span className="opacity-60">{items.length} items</span>
                    </div>
                  </div>
                  <Button size="sm" className="gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    Add Item
                  </Button>
                </div>
                <ComplianceItemTable items={items} />
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
                Select a section from the left to view compliance items.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

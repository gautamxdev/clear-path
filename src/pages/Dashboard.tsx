import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { FYSelector } from "@/components/FYSelector";
import { SectionTree } from "@/components/SectionTree";
import { ComplianceItemTable } from "@/components/ComplianceItemTable";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useClients } from "@/hooks/useClients";
import { useFinancialYears } from "@/hooks/useFinancialYears";
import { useComplianceItems } from "@/hooks/useComplianceItems";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, firmId, loading: authLoading } = useAuth();
  const { data: clients } = useClients();
  const { data: financialYears } = useFinancialYears();

  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedFY, setSelectedFY] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate("/login", { replace: true }); return; }
    if (!firmId) { navigate("/setup", { replace: true }); }
  }, [user, firmId, authLoading, navigate]);

  useEffect(() => {
    if (clients && clients.length > 0 && !selectedClientId) setSelectedClientId(clients[0].id);
  }, [clients, selectedClientId]);

  useEffect(() => {
    if (financialYears && financialYears.length > 0 && !selectedFY) setSelectedFY(financialYears[0].id);
  }, [financialYears, selectedFY]);

  const { data: items, isLoading: itemsLoading } = useComplianceItems(selectedSectionId);

  const completedCount = items?.filter((i) => i.status === "Completed").length ?? 0;
  const reviewedCount = items?.filter((i) => i.status === "Reviewed").length ?? 0;
  const selectedClient = clients?.find((c) => c.id === selectedClientId);

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar selectedClientId={selectedClientId} onSelectClient={(id) => { setSelectedClientId(id); setSelectedSectionId(null); }} />
      <main className="flex-1 overflow-auto">
        <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold">{selectedClient?.name ?? "Select a client"}</h2>
          </div>
        </header>
        <div className="flex">
          <aside className="w-[240px] flex-shrink-0 border-r p-4 space-y-4">
            <FYSelector value={selectedFY} onChange={(fy) => { setSelectedFY(fy); setSelectedSectionId(null); }} />
            {selectedClientId && selectedFY && (
              <SectionTree clientId={selectedClientId} financialYearId={selectedFY} selectedSectionId={selectedSectionId} onSelectSection={setSelectedSectionId} />
            )}
          </aside>
          <div className="flex-1 p-6">
            {selectedSectionId ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Completed <strong className="text-status-completed ml-1">{completedCount}</strong></span>
                    <span>Reviewed <strong className="text-status-reviewed ml-1">{reviewedCount}</strong></span>
                  </div>
                  <Button size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Item</Button>
                </div>
                {itemsLoading ? (
                  <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
                ) : (
                  <ComplianceItemTable items={items ?? []} />
                )}
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

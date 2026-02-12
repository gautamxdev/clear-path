import { useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { DocumentTable } from "@/components/DocumentTable";
import { mockClients, getDocumentsForSection } from "@/lib/mock-data";
import { SECTIONS, type SectionType } from "@/lib/types";

export default function Dashboard() {
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedFY, setSelectedFY] = useState("fy-2024");
  const [selectedSection, setSelectedSection] = useState<SectionType>("GST");

  const selectedClient = mockClients.find(c => c.id === selectedClientId);
  const documents = selectedClientId
    ? getDocumentsForSection(selectedClientId, selectedFY, selectedSection)
    : [];

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar
        selectedClientId={selectedClientId}
        onSelectClient={setSelectedClientId}
        selectedFY={selectedFY}
        onSelectFY={setSelectedFY}
        selectedSection={selectedSection}
        onSelectSection={setSelectedSection}
      />

      <main className="flex-1 overflow-auto">
        {selectedClient ? (
          <>
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-semibold">{selectedClient.name}</h2>
                <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {selectedSection}
                </span>
              </div>
            </header>
            <div className="p-6">
              <DocumentTable documents={documents} sectionLabel={selectedSection} />
            </div>
          </>
        ) : (
          <>
            <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
              <h2 className="text-lg font-semibold">Clients</h2>
            </header>
            <div className="p-6">
              <div className="border rounded-lg bg-card overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-secondary/50">
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Client Name</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">PAN</th>
                      <th className="text-left px-4 py-2.5 font-medium text-muted-foreground text-xs">Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockClients.map(client => (
                      <tr
                        key={client.id}
                        onClick={() => setSelectedClientId(client.id)}
                        className="border-b last:border-b-0 cursor-pointer hover:bg-secondary/30 transition-colors"
                      >
                        <td className="px-4 py-2.5 font-medium">{client.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{client.pan}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{client.type}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockClients, mockFinancialYears, getSectionCounts } from "@/lib/mock-data";
import { SECTIONS, type SectionType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Building2, Users, Settings, LogOut, Plus, FileText, ChevronRight } from "lucide-react";


interface AppSidebarProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
  selectedFY: string;
  onSelectFY: (fy: string) => void;
  selectedSection: SectionType | null;
  onSelectSection: (section: SectionType) => void;
}

export function AppSidebar({ selectedClientId, onSelectClient, selectedFY, onSelectFY, selectedSection, onSelectSection }: AppSidebarProps) {
  const navigate = useNavigate();
  const selectedClient = mockClients.find(c => c.id === selectedClientId);
  const sectionCounts = selectedClientId ? getSectionCounts(selectedClientId, selectedFY) : null;

  return (
    <aside className="w-60 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Firm Header */}
      <div className="px-4 py-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-sidebar-accent flex items-center justify-center">
            <Building2 className="w-3.5 h-3.5 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-primary leading-tight">Sharma & Associates</h1>
            <p className="text-[11px] text-sidebar-muted">Chartered Accountants</p>
          </div>
        </div>
      </div>

      {/* Client Context */}
      {selectedClient ? (
        <>
          {/* Back to all clients */}
          <button
            onClick={() => {
              onSelectClient("");
              navigate("/dashboard");
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-xs text-sidebar-muted hover:text-sidebar-foreground transition-colors border-b border-sidebar-border"
          >
            <Users className="w-3.5 h-3.5" />
            ← All Clients
          </button>

          {/* Client name */}
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-sm font-medium text-sidebar-primary">{selectedClient.name}</p>
            <p className="text-[11px] text-sidebar-muted mt-0.5">{selectedClient.type} · {selectedClient.pan}</p>
          </div>

          {/* FY Selector */}
          <div className="px-4 py-3 border-b border-sidebar-border">
            <p className="text-[11px] text-sidebar-muted uppercase tracking-wider mb-2">Financial Year</p>
            <select
              value={selectedFY}
              onChange={e => onSelectFY(e.target.value)}
              className="w-full bg-sidebar-accent text-sidebar-foreground text-sm rounded-md px-2.5 py-1.5 border border-sidebar-border focus:outline-none focus:ring-1 focus:ring-sidebar-ring"
            >
              {mockFinancialYears.map(fy => (
                <option key={fy.id} value={fy.id}>{fy.label}</option>
              ))}
            </select>
          </div>

          {/* Sections */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <p className="px-2 py-1.5 text-[11px] text-sidebar-muted uppercase tracking-wider">Sections</p>
            <div className="space-y-0.5 mt-1">
              {SECTIONS.map(section => {
                const count = sectionCounts?.[section] ?? 0;
                const isActive = selectedSection === section;
                return (
                  <button
                    key={section}
                    onClick={() => onSelectSection(section)}
                    className={cn(
                      "w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                      {section}
                    </span>
                    {count > 0 && (
                      <span className="text-[11px] text-sidebar-muted">{count}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Client List */}
          <div className="flex-1 overflow-y-auto px-3 py-3">
            <div className="flex items-center justify-between px-2 py-1.5">
              <p className="text-[11px] text-sidebar-muted uppercase tracking-wider">Clients</p>
              <button className="text-sidebar-muted hover:text-sidebar-foreground transition-colors">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-0.5 mt-1">
              {mockClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => {
                    onSelectClient(client.id);
                    navigate("/dashboard");
                  }}
                  className={cn(
                    "w-full flex items-center justify-between text-left px-2.5 py-2 rounded-md text-sm transition-colors",
                    selectedClientId === client.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <span className="truncate">{client.name}</span>
                  <ChevronRight className="w-3 h-3 opacity-40 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border space-y-0.5">
        <button className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors">
          <Settings className="w-3.5 h-3.5" />
          Settings
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("ca-auth");
            navigate("/login");
          }}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

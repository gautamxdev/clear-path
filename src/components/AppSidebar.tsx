import { useLocation, useNavigate } from "react-router-dom";
import { Users, Calendar, AlertCircle, Bell, Building2, Filter, LogOut } from "lucide-react";
import { mockClients } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

export function AppSidebar({ selectedClientId, onSelectClient }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "All Clients", icon: Users, path: "/" },
    { label: "Pending Filings", icon: AlertCircle, path: "/filters?status=Pending" },
    { label: "Notices", icon: Bell, path: "#" },
    { label: "Global Filters", icon: Filter, path: "/filters" },
  ];

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      {/* Firm Header */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sidebar-accent flex items-center justify-center">
            <Building2 className="w-4 h-4 text-sidebar-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-primary">Sharma & Associates</h1>
            <p className="text-xs text-sidebar-muted">Chartered Accountants</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || 
            (item.path.startsWith("/filters") && location.pathname === "/filters");
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.path !== "#") navigate(item.path);
              }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 py-2 text-xs font-medium text-sidebar-muted uppercase tracking-wider">
          Clients
        </p>
        <div className="space-y-0.5">
          {mockClients.map((client) => (
            <button
              key={client.id}
              onClick={() => {
                onSelectClient(client.id);
                navigate("/");
              }}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selectedClientId === client.id
                  ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              {client.name}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-sidebar-border">
        <button
          onClick={() => {
            localStorage.removeItem("ca-auth");
            navigate("/login");
          }}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

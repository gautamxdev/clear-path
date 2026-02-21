import { useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Filter, LogOut, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClients } from "@/hooks/useClients";
import { useAuth } from "@/contexts/AuthContext";

interface AppSidebarProps {
  selectedClientId: string | null;
  onSelectClient: (clientId: string) => void;
}

export function AppSidebar({ selectedClientId, onSelectClient }: AppSidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { data: clients, isLoading } = useClients();
  const { signOut, profile } = useAuth();

  const navItems = [
    { label: "All Clients", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Global Filters", icon: Filter, path: "/filters" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col h-screen sticky top-0">
      <div className="px-4 py-5 border-b border-sidebar-border">
        <h2 className="text-sm font-semibold text-sidebar-primary">ComplianceDesk</h2>
        {profile && (
          <p className="text-xs text-sidebar-muted truncate mt-0.5">{profile.full_name}</p>
        )}
      </div>

      <nav className="px-3 py-3 space-y-0.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
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

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <p className="px-3 py-2 text-xs font-medium text-sidebar-muted uppercase tracking-wider">Clients</p>
        {isLoading ? (
          <div className="flex justify-center py-4"><Loader2 className="w-4 h-4 animate-spin text-sidebar-foreground/50" /></div>
        ) : clients && clients.length > 0 ? (
          <div className="space-y-0.5">
            {clients.map((client) => (
              <button
                key={client.id}
                onClick={() => { onSelectClient(client.id); navigate("/dashboard"); }}
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
        ) : (
          <p className="text-xs text-sidebar-foreground/40 px-3">No clients yet</p>
        )}
      </div>

      <div className="px-3 py-3 border-t border-sidebar-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

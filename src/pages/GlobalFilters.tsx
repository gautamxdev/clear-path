import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockTasks, mockFinancialYears, mockUsers, getClientName, getUserName, getFYLabel } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import type { TaskStatus } from "@/lib/types";

const ALL = "__all__";

export default function GlobalFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") ?? ALL;

  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [employeeFilter, setEmployeeFilter] = useState(ALL);
  const [fyFilter, setFyFilter] = useState("fy-2024");

  const filtered = mockTasks.filter((t) => {
    if (statusFilter !== ALL && t.status !== statusFilter) return false;
    if (employeeFilter !== ALL && t.assignedTo !== employeeFilter) return false;
    if (t.financialYearId !== fyFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Global Filters</h1>
        </div>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
        {/* Filter Controls */}
        <div className="flex flex-wrap gap-3">
          <Select value={fyFilter} onValueChange={setFyFilter}>
            <SelectTrigger className="w-[160px] h-9 text-sm bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockFinancialYears.map((fy) => (
                <SelectItem key={fy.id} value={fy.id}>{fy.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[150px] h-9 text-sm bg-card">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Statuses</SelectItem>
              {(["Filed", "Pending", "In Progress", "Overdue"] as TaskStatus[]).map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
            <SelectTrigger className="w-[180px] h-9 text-sm bg-card">
              <SelectValue placeholder="All Employees" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL}>All Employees</SelectItem>
              {mockUsers.filter(u => u.role === "staff").map((u) => (
                <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <p className="text-sm text-muted-foreground">{filtered.length} tasks found</p>

        <div className="border rounded-lg bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Task</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Client</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Assigned To</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Due Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((task) => (
                <tr
                  key={task.id}
                  onClick={() => navigate(`/task/${task.id}`)}
                  className="border-b last:border-b-0 hover:bg-secondary/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-medium">{task.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{getClientName(task.clientId)}</td>
                  <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                  <td className="px-4 py-3 text-muted-foreground">{getUserName(task.assignedTo)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{format(new Date(task.dueDate), "dd MMM yyyy")}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    No tasks match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { mockComplianceItems, mockFinancialYears, getUserName, getClientName, getLastActivity, getSectionName, PREDEFINED_SECTIONS, mockSections } from "@/lib/mock-data";
import { StatusBadge } from "@/components/StatusBadge";
import type { ComplianceItemStatus } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const ALL = "__all__";

export default function GlobalFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? ALL);
  const [fyFilter, setFyFilter] = useState(ALL);
  const [sectionFilter, setSectionFilter] = useState(ALL);

  const filtered = mockComplianceItems.filter((item) => {
    if (statusFilter !== ALL && item.status !== statusFilter) return false;
    if (fyFilter !== ALL && item.financialYearId !== fyFilter) return false;
    if (sectionFilter !== ALL) {
      const section = mockSections.find((s) => s.id === item.sectionId);
      if (!section || section.name !== sectionFilter) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-6 py-3 flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-lg font-semibold">Global Filters</h1>
      </header>

      <div className="p-6 space-y-5">
        <div className="flex flex-wrap gap-3 items-end">
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Financial Year</label>
            <Select value={fyFilter} onValueChange={setFyFilter}>
              <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Years</SelectItem>
                {mockFinancialYears.map((fy) => (
                  <SelectItem key={fy.id} value={fy.id}>{fy.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {(["Completed", "Reviewed"] as ComplianceItemStatus[]).map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Section</label>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Sections</SelectItem>
                {PREDEFINED_SECTIONS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{filtered.length} items found</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Section</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prepared By</TableHead>
              <TableHead>Reviewed By</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No matching items.</TableCell>
              </TableRow>
            ) : (
              filtered.map((item) => {
                const lastActivity = getLastActivity(item.id);
                return (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/item/${item.id}`)}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">{getClientName(item.clientId)}</TableCell>
                    <TableCell className="text-muted-foreground">{getSectionName(item.sectionId)}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{item.preparedBy ? getUserName(item.preparedBy) : "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.reviewedBy ? getUserName(item.reviewedBy) : "—"}</TableCell>
                    <TableCell>
                      {lastActivity ? (
                        <span className="text-xs text-muted-foreground">
                          {lastActivity.userName} · {formatDistanceToNow(new Date(lastActivity.timestamp), { addSuffix: true })}
                        </span>
                      ) : "—"}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

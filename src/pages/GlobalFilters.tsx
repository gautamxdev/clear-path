import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import type { ComplianceItemStatus } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useFinancialYears } from "@/hooks/useFinancialYears";
import { useProfiles } from "@/hooks/useProfiles";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";

const ALL = "__all__";
const SECTION_TYPES = ["GST", "Income Tax", "TDS", "ROC", "Audit", "Notices", "Other"];

export default function GlobalFilters() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { firmId } = useAuth();
  const { data: financialYears } = useFinancialYears();
  const { data: profiles } = useProfiles();

  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") ?? ALL);
  const [fyFilter, setFyFilter] = useState(ALL);
  const [sectionFilter, setSectionFilter] = useState(ALL);

  const { data: items, isLoading } = useQuery({
    queryKey: ["global_items", firmId, statusFilter, fyFilter, sectionFilter],
    queryFn: async () => {
      if (!firmId) return [];
      let query = supabase
        .from("compliance_items")
        .select("*, section:sections(*, client:clients(*), financial_year:financial_years(*))")
        .order("created_at", { ascending: false });

      if (statusFilter !== ALL) query = query.eq("status", statusFilter);

      const { data, error } = await query;
      if (error) throw error;

      let filtered = data ?? [];
      if (fyFilter !== ALL) filtered = filtered.filter((i: any) => i.section?.financial_year?.id === fyFilter);
      if (sectionFilter !== ALL) filtered = filtered.filter((i: any) => i.section?.name === sectionFilter);
      return filtered;
    },
    enabled: !!firmId,
  });

  const getUserName = (userId: string | null) => {
    if (!userId || !profiles) return "—";
    const p = profiles.find((pr) => pr.id === userId);
    return p?.full_name || p?.email || "—";
  };

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
                {financialYears?.map((fy) => <SelectItem key={fy.id} value={fy.id}>{fy.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All</SelectItem>
                {(["Completed", "Reviewed"] as ComplianceItemStatus[]).map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Section</label>
            <Select value={sectionFilter} onValueChange={setSectionFilter}>
              <SelectTrigger className="w-[160px] h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>All Sections</SelectItem>
                {SECTION_TYPES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">{items?.length ?? 0} items found</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Section</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prepared By</TableHead>
                <TableHead>Reviewed By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No matching items.</TableCell></TableRow>
              ) : (
                items?.map((item: any) => (
                  <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/item/${item.id}`)}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">{item.section?.client?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.section?.name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={item.status} /></TableCell>
                    <TableCell className="text-muted-foreground">{getUserName(item.prepared_by)}</TableCell>
                    <TableCell className="text-muted-foreground">{getUserName(item.reviewed_by)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

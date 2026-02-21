import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { useProfiles } from "@/hooks/useProfiles";
import { format } from "date-fns";
import type { ComplianceItemStatus } from "@/lib/types";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

interface ComplianceItemRow {
  id: string;
  title: string;
  status: string;
  prepared_by: string | null;
  prepared_at: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

interface ComplianceItemTableProps {
  items: ComplianceItemRow[];
}

export function ComplianceItemTable({ items }: ComplianceItemTableProps) {
  const navigate = useNavigate();
  const { data: profiles } = useProfiles();

  const getUserName = (userId: string | null) => {
    if (!userId || !profiles) return "—";
    const p = profiles.find((pr) => pr.id === userId);
    return p?.full_name || p?.email || "—";
  };

  if (items.length === 0) {
    return <div className="text-center py-12 text-muted-foreground text-sm">No compliance items in this section.</div>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[260px]">Item Name</TableHead>
          <TableHead className="w-[100px]">Status</TableHead>
          <TableHead>Prepared By</TableHead>
          <TableHead>Prepared At</TableHead>
          <TableHead>Reviewed By</TableHead>
          <TableHead>Reviewed At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id} className="cursor-pointer hover:bg-muted/50" onClick={() => navigate(`/item/${item.id}`)}>
            <TableCell className="font-medium">{item.title}</TableCell>
            <TableCell><StatusBadge status={item.status as ComplianceItemStatus} /></TableCell>
            <TableCell className="text-muted-foreground">{getUserName(item.prepared_by)}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{item.prepared_at ? format(new Date(item.prepared_at), "dd MMM yyyy") : "—"}</TableCell>
            <TableCell className="text-muted-foreground">{getUserName(item.reviewed_by)}</TableCell>
            <TableCell className="text-muted-foreground text-sm">{item.reviewed_at ? format(new Date(item.reviewed_at), "dd MMM yyyy") : "—"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

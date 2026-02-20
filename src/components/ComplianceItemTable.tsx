import { useNavigate } from "react-router-dom";
import { StatusBadge } from "@/components/StatusBadge";
import { getUserName, getLastActivity } from "@/lib/mock-data";
import { format, formatDistanceToNow } from "date-fns";
import type { ComplianceItem } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ComplianceItemTableProps {
  items: ComplianceItem[];
}

export function ComplianceItemTable({ items }: ComplianceItemTableProps) {
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No compliance items in this section.
      </div>
    );
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
          <TableHead className="w-[200px]">Last Activity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const lastActivity = getLastActivity(item.id);
          return (
            <TableRow
              key={item.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <TableCell className="font-medium">{item.title}</TableCell>
              <TableCell><StatusBadge status={item.status} /></TableCell>
              <TableCell className="text-muted-foreground">
                {item.preparedBy ? getUserName(item.preparedBy) : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {item.preparedAt ? format(new Date(item.preparedAt), "dd MMM yyyy") : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {item.reviewedBy ? getUserName(item.reviewedBy) : "—"}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {item.reviewedAt ? format(new Date(item.reviewedAt), "dd MMM yyyy") : "—"}
              </TableCell>
              <TableCell>
                {lastActivity ? (
                  <span className="text-xs text-muted-foreground">
                    {lastActivity.userName} · {lastActivity.action.length > 30 ? lastActivity.action.slice(0, 30) + "…" : lastActivity.action}
                    <span className="ml-1 opacity-60">
                      {formatDistanceToNow(new Date(lastActivity.timestamp), { addSuffix: true })}
                    </span>
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

import { mockFinancialYears } from "@/lib/mock-data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FYSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function FYSelector({ value, onChange }: FYSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] h-9 text-sm bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {mockFinancialYears.map((fy) => (
          <SelectItem key={fy.id} value={fy.id}>
            {fy.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

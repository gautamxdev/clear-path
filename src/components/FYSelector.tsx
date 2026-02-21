import { useFinancialYears } from "@/hooks/useFinancialYears";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FYSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function FYSelector({ value, onChange }: FYSelectorProps) {
  const { data: financialYears, isLoading } = useFinancialYears();

  if (isLoading || !financialYears || financialYears.length === 0) {
    return (
      <Select disabled>
        <SelectTrigger className="w-[160px] h-9 text-sm bg-card">
          <SelectValue placeholder={isLoading ? "Loading..." : "No FYs"} />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[160px] h-9 text-sm bg-card">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {financialYears.map((fy) => (
          <SelectItem key={fy.id} value={fy.id}>
            {fy.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

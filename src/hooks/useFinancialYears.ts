import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useFinancialYears() {
  const { firmId } = useAuth();
  return useQuery({
    queryKey: ["financial_years", firmId],
    queryFn: async () => {
      if (!firmId) return [];
      const { data, error } = await supabase
        .from("financial_years")
        .select("*")
        .eq("firm_id", firmId)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!firmId,
  });
}

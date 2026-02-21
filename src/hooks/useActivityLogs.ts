import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useActivityLogs(complianceItemId: string | null) {
  return useQuery({
    queryKey: ["activity_logs", complianceItemId],
    queryFn: async () => {
      if (!complianceItemId) return [];
      const { data, error } = await supabase
        .from("activity_logs")
        .select("*")
        .eq("compliance_item_id", complianceItemId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!complianceItemId,
  });
}

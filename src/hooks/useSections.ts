import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSections(clientId: string | null, fyId: string | null) {
  return useQuery({
    queryKey: ["sections", clientId, fyId],
    queryFn: async () => {
      if (!clientId || !fyId) return [];
      const { data, error } = await supabase
        .from("sections")
        .select("*")
        .eq("client_id", clientId)
        .eq("financial_year_id", fyId);
      if (error) throw error;
      return data;
    },
    enabled: !!clientId && !!fyId,
  });
}

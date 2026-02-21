import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useClients() {
  const { firmId } = useAuth();
  return useQuery({
    queryKey: ["clients", firmId],
    queryFn: async () => {
      if (!firmId) return [];
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("firm_id", firmId)
        .order("name");
      if (error) throw error;
      return data;
    },
    enabled: !!firmId,
  });
}

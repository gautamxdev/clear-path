import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useProfiles() {
  const { firmId } = useAuth();
  return useQuery({
    queryKey: ["profiles", firmId],
    queryFn: async () => {
      if (!firmId) return [];
      const { data, error } = await supabase
        .from("profiles")
        .select("*, user_roles(role)")
        .eq("firm_id", firmId);
      if (error) throw error;
      return data;
    },
    enabled: !!firmId,
  });
}

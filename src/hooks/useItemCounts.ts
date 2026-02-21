import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useItemCounts(sectionIds: string[]) {
  return useQuery({
    queryKey: ["item_counts", sectionIds],
    queryFn: async () => {
      if (sectionIds.length === 0) return {};
      const { data, error } = await supabase
        .from("compliance_items")
        .select("section_id")
        .in("section_id", sectionIds);
      if (error) throw error;
      const counts: Record<string, number> = {};
      data.forEach((item) => {
        counts[item.section_id] = (counts[item.section_id] || 0) + 1;
      });
      return counts;
    },
    enabled: sectionIds.length > 0,
  });
}

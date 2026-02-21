import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useComplianceItems(sectionId: string | null) {
  return useQuery({
    queryKey: ["compliance_items", sectionId],
    queryFn: async () => {
      if (!sectionId) return [];
      const { data, error } = await supabase
        .from("compliance_items")
        .select("*")
        .eq("section_id", sectionId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!sectionId,
  });
}

export function useComplianceItem(itemId: string | null) {
  return useQuery({
    queryKey: ["compliance_item", itemId],
    queryFn: async () => {
      if (!itemId) return null;
      const { data, error } = await supabase
        .from("compliance_items")
        .select("*, section:sections(*, client:clients(*)), documents(*), activity_logs(*)")
        .eq("id", itemId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!itemId,
  });
}

export function useUpdateComplianceItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Record<string, unknown>;
    }) => {
      const { data, error } = await supabase
        .from("compliance_items")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;

      // Log activity
      const actionType = updates.status
        ? "status_changed"
        : updates.prepared_by
        ? "prepared_by_set"
        : updates.reviewed_by
        ? "reviewed_by_set"
        : "item_updated";
      await supabase.from("activity_logs").insert([{
        compliance_item_id: id,
        action_type: actionType,
        metadata: updates as any,
        performed_by: user?.id,
      }]);

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["compliance_items"] });
      queryClient.invalidateQueries({ queryKey: ["compliance_item", data.id] });
    },
  });
}

export function useCreateComplianceItem() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (item: { section_id: string; title: string }) => {
      const { data, error } = await supabase
        .from("compliance_items")
        .insert(item)
        .select()
        .single();
      if (error) throw error;

      await supabase.from("activity_logs").insert([{
        compliance_item_id: data.id,
        action_type: "item_created",
        metadata: { title: item.title } as any,
        performed_by: user?.id,
      }]);

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compliance_items"] });
      queryClient.invalidateQueries({ queryKey: ["item_counts"] });
    },
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useDocuments(complianceItemId: string | null) {
  return useQuery({
    queryKey: ["documents", complianceItemId],
    queryFn: async () => {
      if (!complianceItemId) return [];
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("compliance_item_id", complianceItemId)
        .order("uploaded_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!complianceItemId,
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();
  const { user, firmId } = useAuth();
  return useMutation({
    mutationFn: async ({
      complianceItemId,
      file,
    }: {
      complianceItemId: string;
      file: File;
    }) => {
      const path = `${firmId}/${complianceItemId}/${Date.now()}_${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("compliance-docs")
        .upload(path, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("compliance-docs")
        .getPublicUrl(path);

      const { data, error } = await supabase
        .from("documents")
        .insert({
          compliance_item_id: complianceItemId,
          file_name: file.name,
          file_url: urlData.publicUrl,
          uploaded_by: user?.id,
          size: `${(file.size / 1024).toFixed(0)} KB`,
        })
        .select()
        .single();
      if (error) throw error;

      await supabase.from("activity_logs").insert({
        compliance_item_id: complianceItemId,
        action_type: "document_uploaded",
        metadata: { fileName: file.name },
        performed_by: user?.id,
      });

      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["documents", variables.complianceItemId] });
      queryClient.invalidateQueries({ queryKey: ["compliance_item", variables.complianceItemId] });
    },
  });
}

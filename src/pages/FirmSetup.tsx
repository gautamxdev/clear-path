import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export default function FirmSetup() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [firmName, setFirmName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    try {
      // Create firm
      const { data: firm, error: firmError } = await supabase
        .from("firms")
        .insert({ name: firmName })
        .select()
        .single();
      if (firmError) throw firmError;

      // Link profile to firm
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ firm_id: firm.id })
        .eq("id", user.id);
      if (profileError) throw profileError;

      // Assign admin role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "admin" });
      if (roleError) throw roleError;

      toast({ title: "Firm created!", description: `${firmName} is ready.` });
      // Force reload to refresh auth context
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      console.error("Firm creation error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
            <Building2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold">Set Up Your Firm</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create your firm to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="firm">Firm Name</Label>
            <Input
              id="firm"
              placeholder="e.g. Sharma & Associates"
              value={firmName}
              onChange={(e) => setFirmName(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Firm"}
          </Button>
        </form>
      </div>
    </div>
  );
}

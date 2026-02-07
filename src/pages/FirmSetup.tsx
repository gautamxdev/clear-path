import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function FirmSetup() {
  const navigate = useNavigate();
  const [firmName, setFirmName] = useState("");
  const [emails, setEmails] = useState<string[]>([""]);

  const addEmail = () => setEmails([...emails, ""]);
  const removeEmail = (i: number) => setEmails(emails.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, val: string) => {
    const updated = [...emails];
    updated[i] = val;
    setEmails(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/");
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
            Add your firm details and invite your team
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

          <div className="space-y-3">
            <Label>Invite Employees</Label>
            <p className="text-xs text-muted-foreground">They'll receive an email to set up their login.</p>
            {emails.map((email, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="employee@yourfirm.com"
                  value={email}
                  onChange={(e) => updateEmail(i, e.target.value)}
                />
                {emails.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeEmail(i)}>
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={addEmail} className="gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add Another
            </Button>
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              Complete Setup
            </Button>
            <Button type="button" variant="ghost" onClick={() => navigate("/")}>
              Skip for now
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

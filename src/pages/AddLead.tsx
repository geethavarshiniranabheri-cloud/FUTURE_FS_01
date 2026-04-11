import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLeadStore } from "@/stores/leadStore";
import { AppLayout } from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { LeadSource, LeadStatus } from "@/types/lead";
import { z } from "zod";

const leadSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email address").max(255),
  phone: z.string().trim().min(1, "Phone is required").max(30),
  source: z.enum(["website", "referral", "social_media", "advertisement", "cold_call", "other"]),
  status: z.enum(["new", "contacted", "converted"]),
});

const sources: { value: LeadSource; label: string }[] = [
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "social_media", label: "Social Media" },
  { value: "advertisement", label: "Advertisement" },
  { value: "cold_call", label: "Cold Call" },
  { value: "other", label: "Other" },
];

export default function AddLead() {
  const addLead = useLeadStore((s) => s.addLead);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "website" as LeadSource, status: "new" as LeadStatus });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = leadSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    addLead(result.data as { name: string; email: string; phone: string; source: LeadSource; status: LeadStatus });
    toast.success("Lead added successfully!");
    navigate("/leads");
  };

  const update = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  return (
    <AppLayout>
      <div className="max-w-2xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add New Lead</h1>
          <p className="text-muted-foreground mt-1">Enter the details for your new lead</p>
        </div>

        <form onSubmit={handleSubmit} className="gradient-card rounded-xl border border-border p-6 shadow-card space-y-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="Ranabheri Geetha varshini" value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-secondary border-border" />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="geethavarshiniranabheri@example.com" value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-secondary border-border" />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+91 9849339402" value={form.phone} onChange={(e) => update("phone", e.target.value)} className="bg-secondary border-border" />
            {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
          </div>

          {/* Source & Status row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Source</Label>
              <Select value={form.source} onValueChange={(v) => update("source", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sources.map((s) => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" variant="gradient" className="w-full">Add Lead</Button>
        </form>
      </div>
    </AppLayout>
  );
}

import { useState } from "react";
import { useLeadStore } from "@/stores/leadStore";
import { AppLayout } from "@/components/AppLayout";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Search, Trash2, MessageSquarePlus, X, Calendar } from "lucide-react";
import type { LeadStatus, LeadSource } from "@/types/lead";

export default function ManageLeads() {
  const { leads, updateStatus, addNote, deleteLead } = useLeadStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [noteModal, setNoteModal] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [followUpDate, setFollowUpDate] = useState("");

  const filtered = leads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || l.status === statusFilter;
    const matchesSource = sourceFilter === "all" || l.source === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const handleStatusChange = (id: string, status: LeadStatus) => {
    updateStatus(id, status);
    toast.success(`Status updated to ${status}`);
  };

  const handleAddNote = () => {
    if (!noteModal || !noteText.trim()) return;
    addNote(noteModal, { text: noteText.trim(), isFollowUp, followUpDate: isFollowUp ? followUpDate : undefined });
    toast.success(isFollowUp ? "Follow-up added!" : "Note added!");
    setNoteModal(null);
    setNoteText("");
    setIsFollowUp(false);
    setFollowUpDate("");
  };

  const handleDelete = (id: string) => {
    deleteLead(id);
    toast.success("Lead deleted");
  };

  const activeLead = noteModal ? leads.find((l) => l.id === noteModal) : null;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage Leads</h1>
          <p className="text-muted-foreground mt-1">{filtered.length} lead{filtered.length !== 1 ? "s" : ""} found</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-secondary border-border"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="converted">Converted</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-40 bg-secondary border-border">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sources</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="advertisement">Advertisement</SelectItem>
              <SelectItem value="cold_call">Cold Call</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="gradient-card rounded-xl border border-border shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-muted-foreground font-medium">Name</th>
                  <th className="text-left p-4 text-muted-foreground font-medium hidden md:table-cell">Email</th>
                  <th className="text-left p-4 text-muted-foreground font-medium hidden lg:table-cell">Phone</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Source</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Status</th>
                  <th className="text-left p-4 text-muted-foreground font-medium">Notes</th>
                  <th className="text-right p-4 text-muted-foreground font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <tr key={lead.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground flex-shrink-0">
                          {lead.name.charAt(0)}
                        </div>
                        <span className="font-medium text-foreground">{lead.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground hidden md:table-cell">{lead.email}</td>
                    <td className="p-4 text-muted-foreground hidden lg:table-cell">{lead.phone}</td>
                    <td className="p-4 text-muted-foreground capitalize">{lead.source.replace("_", " ")}</td>
                    <td className="p-4">
                      <Select value={lead.status} onValueChange={(v) => handleStatusChange(lead.id, v as LeadStatus)}>
                        <SelectTrigger className="w-32 h-8 bg-transparent border-none p-0">
                          <StatusBadge status={lead.status} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="contacted">Contacted</SelectItem>
                          <SelectItem value="converted">Converted</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-4 text-muted-foreground">{lead.notes.length}</td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" onClick={() => setNoteModal(lead.id)}>
                          <MessageSquarePlus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDelete(lead.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">No leads found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Note Modal */}
      {noteModal && activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setNoteModal(null)}>
          <div className="gradient-card rounded-xl border border-border shadow-card w-full max-w-lg mx-4 p-6 space-y-4 animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Notes — {activeLead.name}</h2>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setNoteModal(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Existing notes */}
            {activeLead.notes.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2">
                {activeLead.notes.map((note) => (
                  <div key={note.id} className="p-3 rounded-lg bg-secondary/70 text-sm">
                    <p className="text-foreground">{note.text}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                      {note.isFollowUp && (
                        <span className="flex items-center gap-1 text-warning">
                          <Calendar className="w-3 h-3" /> Follow-up {note.followUpDate ? new Date(note.followUpDate).toLocaleDateString() : ""}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add note */}
            <Textarea
              placeholder="Write a note..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="bg-secondary border-border"
              rows={3}
            />
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={isFollowUp} onChange={(e) => setIsFollowUp(e.target.checked)} className="accent-primary" />
                Follow-up
              </label>
              {isFollowUp && (
                <Input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="bg-secondary border-border w-auto" />
              )}
            </div>
            <Button variant="gradient" className="w-full" onClick={handleAddNote} disabled={!noteText.trim()}>
              Add Note
            </Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

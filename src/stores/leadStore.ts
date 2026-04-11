import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lead, LeadStatus, LeadSource, LeadNote } from "@/types/lead";

interface LeadStore {
  leads: Lead[];
  addLead: (lead: Omit<Lead, "id" | "notes" | "createdAt" | "updatedAt">) => void;
  updateStatus: (id: string, status: LeadStatus) => void;
  addNote: (leadId: string, note: Omit<LeadNote, "id" | "createdAt">) => void;
  deleteLead: (id: string) => void;
}

const sampleLeads: Lead[] = [
  {
    id: "1", name: "Sarah Chen", email: "sarah@techcorp.com", phone: "+1 555-0101",
    source: "website", status: "new", notes: [
      { id: "n1", text: "Interested in enterprise plan", createdAt: new Date().toISOString(), isFollowUp: false }
    ],
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "2", name: "Marcus Johnson", email: "marcus@startup.io", phone: "+1 555-0202",
    source: "referral", status: "contacted", notes: [
      { id: "n2", text: "Follow up next week about pricing", createdAt: new Date().toISOString(), isFollowUp: true, followUpDate: new Date(Date.now() + 86400000 * 7).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "3", name: "Elena Rodriguez", email: "elena@design.co", phone: "+1 555-0303",
    source: "social_media", status: "converted", notes: [],
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "4", name: "James Wright", email: "james@agency.com", phone: "+1 555-0404",
    source: "advertisement", status: "new", notes: [],
    createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: "5", name: "Aisha Patel", email: "aisha@consulting.net", phone: "+1 555-0505",
    source: "cold_call", status: "contacted", notes: [
      { id: "n3", text: "Scheduled demo for Friday", createdAt: new Date().toISOString(), isFollowUp: true, followUpDate: new Date(Date.now() + 86400000 * 3).toISOString() }
    ],
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), updatedAt: new Date().toISOString(),
  },
];

export const useLeadStore = create<LeadStore>()(
  persist(
    (set) => ({
      leads: sampleLeads,
      addLead: (lead) =>
        set((state) => ({
          leads: [
            {
              ...lead,
              id: crypto.randomUUID(),
              notes: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...state.leads,
          ],
        })),
      updateStatus: (id, status) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id ? { ...l, status, updatedAt: new Date().toISOString() } : l
          ),
        })),
      addNote: (leadId, note) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  notes: [
                    ...l.notes,
                    { ...note, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
                  ],
                  updatedAt: new Date().toISOString(),
                }
              : l
          ),
        })),
      deleteLead: (id) =>
        set((state) => ({ leads: state.leads.filter((l) => l.id !== id) })),
    }),
    { name: "crm-leads" }
  )
);

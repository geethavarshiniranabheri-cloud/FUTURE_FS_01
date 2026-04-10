export type LeadStatus = "new" | "contacted" | "converted";
export type LeadSource = "website" | "referral" | "social_media" | "advertisement" | "cold_call" | "other";

export interface LeadNote {
  id: string;
  text: string;
  createdAt: string;
  isFollowUp: boolean;
  followUpDate?: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: LeadSource;
  status: LeadStatus;
  notes: LeadNote[];
  createdAt: string;
  updatedAt: string;
}

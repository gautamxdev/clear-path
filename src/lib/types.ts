export type UserRole = "admin" | "staff";

export type SectionType = "GST" | "TDS" | "Income Tax" | "Audit" | "Notices" | "Other";

export const SECTIONS: SectionType[] = ["GST", "TDS", "Income Tax", "Audit", "Notices", "Other"];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId: string;
}

export interface Firm {
  id: string;
  name: string;
}

export interface Client {
  id: string;
  firmId: string;
  name: string;
  pan: string;
  type: "Individual" | "Company" | "LLP" | "Partnership" | "HUF" | "Trust";
}

export interface FinancialYear {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
}

export interface Document {
  id: string;
  clientId: string;
  financialYearId: string;
  section: SectionType;
  name: string;
  description?: string;
  preparedBy: string; // userId
  reviewedBy?: string; // userId
  datePrepared: string;
  lastModified: string;
  version: number;
  size: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  uploadedBy: string; // userId
  uploadedAt: string;
  size: string;
  notes?: string;
}

export interface ActivityLogEntry {
  id: string;
  documentId: string;
  userId: string;
  action: string;
  timestamp: string;
}

export type UserRole = "admin" | "staff";

export type ComplianceItemStatus = "Completed" | "Reviewed";

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

export interface Section {
  id: string;
  clientId: string;
  financialYearId: string;
  name: string;
}

export interface ComplianceItem {
  id: string;
  sectionId: string;
  clientId: string;
  financialYearId: string;
  title: string;
  status: ComplianceItemStatus;
  preparedBy: string | null;
  preparedAt: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  createdAt: string;
}

export interface WorkDocument {
  id: string;
  complianceItemId: string;
  name: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export interface ActivityLog {
  id: string;
  complianceItemId: string;
  actionType: string;
  metadata: Record<string, string>;
  performedBy: string;
  createdAt: string;
}

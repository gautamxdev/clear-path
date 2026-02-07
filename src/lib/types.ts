export type UserRole = "admin" | "staff";

export type TaskStatus = "Filed" | "Pending" | "In Progress" | "Overdue";

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
  label: string; // e.g. "FY 2024-25"
  startDate: string;
  endDate: string;
}

export interface ComplianceTask {
  id: string;
  clientId: string;
  financialYearId: string;
  name: string;
  status: TaskStatus;
  assignedTo: string; // userId
  dueDate: string;
  description?: string;
}

export interface Document {
  id: string;
  taskId: string;
  name: string;
  uploadedBy: string; // userId
  uploadedAt: string;
  size: string;
}

export interface ActivityLogEntry {
  id: string;
  taskId: string;
  userId: string;
  action: string;
  timestamp: string;
}

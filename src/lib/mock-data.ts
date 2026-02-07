import type { User, Firm, Client, FinancialYear, ComplianceTask, Document, ActivityLogEntry } from "./types";

export const mockFirm: Firm = {
  id: "firm-1",
  name: "Sharma & Associates",
};

export const mockUsers: User[] = [
  { id: "u1", name: "Rajesh Sharma", email: "rajesh@sharma.ca", role: "admin", firmId: "firm-1" },
  { id: "u2", name: "Priya Mehta", email: "priya@sharma.ca", role: "staff", firmId: "firm-1" },
  { id: "u3", name: "Rahul Gupta", email: "rahul@sharma.ca", role: "staff", firmId: "firm-1" },
  { id: "u4", name: "Anita Verma", email: "anita@sharma.ca", role: "staff", firmId: "firm-1" },
];

export const mockClients: Client[] = [
  { id: "c1", firmId: "firm-1", name: "Tata Steel Ltd", pan: "AABCT1234A", type: "Company" },
  { id: "c2", firmId: "firm-1", name: "Ramesh Kumar", pan: "BKRPK5678B", type: "Individual" },
  { id: "c3", firmId: "firm-1", name: "Sunrise Traders LLP", pan: "AAFFS9012C", type: "LLP" },
  { id: "c4", firmId: "firm-1", name: "Mehra & Sons", pan: "AAHFM3456D", type: "Partnership" },
  { id: "c5", firmId: "firm-1", name: "Priya Textiles Pvt Ltd", pan: "AABCP7890E", type: "Company" },
  { id: "c6", firmId: "firm-1", name: "Vikram Joshi HUF", pan: "AAIHV2345F", type: "HUF" },
  { id: "c7", firmId: "firm-1", name: "Deepak Aggarwal", pan: "AKMPA6789G", type: "Individual" },
  { id: "c8", firmId: "firm-1", name: "Green Valley Exports", pan: "AABCG1357H", type: "Company" },
];

export const mockFinancialYears: FinancialYear[] = [
  { id: "fy-2024", label: "FY 2024–25", startDate: "2024-04-01", endDate: "2025-03-31" },
  { id: "fy-2023", label: "FY 2023–24", startDate: "2023-04-01", endDate: "2024-03-31" },
  { id: "fy-2022", label: "FY 2022–23", startDate: "2022-04-01", endDate: "2023-03-31" },
];

export const mockTasks: ComplianceTask[] = [
  // Tata Steel
  { id: "t1", clientId: "c1", financialYearId: "fy-2024", name: "GST Return – GSTR-3B (Monthly)", status: "Filed", assignedTo: "u2", dueDate: "2025-01-20" },
  { id: "t2", clientId: "c1", financialYearId: "fy-2024", name: "TDS Return – 26Q (Q3)", status: "In Progress", assignedTo: "u3", dueDate: "2025-01-31" },
  { id: "t3", clientId: "c1", financialYearId: "fy-2024", name: "Income Tax Return – ITR-6", status: "Pending", assignedTo: "u2", dueDate: "2025-03-31" },
  { id: "t4", clientId: "c1", financialYearId: "fy-2024", name: "GST Annual Return – GSTR-9", status: "Pending", assignedTo: "u4", dueDate: "2025-03-31" },
  { id: "t5", clientId: "c1", financialYearId: "fy-2024", name: "ROC Annual Filing – AOC-4", status: "Overdue", assignedTo: "u3", dueDate: "2024-11-30" },

  // Ramesh Kumar
  { id: "t6", clientId: "c2", financialYearId: "fy-2024", name: "Income Tax Return – ITR-1", status: "Filed", assignedTo: "u3", dueDate: "2024-07-31" },
  { id: "t7", clientId: "c2", financialYearId: "fy-2024", name: "TDS Return – 26Q (Q2)", status: "Filed", assignedTo: "u3", dueDate: "2024-10-31" },
  { id: "t8", clientId: "c2", financialYearId: "fy-2024", name: "Advance Tax – Q4", status: "Pending", assignedTo: "u4", dueDate: "2025-03-15" },

  // Sunrise Traders
  { id: "t9", clientId: "c3", financialYearId: "fy-2024", name: "GST Return – GSTR-3B (Monthly)", status: "In Progress", assignedTo: "u2", dueDate: "2025-01-20" },
  { id: "t10", clientId: "c3", financialYearId: "fy-2024", name: "LLP Form 11", status: "Pending", assignedTo: "u4", dueDate: "2025-05-30" },
  { id: "t11", clientId: "c3", financialYearId: "fy-2024", name: "Income Tax Return – ITR-5", status: "Pending", assignedTo: "u2", dueDate: "2025-03-31" },

  // Mehra & Sons
  { id: "t12", clientId: "c4", financialYearId: "fy-2024", name: "Partnership Deed Amendment", status: "Filed", assignedTo: "u4", dueDate: "2024-09-15" },
  { id: "t13", clientId: "c4", financialYearId: "fy-2024", name: "GST Return – GSTR-1 (Monthly)", status: "In Progress", assignedTo: "u3", dueDate: "2025-01-11" },

  // Priya Textiles
  { id: "t14", clientId: "c5", financialYearId: "fy-2024", name: "TDS Return – 24Q (Q3)", status: "Pending", assignedTo: "u2", dueDate: "2025-01-31" },
  { id: "t15", clientId: "c5", financialYearId: "fy-2024", name: "GST Return – GSTR-3B (Monthly)", status: "Filed", assignedTo: "u4", dueDate: "2025-01-20" },

  // Previous FY tasks
  { id: "t16", clientId: "c1", financialYearId: "fy-2023", name: "Income Tax Return – ITR-6", status: "Filed", assignedTo: "u2", dueDate: "2023-10-31" },
  { id: "t17", clientId: "c1", financialYearId: "fy-2023", name: "GST Annual Return – GSTR-9", status: "Filed", assignedTo: "u3", dueDate: "2023-12-31" },
  { id: "t18", clientId: "c2", financialYearId: "fy-2023", name: "Income Tax Return – ITR-1", status: "Filed", assignedTo: "u3", dueDate: "2023-07-31" },
];

export const mockDocuments: Document[] = [
  { id: "d1", taskId: "t1", name: "GSTR-3B_Dec2024.pdf", uploadedBy: "u2", uploadedAt: "2025-01-15T10:30:00", size: "245 KB" },
  { id: "d2", taskId: "t1", name: "Sales_Register_Dec.xlsx", uploadedBy: "u2", uploadedAt: "2025-01-14T14:20:00", size: "1.2 MB" },
  { id: "d3", taskId: "t2", name: "Form_26Q_Draft.pdf", uploadedBy: "u3", uploadedAt: "2025-01-18T09:15:00", size: "340 KB" },
  { id: "d4", taskId: "t2", name: "TDS_Challan_Q3.pdf", uploadedBy: "u3", uploadedAt: "2025-01-17T16:45:00", size: "120 KB" },
  { id: "d5", taskId: "t6", name: "ITR-1_AY2425_Ramesh.pdf", uploadedBy: "u3", uploadedAt: "2024-07-28T11:00:00", size: "890 KB" },
  { id: "d6", taskId: "t6", name: "Form_16_Ramesh.pdf", uploadedBy: "u3", uploadedAt: "2024-07-25T10:00:00", size: "456 KB" },
  { id: "d7", taskId: "t9", name: "GSTR-3B_Draft_Jan.pdf", uploadedBy: "u2", uploadedAt: "2025-01-19T08:30:00", size: "210 KB" },
  { id: "d8", taskId: "t5", name: "AOC-4_Draft.pdf", uploadedBy: "u3", uploadedAt: "2024-11-25T13:00:00", size: "1.5 MB" },
  { id: "d9", taskId: "t12", name: "Partnership_Deed_Amended.pdf", uploadedBy: "u4", uploadedAt: "2024-09-10T15:30:00", size: "2.1 MB" },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "a1", taskId: "t1", userId: "u2", action: "Uploaded GSTR-3B_Dec2024.pdf", timestamp: "2025-01-15T10:30:00" },
  { id: "a2", taskId: "t1", userId: "u2", action: "Status changed to Filed", timestamp: "2025-01-15T10:35:00" },
  { id: "a3", taskId: "t1", userId: "u2", action: "Uploaded Sales_Register_Dec.xlsx", timestamp: "2025-01-14T14:20:00" },
  { id: "a4", taskId: "t1", userId: "u1", action: "Task created", timestamp: "2025-01-01T09:00:00" },
  { id: "a5", taskId: "t2", userId: "u3", action: "Uploaded Form_26Q_Draft.pdf", timestamp: "2025-01-18T09:15:00" },
  { id: "a6", taskId: "t2", userId: "u3", action: "Status changed to In Progress", timestamp: "2025-01-17T17:00:00" },
  { id: "a7", taskId: "t2", userId: "u3", action: "Uploaded TDS_Challan_Q3.pdf", timestamp: "2025-01-17T16:45:00" },
  { id: "a8", taskId: "t2", userId: "u1", action: "Assigned to Rahul Gupta", timestamp: "2025-01-10T10:00:00" },
  { id: "a9", taskId: "t2", userId: "u1", action: "Task created", timestamp: "2025-01-10T09:30:00" },
  { id: "a10", taskId: "t5", userId: "u3", action: "Uploaded AOC-4_Draft.pdf", timestamp: "2024-11-25T13:00:00" },
  { id: "a11", taskId: "t5", userId: "u1", action: "Status changed to Overdue", timestamp: "2024-12-01T00:00:00" },
  { id: "a12", taskId: "t5", userId: "u1", action: "Task created", timestamp: "2024-10-01T09:00:00" },
  { id: "a13", taskId: "t6", userId: "u3", action: "Status changed to Filed", timestamp: "2024-07-28T11:30:00" },
  { id: "a14", taskId: "t6", userId: "u3", action: "Uploaded ITR-1_AY2425_Ramesh.pdf", timestamp: "2024-07-28T11:00:00" },
  { id: "a15", taskId: "t6", userId: "u3", action: "Uploaded Form_16_Ramesh.pdf", timestamp: "2024-07-25T10:00:00" },
  { id: "a16", taskId: "t6", userId: "u1", action: "Task created", timestamp: "2024-06-15T09:00:00" },
  { id: "a17", taskId: "t9", userId: "u2", action: "Uploaded GSTR-3B_Draft_Jan.pdf", timestamp: "2025-01-19T08:30:00" },
  { id: "a18", taskId: "t9", userId: "u2", action: "Status changed to In Progress", timestamp: "2025-01-18T10:00:00" },
  { id: "a19", taskId: "t12", userId: "u4", action: "Status changed to Filed", timestamp: "2024-09-12T14:00:00" },
  { id: "a20", taskId: "t12", userId: "u4", action: "Uploaded Partnership_Deed_Amended.pdf", timestamp: "2024-09-10T15:30:00" },
];

// Helper to get user name by id
export function getUserName(userId: string): string {
  return mockUsers.find(u => u.id === userId)?.name ?? "Unknown";
}

// Helper to get client name by id
export function getClientName(clientId: string): string {
  return mockClients.find(c => c.id === clientId)?.name ?? "Unknown";
}

// Helper to get FY label
export function getFYLabel(fyId: string): string {
  return mockFinancialYears.find(fy => fy.id === fyId)?.label ?? "Unknown";
}

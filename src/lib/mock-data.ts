import type { User, Firm, Client, FinancialYear, Document, DocumentVersion, ActivityLogEntry, SectionType } from "./types";

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

export const mockDocuments: Document[] = [
  // Tata Steel – GST
  { id: "d1", clientId: "c1", financialYearId: "fy-2024", section: "GST", name: "GSTR-3B Dec 2024", description: "Monthly return for December", preparedBy: "u2", reviewedBy: "u1", datePrepared: "2025-01-15", lastModified: "2025-01-15T10:30:00", version: 2, size: "245 KB" },
  { id: "d2", clientId: "c1", financialYearId: "fy-2024", section: "GST", name: "GSTR-1 Dec 2024", description: "Outward supplies for December", preparedBy: "u2", datePrepared: "2025-01-10", lastModified: "2025-01-12T14:20:00", version: 1, size: "180 KB" },
  { id: "d3", clientId: "c1", financialYearId: "fy-2024", section: "GST", name: "Sales Register Q3", description: "Quarterly sales register", preparedBy: "u3", datePrepared: "2025-01-08", lastModified: "2025-01-09T09:00:00", version: 1, size: "1.2 MB" },
  { id: "d4", clientId: "c1", financialYearId: "fy-2024", section: "GST", name: "GSTR-9 Annual Return Draft", preparedBy: "u4", datePrepared: "2025-01-20", lastModified: "2025-01-20T16:00:00", version: 1, size: "890 KB" },

  // Tata Steel – TDS
  { id: "d5", clientId: "c1", financialYearId: "fy-2024", section: "TDS", name: "Form 26Q – Q3", description: "TDS return for Q3", preparedBy: "u3", reviewedBy: "u1", datePrepared: "2025-01-18", lastModified: "2025-01-19T09:15:00", version: 3, size: "340 KB" },
  { id: "d6", clientId: "c1", financialYearId: "fy-2024", section: "TDS", name: "TDS Challan Q3", preparedBy: "u3", datePrepared: "2025-01-17", lastModified: "2025-01-17T16:45:00", version: 1, size: "120 KB" },
  { id: "d7", clientId: "c1", financialYearId: "fy-2024", section: "TDS", name: "Form 24Q – Q3", description: "Salary TDS return", preparedBy: "u2", datePrepared: "2025-01-22", lastModified: "2025-01-22T11:00:00", version: 1, size: "290 KB" },

  // Tata Steel – Income Tax
  { id: "d8", clientId: "c1", financialYearId: "fy-2024", section: "Income Tax", name: "ITR-6 Computation", description: "Draft computation of income", preparedBy: "u2", datePrepared: "2025-02-01", lastModified: "2025-02-01T10:00:00", version: 1, size: "560 KB" },

  // Tata Steel – Audit
  { id: "d9", clientId: "c1", financialYearId: "fy-2024", section: "Audit", name: "Audit Working Papers", description: "Statutory audit working papers", preparedBy: "u3", reviewedBy: "u1", datePrepared: "2024-11-15", lastModified: "2024-12-20T13:00:00", version: 4, size: "3.5 MB" },
  { id: "d10", clientId: "c1", financialYearId: "fy-2024", section: "Audit", name: "Bank Reconciliation", preparedBy: "u4", datePrepared: "2024-11-10", lastModified: "2024-11-10T15:30:00", version: 1, size: "780 KB" },

  // Tata Steel – Notices
  { id: "d11", clientId: "c1", financialYearId: "fy-2024", section: "Notices", name: "GST Notice – ASMT-10", description: "Scrutiny notice reply", preparedBy: "u2", reviewedBy: "u1", datePrepared: "2024-10-05", lastModified: "2024-10-08T14:00:00", version: 2, size: "450 KB" },

  // Ramesh Kumar – Income Tax
  { id: "d12", clientId: "c2", financialYearId: "fy-2024", section: "Income Tax", name: "ITR-1 AY 2025-26", description: "Individual return", preparedBy: "u3", reviewedBy: "u1", datePrepared: "2024-07-28", lastModified: "2024-07-28T11:00:00", version: 2, size: "890 KB" },
  { id: "d13", clientId: "c2", financialYearId: "fy-2024", section: "Income Tax", name: "Form 16", description: "Employer TDS certificate", preparedBy: "u3", datePrepared: "2024-07-25", lastModified: "2024-07-25T10:00:00", version: 1, size: "456 KB" },
  { id: "d14", clientId: "c2", financialYearId: "fy-2024", section: "Income Tax", name: "Advance Tax Computation Q4", preparedBy: "u4", datePrepared: "2025-03-01", lastModified: "2025-03-01T09:30:00", version: 1, size: "210 KB" },

  // Ramesh Kumar – TDS
  { id: "d15", clientId: "c2", financialYearId: "fy-2024", section: "TDS", name: "Form 26Q – Q2", preparedBy: "u3", datePrepared: "2024-10-25", lastModified: "2024-10-25T14:00:00", version: 1, size: "280 KB" },

  // Sunrise Traders – GST
  { id: "d16", clientId: "c3", financialYearId: "fy-2024", section: "GST", name: "GSTR-3B Jan 2025 Draft", description: "Draft monthly return", preparedBy: "u2", datePrepared: "2025-01-19", lastModified: "2025-01-19T08:30:00", version: 1, size: "210 KB" },
  { id: "d17", clientId: "c3", financialYearId: "fy-2024", section: "GST", name: "Purchase Register Q3", preparedBy: "u4", datePrepared: "2025-01-05", lastModified: "2025-01-05T11:00:00", version: 1, size: "950 KB" },

  // Sunrise Traders – Income Tax
  { id: "d18", clientId: "c3", financialYearId: "fy-2024", section: "Income Tax", name: "ITR-5 Computation Draft", preparedBy: "u2", datePrepared: "2025-02-10", lastModified: "2025-02-10T10:00:00", version: 1, size: "670 KB" },

  // Mehra & Sons – Other
  { id: "d19", clientId: "c4", financialYearId: "fy-2024", section: "Other", name: "Partnership Deed Amendment", description: "Amended partnership deed", preparedBy: "u4", reviewedBy: "u1", datePrepared: "2024-09-10", lastModified: "2024-09-12T14:00:00", version: 2, size: "2.1 MB" },

  // Mehra & Sons – GST
  { id: "d20", clientId: "c4", financialYearId: "fy-2024", section: "GST", name: "GSTR-1 Dec 2024", preparedBy: "u3", datePrepared: "2025-01-08", lastModified: "2025-01-08T10:00:00", version: 1, size: "195 KB" },

  // Previous FY
  { id: "d21", clientId: "c1", financialYearId: "fy-2023", section: "Income Tax", name: "ITR-6 AY 2024-25", preparedBy: "u2", reviewedBy: "u1", datePrepared: "2023-10-20", lastModified: "2023-10-31T09:00:00", version: 3, size: "1.1 MB" },
  { id: "d22", clientId: "c1", financialYearId: "fy-2023", section: "GST", name: "GSTR-9 Annual Return", preparedBy: "u3", reviewedBy: "u1", datePrepared: "2023-12-15", lastModified: "2023-12-31T16:00:00", version: 2, size: "980 KB" },
];

export const mockDocumentVersions: DocumentVersion[] = [
  { id: "v1", documentId: "d1", version: 1, uploadedBy: "u2", uploadedAt: "2025-01-14T14:20:00", size: "230 KB", notes: "Initial draft" },
  { id: "v2", documentId: "d1", version: 2, uploadedBy: "u2", uploadedAt: "2025-01-15T10:30:00", size: "245 KB", notes: "Final after review corrections" },
  { id: "v3", documentId: "d5", version: 1, uploadedBy: "u3", uploadedAt: "2025-01-16T09:00:00", size: "310 KB" },
  { id: "v4", documentId: "d5", version: 2, uploadedBy: "u3", uploadedAt: "2025-01-17T16:45:00", size: "325 KB", notes: "Updated challan details" },
  { id: "v5", documentId: "d5", version: 3, uploadedBy: "u3", uploadedAt: "2025-01-19T09:15:00", size: "340 KB", notes: "Final version" },
  { id: "v6", documentId: "d9", version: 1, uploadedBy: "u3", uploadedAt: "2024-11-15T10:00:00", size: "2.8 MB" },
  { id: "v7", documentId: "d9", version: 2, uploadedBy: "u3", uploadedAt: "2024-11-28T14:00:00", size: "3.0 MB", notes: "Added debtors confirmation" },
  { id: "v8", documentId: "d9", version: 3, uploadedBy: "u3", uploadedAt: "2024-12-10T11:00:00", size: "3.3 MB", notes: "Updated for management queries" },
  { id: "v9", documentId: "d9", version: 4, uploadedBy: "u1", uploadedAt: "2024-12-20T13:00:00", size: "3.5 MB", notes: "Final reviewed version" },
  { id: "v10", documentId: "d12", version: 1, uploadedBy: "u3", uploadedAt: "2024-07-25T10:00:00", size: "850 KB" },
  { id: "v11", documentId: "d12", version: 2, uploadedBy: "u3", uploadedAt: "2024-07-28T11:00:00", size: "890 KB", notes: "Corrected 80C deductions" },
];

export const mockActivityLog: ActivityLogEntry[] = [
  { id: "a1", documentId: "d1", userId: "u2", action: "Uploaded document", timestamp: "2025-01-14T14:20:00" },
  { id: "a2", documentId: "d1", userId: "u2", action: "Updated to version 2", timestamp: "2025-01-15T10:30:00" },
  { id: "a3", documentId: "d1", userId: "u1", action: "Marked as reviewed", timestamp: "2025-01-15T11:00:00" },
  { id: "a4", documentId: "d5", userId: "u3", action: "Uploaded document", timestamp: "2025-01-16T09:00:00" },
  { id: "a5", documentId: "d5", userId: "u3", action: "Updated to version 2", timestamp: "2025-01-17T16:45:00" },
  { id: "a6", documentId: "d5", userId: "u3", action: "Updated to version 3", timestamp: "2025-01-19T09:15:00" },
  { id: "a7", documentId: "d5", userId: "u1", action: "Marked as reviewed", timestamp: "2025-01-19T10:00:00" },
  { id: "a8", documentId: "d9", userId: "u3", action: "Uploaded document", timestamp: "2024-11-15T10:00:00" },
  { id: "a9", documentId: "d9", userId: "u3", action: "Updated to version 2", timestamp: "2024-11-28T14:00:00" },
  { id: "a10", documentId: "d9", userId: "u3", action: "Updated to version 3", timestamp: "2024-12-10T11:00:00" },
  { id: "a11", documentId: "d9", userId: "u1", action: "Reviewed and finalized", timestamp: "2024-12-20T13:00:00" },
  { id: "a12", documentId: "d12", userId: "u3", action: "Uploaded document", timestamp: "2024-07-25T10:00:00" },
  { id: "a13", documentId: "d12", userId: "u3", action: "Updated to version 2", timestamp: "2024-07-28T11:00:00" },
  { id: "a14", documentId: "d12", userId: "u1", action: "Marked as reviewed", timestamp: "2024-07-28T12:00:00" },
  { id: "a15", documentId: "d11", userId: "u2", action: "Uploaded document", timestamp: "2024-10-05T09:00:00" },
  { id: "a16", documentId: "d11", userId: "u2", action: "Updated reply draft", timestamp: "2024-10-08T14:00:00" },
  { id: "a17", documentId: "d11", userId: "u1", action: "Marked as reviewed", timestamp: "2024-10-08T15:00:00" },
  { id: "a18", documentId: "d16", userId: "u2", action: "Uploaded document", timestamp: "2025-01-19T08:30:00" },
  { id: "a19", documentId: "d19", userId: "u4", action: "Uploaded document", timestamp: "2024-09-10T15:30:00" },
  { id: "a20", documentId: "d19", userId: "u4", action: "Updated to version 2", timestamp: "2024-09-12T14:00:00" },
  { id: "a21", documentId: "d19", userId: "u1", action: "Marked as reviewed", timestamp: "2024-09-12T15:00:00" },
];

// Helpers
export function getUserName(userId: string): string {
  return mockUsers.find(u => u.id === userId)?.name ?? "Unknown";
}

export function getClientName(clientId: string): string {
  return mockClients.find(c => c.id === clientId)?.name ?? "Unknown";
}

export function getFYLabel(fyId: string): string {
  return mockFinancialYears.find(fy => fy.id === fyId)?.label ?? "Unknown";
}

export function getDocumentsForSection(clientId: string, fyId: string, section: SectionType): Document[] {
  return mockDocuments.filter(d => d.clientId === clientId && d.financialYearId === fyId && d.section === section);
}

export function getSectionCounts(clientId: string, fyId: string): Record<SectionType, number> {
  const docs = mockDocuments.filter(d => d.clientId === clientId && d.financialYearId === fyId);
  return {
    GST: docs.filter(d => d.section === "GST").length,
    TDS: docs.filter(d => d.section === "TDS").length,
    "Income Tax": docs.filter(d => d.section === "Income Tax").length,
    Audit: docs.filter(d => d.section === "Audit").length,
    Notices: docs.filter(d => d.section === "Notices").length,
    Other: docs.filter(d => d.section === "Other").length,
  };
}

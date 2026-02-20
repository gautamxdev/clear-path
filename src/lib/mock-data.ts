import type { User, Firm, Client, FinancialYear, Section, ComplianceItem, WorkDocument, ActivityLog } from "./types";

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

export const PREDEFINED_SECTIONS = [
  "GST",
  "Income Tax",
  "TDS",
  "ROC",
  "Audit",
  "Notices",
  "Other",
] as const;

// Generate sections for each client + FY combination
function generateSections(): Section[] {
  const sections: Section[] = [];
  let counter = 1;
  for (const client of mockClients) {
    for (const fy of mockFinancialYears) {
      for (const name of PREDEFINED_SECTIONS) {
        sections.push({
          id: `sec-${counter++}`,
          clientId: client.id,
          financialYearId: fy.id,
          name,
        });
      }
    }
  }
  return sections;
}

export const mockSections: Section[] = generateSections();

export function getSectionsForClientFY(clientId: string, fyId: string): Section[] {
  return mockSections.filter((s) => s.clientId === clientId && s.financialYearId === fyId);
}

export function getSectionName(sectionId: string): string {
  return mockSections.find((s) => s.id === sectionId)?.name ?? "Unknown";
}

// Compliance items (working papers)
export const mockComplianceItems: ComplianceItem[] = [
  // Tata Steel – FY 2024–25
  { id: "ci1", sectionId: "sec-1", clientId: "c1", financialYearId: "fy-2024", title: "GSTR-3B – December 2024", status: "Reviewed", preparedBy: "u2", preparedAt: "2025-01-12T10:00:00", reviewedBy: "u1", reviewedAt: "2025-01-15T11:00:00", createdAt: "2025-01-01T09:00:00" },
  { id: "ci2", sectionId: "sec-1", clientId: "c1", financialYearId: "fy-2024", title: "GSTR-1 – December 2024", status: "Completed", preparedBy: "u2", preparedAt: "2025-01-14T14:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-01T09:00:00" },
  { id: "ci3", sectionId: "sec-1", clientId: "c1", financialYearId: "fy-2024", title: "GSTR-9 Annual Return", status: "Completed", preparedBy: "u4", preparedAt: "2025-01-18T09:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-05T09:00:00" },
  { id: "ci4", sectionId: "sec-3", clientId: "c1", financialYearId: "fy-2024", title: "Form 26Q – Q3", status: "Completed", preparedBy: "u3", preparedAt: "2025-01-17T16:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-10T09:00:00" },
  { id: "ci5", sectionId: "sec-2", clientId: "c1", financialYearId: "fy-2024", title: "ITR-6 Computation", status: "Completed", preparedBy: "u2", preparedAt: "2025-01-20T10:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-08T09:00:00" },
  { id: "ci6", sectionId: "sec-4", clientId: "c1", financialYearId: "fy-2024", title: "AOC-4 Annual Filing", status: "Reviewed", preparedBy: "u3", preparedAt: "2024-11-20T13:00:00", reviewedBy: "u1", reviewedAt: "2024-11-28T10:00:00", createdAt: "2024-10-01T09:00:00" },
  { id: "ci7", sectionId: "sec-5", clientId: "c1", financialYearId: "fy-2024", title: "Statutory Audit Working Papers", status: "Completed", preparedBy: "u4", preparedAt: "2025-01-22T09:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-02T09:00:00" },

  // Ramesh Kumar – FY 2024–25
  { id: "ci8", sectionId: "sec-9", clientId: "c2", financialYearId: "fy-2024", title: "ITR-1 Computation", status: "Reviewed", preparedBy: "u3", preparedAt: "2024-07-25T11:00:00", reviewedBy: "u1", reviewedAt: "2024-07-28T14:00:00", createdAt: "2024-06-15T09:00:00" },
  { id: "ci9", sectionId: "sec-10", clientId: "c2", financialYearId: "fy-2024", title: "Form 26Q – Q2", status: "Reviewed", preparedBy: "u3", preparedAt: "2024-10-28T10:00:00", reviewedBy: "u1", reviewedAt: "2024-10-30T16:00:00", createdAt: "2024-10-01T09:00:00" },
  { id: "ci10", sectionId: "sec-9", clientId: "c2", financialYearId: "fy-2024", title: "Advance Tax Q4 Computation", status: "Completed", preparedBy: "u4", preparedAt: "2025-03-10T09:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-02-15T09:00:00" },

  // Sunrise Traders – FY 2024–25
  { id: "ci11", sectionId: "sec-15", clientId: "c3", financialYearId: "fy-2024", title: "GSTR-3B – January 2025", status: "Completed", preparedBy: "u2", preparedAt: "2025-01-19T08:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-05T09:00:00" },
  { id: "ci12", sectionId: "sec-16", clientId: "c3", financialYearId: "fy-2024", title: "ITR-5 Computation", status: "Completed", preparedBy: "u2", preparedAt: "2025-01-20T14:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-10T09:00:00" },
  { id: "ci13", sectionId: "sec-18", clientId: "c3", financialYearId: "fy-2024", title: "LLP Form 11", status: "Completed", preparedBy: "u4", preparedAt: "2025-01-22T10:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-15T09:00:00" },

  // Mehra & Sons – FY 2024–25
  { id: "ci14", sectionId: "sec-22", clientId: "c4", financialYearId: "fy-2024", title: "GSTR-1 – December 2024", status: "Reviewed", preparedBy: "u3", preparedAt: "2025-01-08T11:00:00", reviewedBy: "u1", reviewedAt: "2025-01-10T15:00:00", createdAt: "2025-01-01T09:00:00" },
  { id: "ci15", sectionId: "sec-27", clientId: "c4", financialYearId: "fy-2024", title: "Partnership Deed Amendment Docs", status: "Reviewed", preparedBy: "u4", preparedAt: "2024-09-08T15:00:00", reviewedBy: "u1", reviewedAt: "2024-09-12T10:00:00", createdAt: "2024-08-20T09:00:00" },

  // Priya Textiles – FY 2024–25
  { id: "ci16", sectionId: "sec-31", clientId: "c5", financialYearId: "fy-2024", title: "Form 24Q – Q3", status: "Completed", preparedBy: "u2", preparedAt: "2025-01-25T10:00:00", reviewedBy: null, reviewedAt: null, createdAt: "2025-01-15T09:00:00" },
  { id: "ci17", sectionId: "sec-29", clientId: "c5", financialYearId: "fy-2024", title: "GSTR-3B – December 2024", status: "Reviewed", preparedBy: "u4", preparedAt: "2025-01-16T14:00:00", reviewedBy: "u1", reviewedAt: "2025-01-18T09:00:00", createdAt: "2025-01-01T09:00:00" },

  // Previous FY items
  { id: "ci18", sectionId: "sec-9", clientId: "c1", financialYearId: "fy-2023", title: "ITR-6 Computation", status: "Reviewed", preparedBy: "u2", preparedAt: "2023-10-20T10:00:00", reviewedBy: "u1", reviewedAt: "2023-10-28T14:00:00", createdAt: "2023-09-01T09:00:00" },
  { id: "ci19", sectionId: "sec-8", clientId: "c1", financialYearId: "fy-2023", title: "GSTR-9 Annual Return", status: "Reviewed", preparedBy: "u3", preparedAt: "2023-12-20T11:00:00", reviewedBy: "u1", reviewedAt: "2023-12-28T16:00:00", createdAt: "2023-11-01T09:00:00" },
];

export const mockDocuments: WorkDocument[] = [
  { id: "d1", complianceItemId: "ci1", name: "GSTR-3B_Dec2024.pdf", fileUrl: "#", uploadedBy: "u2", uploadedAt: "2025-01-12T10:30:00", size: "245 KB" },
  { id: "d2", complianceItemId: "ci1", name: "Sales_Register_Dec.xlsx", fileUrl: "#", uploadedBy: "u2", uploadedAt: "2025-01-11T14:20:00", size: "1.2 MB" },
  { id: "d3", complianceItemId: "ci4", name: "Form_26Q_Draft.pdf", fileUrl: "#", uploadedBy: "u3", uploadedAt: "2025-01-17T09:15:00", size: "340 KB" },
  { id: "d4", complianceItemId: "ci4", name: "TDS_Challan_Q3.pdf", fileUrl: "#", uploadedBy: "u3", uploadedAt: "2025-01-16T16:45:00", size: "120 KB" },
  { id: "d5", complianceItemId: "ci8", name: "ITR-1_AY2425_Ramesh.pdf", fileUrl: "#", uploadedBy: "u3", uploadedAt: "2024-07-25T11:00:00", size: "890 KB" },
  { id: "d6", complianceItemId: "ci8", name: "Form_16_Ramesh.pdf", fileUrl: "#", uploadedBy: "u3", uploadedAt: "2024-07-24T10:00:00", size: "456 KB" },
  { id: "d7", complianceItemId: "ci11", name: "GSTR-3B_Draft_Jan.pdf", fileUrl: "#", uploadedBy: "u2", uploadedAt: "2025-01-19T08:30:00", size: "210 KB" },
  { id: "d8", complianceItemId: "ci6", name: "AOC-4_Filing.pdf", fileUrl: "#", uploadedBy: "u3", uploadedAt: "2024-11-20T13:00:00", size: "1.5 MB" },
  { id: "d9", complianceItemId: "ci15", name: "Partnership_Deed_Amended.pdf", fileUrl: "#", uploadedBy: "u4", uploadedAt: "2024-09-08T15:30:00", size: "2.1 MB" },
];

export const mockActivityLog: ActivityLog[] = [
  { id: "a1", complianceItemId: "ci1", actionType: "document_uploaded", metadata: { fileName: "GSTR-3B_Dec2024.pdf" }, performedBy: "u2", createdAt: "2025-01-12T10:30:00" },
  { id: "a2", complianceItemId: "ci1", actionType: "status_changed", metadata: { from: "Completed", to: "Reviewed" }, performedBy: "u1", createdAt: "2025-01-15T11:00:00" },
  { id: "a3", complianceItemId: "ci1", actionType: "reviewed_by_set", metadata: { userName: "Rajesh Sharma" }, performedBy: "u1", createdAt: "2025-01-15T11:00:00" },
  { id: "a4", complianceItemId: "ci1", actionType: "prepared_by_set", metadata: { userName: "Priya Mehta" }, performedBy: "u2", createdAt: "2025-01-12T10:00:00" },
  { id: "a5", complianceItemId: "ci1", actionType: "status_changed", metadata: { to: "Completed" }, performedBy: "u2", createdAt: "2025-01-12T10:00:00" },
  { id: "a6", complianceItemId: "ci1", actionType: "document_uploaded", metadata: { fileName: "Sales_Register_Dec.xlsx" }, performedBy: "u2", createdAt: "2025-01-11T14:20:00" },
  { id: "a7", complianceItemId: "ci4", actionType: "document_uploaded", metadata: { fileName: "Form_26Q_Draft.pdf" }, performedBy: "u3", createdAt: "2025-01-17T09:15:00" },
  { id: "a8", complianceItemId: "ci4", actionType: "prepared_by_set", metadata: { userName: "Rahul Gupta" }, performedBy: "u3", createdAt: "2025-01-17T09:00:00" },
  { id: "a9", complianceItemId: "ci4", actionType: "status_changed", metadata: { to: "Completed" }, performedBy: "u3", createdAt: "2025-01-17T16:00:00" },
  { id: "a10", complianceItemId: "ci6", actionType: "status_changed", metadata: { from: "Completed", to: "Reviewed" }, performedBy: "u1", createdAt: "2024-11-28T10:00:00" },
  { id: "a11", complianceItemId: "ci6", actionType: "document_uploaded", metadata: { fileName: "AOC-4_Filing.pdf" }, performedBy: "u3", createdAt: "2024-11-20T13:00:00" },
  { id: "a12", complianceItemId: "ci8", actionType: "status_changed", metadata: { from: "Completed", to: "Reviewed" }, performedBy: "u1", createdAt: "2024-07-28T14:00:00" },
  { id: "a13", complianceItemId: "ci8", actionType: "document_uploaded", metadata: { fileName: "ITR-1_AY2425_Ramesh.pdf" }, performedBy: "u3", createdAt: "2024-07-25T11:00:00" },
  { id: "a14", complianceItemId: "ci14", actionType: "status_changed", metadata: { from: "Completed", to: "Reviewed" }, performedBy: "u1", createdAt: "2025-01-10T15:00:00" },
  { id: "a15", complianceItemId: "ci15", actionType: "document_uploaded", metadata: { fileName: "Partnership_Deed_Amended.pdf" }, performedBy: "u4", createdAt: "2024-09-08T15:30:00" },
  { id: "a16", complianceItemId: "ci17", actionType: "status_changed", metadata: { from: "Completed", to: "Reviewed" }, performedBy: "u1", createdAt: "2025-01-18T09:00:00" },
];

// Helpers
export function getUserName(userId: string): string {
  return mockUsers.find((u) => u.id === userId)?.name ?? "Unknown";
}

export function getClientName(clientId: string): string {
  return mockClients.find((c) => c.id === clientId)?.name ?? "Unknown";
}

export function getFYLabel(fyId: string): string {
  return mockFinancialYears.find((fy) => fy.id === fyId)?.label ?? "Unknown";
}

export function getLastActivity(complianceItemId: string): { userName: string; action: string; timestamp: string } | null {
  const entries = mockActivityLog
    .filter((e) => e.complianceItemId === complianceItemId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  if (entries.length === 0) return null;
  const entry = entries[0];
  return { userName: getUserName(entry.performedBy), action: formatAction(entry), timestamp: entry.createdAt };
}

export function formatAction(entry: ActivityLog): string {
  switch (entry.actionType) {
    case "document_uploaded":
      return `Uploaded ${entry.metadata.fileName}`;
    case "status_changed":
      return entry.metadata.from
        ? `Status changed from ${entry.metadata.from} to ${entry.metadata.to}`
        : `Status set to ${entry.metadata.to}`;
    case "prepared_by_set":
      return `Prepared by set to ${entry.metadata.userName}`;
    case "reviewed_by_set":
      return `Reviewed by set to ${entry.metadata.userName}`;
    default:
      return entry.actionType;
  }
}

export function getItemsForSection(sectionId: string): ComplianceItem[] {
  return mockComplianceItems.filter((i) => i.sectionId === sectionId);
}

export function getItemCountForSection(sectionId: string): number {
  return mockComplianceItems.filter((i) => i.sectionId === sectionId).length;
}

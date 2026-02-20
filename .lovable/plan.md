

# Refactor: Task Tracker to Working-Paper Documentation System

## Summary

Transform the current compliance task tracker into a structured documentation repository. The core change is replacing the task-management model (assigned user, due dates, status workflows like Filed/Pending/In Progress/Overdue) with a working-paper model (prepared by, reviewed by, documents, activity trail). The visual theme (dark sidebar, light content, tables, badges) stays intact.

---

## What Changes

### Data Model (src/lib/types.ts)

Remove: `ComplianceTask`, `TaskStatus` (Filed/Pending/In Progress/Overdue), `Document` (task-linked), `ActivityLogEntry` (task-linked).

Add:

- `Section` -- predefined compliance categories (GST, Income Tax, TDS, ROC, Audit, Notices, Other)
- `ComplianceItem` -- replaces `ComplianceTask`:
  - `id`, `sectionId`, `clientId`, `financialYearId`, `title`
  - `status`: enum `"Completed" | "Reviewed"` (only two states)
  - `preparedBy` (nullable user ID), `preparedAt` (nullable timestamp)
  - `reviewedBy` (nullable user ID), `reviewedAt` (nullable timestamp)
  - `createdAt`
- `WorkDocument` -- belongs to compliance item:
  - `id`, `complianceItemId`, `name`, `fileUrl`, `uploadedBy`, `uploadedAt`, `size`
- `ActivityLog` -- per compliance item:
  - `id`, `complianceItemId`, `actionType`, `metadata` (JSON-like object), `performedBy`, `createdAt`

### Mock Data (src/lib/mock-data.ts)

Full rewrite of mock data to match the new model:
- Keep `mockFirm`, `mockUsers`, `mockClients`, `mockFinancialYears` (largely unchanged)
- Define `PREDEFINED_SECTIONS` constant array: GST, Income Tax, TDS, ROC, Audit, Notices, Other
- Generate `mockSections` for each client + FY combination
- Replace `mockTasks` with `mockComplianceItems` using the new fields
- Replace `mockDocuments` and `mockActivityLog` with new shape
- Update helper functions: remove `getLastActivity(taskId)`, add `getLastActivity(complianceItemId)`, `getSectionsForClientFY()`, etc.

### Status Badge (src/components/StatusBadge.tsx)

Replace the four-status config with two states:
- **Completed** -- blue/green badge
- **Reviewed** -- green/success badge

Remove Overdue/Pending/In Progress/Filed styling.

### Routes (src/App.tsx)

```
/              -- redirect (unchanged)
/login         -- login (unchanged)
/setup         -- firm setup (unchanged)
/dashboard     -- main client dashboard (refactored)
/item/:itemId  -- compliance item detail (replaces /task/:taskId)
/filters       -- global filters (refactored)
```

### Sidebar (src/components/AppSidebar.tsx)

Keep dark sidebar, firm header, client list, sign-out. Remove "Pending Filings" and "Notices" nav items (no longer applicable to the two-status model). Keep "All Clients" and "Global Filters".

### Dashboard Page (src/pages/Dashboard.tsx)

Refactor the main content area to a **two-column layout** for the selected client:

**Left column** (narrow, ~240px):
- Financial Year selector dropdown
- Collapsible section tree: GST, Income Tax, TDS, ROC, Audit, Notices, Other
- Each section shows item count badge
- Clicking a section loads items in the right column

**Right column**:
- When a section is selected: table of compliance items with columns:
  - Item Name
  - Status (Completed / Reviewed badge)
  - Prepared By
  - Prepared At
  - Reviewed By
  - Reviewed At
  - Last Activity
- Clicking a row navigates to the item detail page
- Summary bar above table shows counts (e.g., "3 Completed, 2 Reviewed")

Remove the old single-table task view and the top summary metrics bar.

### New Component: SectionTree (src/components/SectionTree.tsx)

A collapsible list of predefined sections for the selected client + FY. Uses Radix Collapsible or simple accordion-style UI. Highlights the active section. Shows count of items per section.

### New Component: ComplianceItemTable (src/components/ComplianceItemTable.tsx)

Replaces `ClientTaskTable`. Columns:
- Item Name (clickable)
- Status badge (Completed / Reviewed)
- Prepared By (user name or "--")
- Prepared At (formatted date or "--")
- Reviewed By (user name or "--")
- Reviewed At (formatted date or "--")
- Last Activity (user + action + relative time)

No overdue row highlighting (concept removed).

### Item Detail Page (src/pages/ComplianceItemDetail.tsx)

Replaces `TaskDetail.tsx`. Layout:

**Header:**
- Back button
- Item name + section name breadcrumb
- Status dropdown (Completed / Reviewed)

**Detail cards row:**
- Client name
- Financial Year
- Status
- Prepared By (selector dropdown)
- Reviewed By (selector dropdown, only enabled when status = Reviewed)

**Documents section:**
- List of uploaded documents (name, uploaded by, uploaded at)
- Upload button (mock)

**Activity Timeline section:**
- Chronological entries showing user name, action, timestamp
- Reuse the existing `ActivityLog` component pattern but with new data shape

### Activity Log Component (src/components/ActivityLog.tsx)

Update to accept `complianceItemId` instead of `taskId`. Same timeline visual. Action types: "Document uploaded", "Status changed to Completed", "Prepared by set to [name]", "Reviewed by set to [name]".

### Global Filters Page (src/pages/GlobalFilters.tsx)

Refactor filters:
- Remove "Assigned To" filter (no assignment concept)
- Keep Financial Year filter
- Replace status options with: Completed, Reviewed
- Add Section filter (GST, Income Tax, etc.)
- Table columns match the new compliance item model

### Files to Delete

- `src/components/ClientTaskTable.tsx` -- replaced by `ComplianceItemTable`
- `src/pages/TaskDetail.tsx` -- replaced by `ComplianceItemDetail`

### Files Unchanged

- `src/index.css` -- theme preserved
- `tailwind.config.ts` -- status color variables updated (remove overdue/pending/in-progress, keep two status colors)
- `src/pages/Login.tsx` -- unchanged
- `src/pages/FirmSetup.tsx` -- unchanged
- `src/components/ui/*` -- all UI primitives unchanged

---

## Technical Details

### Status Color Updates (tailwind.config.ts + index.css)

Replace the four status color pairs with two:
- `--status-completed`: blue tone (215 70% 52%) with light bg
- `--status-reviewed`: green tone (152 55% 42%) with light bg

Remove `--status-pending`, `--status-overdue`, `--status-in-progress`, `--status-filed` and their bg variants.

### State Management in Dashboard

The Dashboard component manages:
- `selectedClientId` (from sidebar)
- `selectedFY` (from FY selector in left column)
- `selectedSectionId` (from section tree, nullable)
- `selectedItemId` (null on dashboard; detail is a separate route)

### Financial Year Creation

Add an "Add FY" button visible only to admin users in the FY selector area of the client view. When clicked, opens a simple dialog to input FY label and date range. Creating a new FY auto-generates the 7 predefined sections for every client (in mock data, this is simulated with state).

### Implementation Order

1. Update `types.ts` with new interfaces
2. Rewrite `mock-data.ts` with new data shape and helpers
3. Update `StatusBadge.tsx` for two statuses
4. Update `index.css` and `tailwind.config.ts` for new status colors
5. Create `SectionTree.tsx` component
6. Create `ComplianceItemTable.tsx` component
7. Refactor `Dashboard.tsx` with two-column layout
8. Create `ComplianceItemDetail.tsx` page
9. Update `ActivityLog.tsx` for new data shape
10. Refactor `GlobalFilters.tsx`
11. Update `AppSidebar.tsx` (remove task-specific nav)
12. Update `App.tsx` routes
13. Delete old `ClientTaskTable.tsx` and `TaskDetail.tsx`

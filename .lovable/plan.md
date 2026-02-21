

# Enable Lovable Cloud and Implement Backend

## Summary

Enable Lovable Cloud (Supabase) to replace all mock data with a real PostgreSQL database, file storage, and authentication. The app will gain persistent data, real user accounts, and firm-scoped multi-tenancy.

---

## Phase 1: Enable Cloud and Create Database Schema

### Enable Lovable Cloud
- Activate Lovable Cloud on the project to provision a Supabase instance with PostgreSQL, Auth, and Storage.

### Database Tables (via migrations)

**1. Firms table**
- `id` (uuid, primary key)
- `name` (text)
- `created_at` (timestamptz)

**2. Profiles table**
- `id` (uuid, primary key, references auth.users)
- `firm_id` (uuid, references firms)
- `full_name` (text)
- `email` (text)
- `created_at` (timestamptz)

**3. User Roles table** (separate from profiles for security)
- `id` (uuid, primary key)
- `user_id` (uuid, references auth.users, unique with role)
- `role` (app_role enum: admin, staff)

**4. Clients table**
- `id` (uuid, primary key)
- `firm_id` (uuid, references firms)
- `name` (text)
- `pan` (text)
- `type` (text -- Individual, Company, LLP, etc.)
- `created_at` (timestamptz)

**5. Financial Years table**
- `id` (uuid, primary key)
- `firm_id` (uuid, references firms)
- `label` (text, e.g. "FY 2024-25")
- `start_date` (date)
- `end_date` (date)
- `created_at` (timestamptz)

**6. Sections table**
- `id` (uuid, primary key)
- `client_id` (uuid, references clients)
- `financial_year_id` (uuid, references financial_years)
- `name` (text -- GST, Income Tax, TDS, ROC, Audit, Notices, Other)

**7. Compliance Items table**
- `id` (uuid, primary key)
- `section_id` (uuid, references sections)
- `title` (text)
- `status` (text, default 'Completed' -- only Completed or Reviewed)
- `prepared_by` (uuid, nullable, references auth.users)
- `prepared_at` (timestamptz, nullable)
- `reviewed_by` (uuid, nullable, references auth.users)
- `reviewed_at` (timestamptz, nullable)
- `created_at` (timestamptz)

**8. Documents table**
- `id` (uuid, primary key)
- `compliance_item_id` (uuid, references compliance_items)
- `file_name` (text)
- `file_url` (text)
- `uploaded_by` (uuid, references auth.users)
- `uploaded_at` (timestamptz)
- `size` (text)

**9. Activity Logs table**
- `id` (uuid, primary key)
- `compliance_item_id` (uuid, references compliance_items)
- `action_type` (text)
- `metadata` (jsonb)
- `performed_by` (uuid, references auth.users)
- `created_at` (timestamptz)

---

## Phase 2: Security (RLS Policies and Helper Functions)

### Helper Functions (security definer)

- `get_user_firm_id(uid uuid)` -- returns the firm_id for a given auth user
- `has_role(uid uuid, role app_role)` -- checks if user has a specific role

### RLS Policies (all tables)

Every table gets RLS enabled. All data access is scoped to the user's firm via `get_user_firm_id(auth.uid())`. Key rules:

- **Read**: All firm members can read all data within their firm
- **Insert**: All firm members can insert data within their firm
- **Update**: All firm members can update, but staff cannot revert Reviewed items
- **Delete**: Only admins can delete

### Storage Bucket

- Create a private `compliance-docs` bucket for document uploads
- RLS policies on the bucket scoped to firm membership

---

## Phase 3: Auth Integration

### Replace Mock Auth

- Replace `localStorage`-based auth with Supabase Auth (email + password)
- Update `Login.tsx` to use `supabase.auth.signInWithPassword()` and `supabase.auth.signUp()`
- Update `FirmSetup.tsx` to create a firm record and assign admin role on signup
- Create a trigger to auto-create a profile row when a user signs up
- Add an `AuthProvider` context that wraps the app and provides current user/firm data
- Update `Index.tsx` to check Supabase session instead of localStorage
- Update sidebar sign-out to use `supabase.auth.signOut()`

---

## Phase 4: Replace Mock Data with Real Queries

### Create a Supabase Client

- Generate `src/integrations/supabase/client.ts` and types

### Custom React Hooks (using TanStack Query)

Create hooks in `src/hooks/` to replace all mock data imports:

- `useClients()` -- fetch clients for the user's firm
- `useFinancialYears(firmId)` -- fetch FYs for a firm
- `useSections(clientId, fyId)` -- fetch sections for a client+FY
- `useComplianceItems(sectionId)` -- fetch items for a section
- `useComplianceItem(itemId)` -- fetch single item with documents and activity
- `useDocuments(itemId)` -- fetch documents for an item
- `useActivityLogs(itemId)` -- fetch activity logs for an item
- `useProfiles(firmId)` -- fetch all team members in the firm

### Mutation Hooks

- `useCreateComplianceItem()` -- insert item + activity log
- `useUpdateComplianceItem()` -- update status/prepared_by/reviewed_by + activity log
- `useUploadDocument()` -- upload to storage + insert document record + activity log
- `useCreateFinancialYear()` -- insert FY + auto-generate 7 sections for all clients

### Update Components

| Component | Change |
|---|---|
| `AppSidebar` | Replace `mockClients` with `useClients()` |
| `SectionTree` | Replace `getSectionsForClientFY()` with `useSections()` |
| `ComplianceItemTable` | Replace `getItemsForSection()` with `useComplianceItems()` |
| `ComplianceItemDetail` | Replace mock lookups with `useComplianceItem()` |
| `ActivityLog` | Replace `mockActivityLog` with `useActivityLogs()` |
| `Dashboard` | Wire up real data hooks, add loading states |
| `GlobalFilters` | Replace mock filtering with database queries |
| `FYSelector` | Replace `mockFinancialYears` with `useFinancialYears()` |

---

## Phase 5: Edge Function for Section Auto-Generation

Create an edge function `auto-generate-sections` that:
- Triggers when a new Financial Year is created
- For each client in the firm, creates 7 sections (GST, Income Tax, TDS, ROC, Audit, Notices, Other)
- This can alternatively be done via a database trigger/function

---

## What Does NOT Change

- Visual theme (dark sidebar, light content, calm styling)
- Component structure and layout patterns
- Status badge design (Completed / Reviewed)
- Table-driven UI approach
- Route structure (`/dashboard`, `/item/:itemId`, `/filters`)

---

## Technical Details

### Implementation Order

1. Enable Lovable Cloud
2. Create migration: enum types, all tables, indexes
3. Create migration: helper functions (`get_user_firm_id`, `has_role`)
4. Create migration: RLS policies for all tables
5. Create migration: storage bucket + storage policies
6. Create migration: trigger for auto-creating profile on signup
7. Create Supabase client and generated types
8. Create `AuthProvider` context component
9. Update `Login.tsx` and `FirmSetup.tsx` for real auth
10. Create all data hooks (`useClients`, `useSections`, etc.)
11. Create all mutation hooks
12. Update each component to use real data hooks
13. Remove `src/lib/mock-data.ts` (no longer needed)
14. Seed initial test data if needed

### Database Trigger for Profile Creation

```text
On auth.users INSERT:
  -> Create profiles row with user id, email, full_name from metadata
```

### Section Auto-Generation

```text
On financial_years INSERT:
  -> For each client in firm:
    -> Insert 7 sections (GST, Income Tax, TDS, ROC, Audit, Notices, Other)
```

This can be a PostgreSQL function called via trigger or an edge function.


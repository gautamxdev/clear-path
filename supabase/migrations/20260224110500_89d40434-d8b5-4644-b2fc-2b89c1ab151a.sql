
-- Drop all existing RESTRICTIVE policies and recreate as PERMISSIVE

-- FIRMS
DROP POLICY IF EXISTS "Members can view their firm" ON public.firms;
DROP POLICY IF EXISTS "Authenticated users can create a firm" ON public.firms;
CREATE POLICY "Members can view their firm" ON public.firms FOR SELECT TO authenticated USING (id = get_user_firm_id(auth.uid()));
CREATE POLICY "Authenticated users can create a firm" ON public.firms FOR INSERT TO authenticated WITH CHECK (true);

-- PROFILES
DROP POLICY IF EXISTS "Members can view firm profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Members can view firm profiles" ON public.profiles FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- USER_ROLES
DROP POLICY IF EXISTS "Members can view firm roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Members can view firm roles" ON public.user_roles FOR SELECT TO authenticated USING ((SELECT firm_id FROM profiles WHERE id = user_roles.user_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') AND (SELECT firm_id FROM profiles WHERE id = user_roles.user_id) = get_user_firm_id(auth.uid()));

-- CLIENTS
DROP POLICY IF EXISTS "Members can view firm clients" ON public.clients;
DROP POLICY IF EXISTS "Members can insert firm clients" ON public.clients;
DROP POLICY IF EXISTS "Members can update firm clients" ON public.clients;
DROP POLICY IF EXISTS "Admins can delete firm clients" ON public.clients;
CREATE POLICY "Members can view firm clients" ON public.clients FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert firm clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can update firm clients" ON public.clients FOR UPDATE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete firm clients" ON public.clients FOR DELETE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- FINANCIAL_YEARS
DROP POLICY IF EXISTS "Members can view firm FYs" ON public.financial_years;
DROP POLICY IF EXISTS "Members can insert firm FYs" ON public.financial_years;
DROP POLICY IF EXISTS "Admins can delete firm FYs" ON public.financial_years;
CREATE POLICY "Members can view firm FYs" ON public.financial_years FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert firm FYs" ON public.financial_years FOR INSERT TO authenticated WITH CHECK (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete firm FYs" ON public.financial_years FOR DELETE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- SECTIONS
DROP POLICY IF EXISTS "Members can view sections" ON public.sections;
DROP POLICY IF EXISTS "Members can insert sections" ON public.sections;
DROP POLICY IF EXISTS "Admins can delete sections" ON public.sections;
CREATE POLICY "Members can view sections" ON public.sections FOR SELECT TO authenticated USING ((SELECT firm_id FROM clients WHERE id = sections.client_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert sections" ON public.sections FOR INSERT TO authenticated WITH CHECK ((SELECT firm_id FROM clients WHERE id = sections.client_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete sections" ON public.sections FOR DELETE TO authenticated USING ((SELECT firm_id FROM clients WHERE id = sections.client_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- COMPLIANCE_ITEMS
DROP POLICY IF EXISTS "Members can view items" ON public.compliance_items;
DROP POLICY IF EXISTS "Members can insert items" ON public.compliance_items;
DROP POLICY IF EXISTS "Members can update items" ON public.compliance_items;
DROP POLICY IF EXISTS "Admins can delete items" ON public.compliance_items;
CREATE POLICY "Members can view items" ON public.compliance_items FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert items" ON public.compliance_items FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can update items" ON public.compliance_items FOR UPDATE TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete items" ON public.compliance_items FOR DELETE TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- DOCUMENTS
DROP POLICY IF EXISTS "Members can view documents" ON public.documents;
DROP POLICY IF EXISTS "Members can insert documents" ON public.documents;
DROP POLICY IF EXISTS "Admins can delete documents" ON public.documents;
CREATE POLICY "Members can view documents" ON public.documents FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- ACTIVITY_LOGS
DROP POLICY IF EXISTS "Members can view activity" ON public.activity_logs;
DROP POLICY IF EXISTS "Members can insert activity" ON public.activity_logs;
CREATE POLICY "Members can view activity" ON public.activity_logs FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert activity" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id) = get_user_firm_id(auth.uid()));

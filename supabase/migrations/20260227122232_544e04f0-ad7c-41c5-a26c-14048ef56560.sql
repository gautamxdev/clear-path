
-- Drop ALL existing policies on ALL tables
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN (
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
  ) LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- firms: allow authenticated to insert, members to select
CREATE POLICY "Authenticated can create firm" ON public.firms FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Members can view their firm" ON public.firms FOR SELECT TO authenticated USING (id = get_user_firm_id(auth.uid()));

-- profiles: own profile access + firm members view
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "Members can view firm profiles" ON public.profiles FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());

-- user_roles: own role insert, firm view
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "Members can view firm roles" ON public.user_roles FOR SELECT TO authenticated USING ((SELECT p.firm_id FROM profiles p WHERE p.id = user_roles.user_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin') AND (SELECT p.firm_id FROM profiles p WHERE p.id = user_roles.user_id) = get_user_firm_id(auth.uid()));

-- clients
CREATE POLICY "Members can view firm clients" ON public.clients FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert firm clients" ON public.clients FOR INSERT TO authenticated WITH CHECK (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can update firm clients" ON public.clients FOR UPDATE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete firm clients" ON public.clients FOR DELETE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- financial_years
CREATE POLICY "Members can view firm FYs" ON public.financial_years FOR SELECT TO authenticated USING (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert firm FYs" ON public.financial_years FOR INSERT TO authenticated WITH CHECK (firm_id = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete firm FYs" ON public.financial_years FOR DELETE TO authenticated USING (firm_id = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- sections
CREATE POLICY "Members can view sections" ON public.sections FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM clients c WHERE c.id = sections.client_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert sections" ON public.sections FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM clients c WHERE c.id = sections.client_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete sections" ON public.sections FOR DELETE TO authenticated USING ((SELECT c.firm_id FROM clients c WHERE c.id = sections.client_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- compliance_items
CREATE POLICY "Members can view items" ON public.compliance_items FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert items" ON public.compliance_items FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can update items" ON public.compliance_items FOR UPDATE TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete items" ON public.compliance_items FOR DELETE TO authenticated USING ((SELECT c.firm_id FROM sections s JOIN clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- documents
CREATE POLICY "Members can view documents" ON public.documents FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert documents" ON public.documents FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Admins can delete documents" ON public.documents FOR DELETE TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id) = get_user_firm_id(auth.uid()) AND has_role(auth.uid(), 'admin'));

-- activity_logs
CREATE POLICY "Members can view activity" ON public.activity_logs FOR SELECT TO authenticated USING ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id) = get_user_firm_id(auth.uid()));
CREATE POLICY "Members can insert activity" ON public.activity_logs FOR INSERT TO authenticated WITH CHECK ((SELECT c.firm_id FROM compliance_items ci JOIN sections s ON s.id = ci.section_id JOIN clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id) = get_user_firm_id(auth.uid()));


-- 1. Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

-- 2. Create tables

CREATE TABLE public.firms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  firm_id UUID REFERENCES public.firms(id),
  full_name TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  pan TEXT,
  type TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.financial_years (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  firm_id UUID NOT NULL REFERENCES public.firms(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  financial_year_id UUID NOT NULL REFERENCES public.financial_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL
);

CREATE TABLE public.compliance_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID NOT NULL REFERENCES public.sections(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Completed',
  prepared_by UUID REFERENCES auth.users(id),
  prepared_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_item_id UUID NOT NULL REFERENCES public.compliance_items(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  size TEXT
);

CREATE TABLE public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  compliance_item_id UUID NOT NULL REFERENCES public.compliance_items(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  metadata JSONB,
  performed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Indexes
CREATE INDEX idx_profiles_firm_id ON public.profiles(firm_id);
CREATE INDEX idx_clients_firm_id ON public.clients(firm_id);
CREATE INDEX idx_financial_years_firm_id ON public.financial_years(firm_id);
CREATE INDEX idx_sections_client_id ON public.sections(client_id);
CREATE INDEX idx_sections_fy_id ON public.sections(financial_year_id);
CREATE INDEX idx_compliance_items_section_id ON public.compliance_items(section_id);
CREATE INDEX idx_documents_item_id ON public.documents(compliance_item_id);
CREATE INDEX idx_activity_logs_item_id ON public.activity_logs(compliance_item_id);

-- 4. Security definer helper functions

CREATE OR REPLACE FUNCTION public.get_user_firm_id(_uid UUID)
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT firm_id FROM public.profiles WHERE id = _uid
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- 5. Enable RLS on all tables
ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- Firms: members can read their own firm
CREATE POLICY "Members can view their firm" ON public.firms
  FOR SELECT TO authenticated
  USING (id = public.get_user_firm_id(auth.uid()));

-- Profiles: firm members can read profiles in their firm
CREATE POLICY "Members can view firm profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

-- User roles: firm members can read roles
CREATE POLICY "Members can view firm roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (
    (SELECT firm_id FROM public.profiles WHERE id = user_roles.user_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Users can insert own role" ON public.user_roles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can delete roles" ON public.user_roles
  FOR DELETE TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND (SELECT firm_id FROM public.profiles WHERE id = user_roles.user_id)
        = public.get_user_firm_id(auth.uid())
  );

-- Clients
CREATE POLICY "Members can view firm clients" ON public.clients
  FOR SELECT TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Members can insert firm clients" ON public.clients
  FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Members can update firm clients" ON public.clients
  FOR UPDATE TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Admins can delete firm clients" ON public.clients
  FOR DELETE TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- Financial Years
CREATE POLICY "Members can view firm FYs" ON public.financial_years
  FOR SELECT TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Members can insert firm FYs" ON public.financial_years
  FOR INSERT TO authenticated
  WITH CHECK (firm_id = public.get_user_firm_id(auth.uid()));

CREATE POLICY "Admins can delete firm FYs" ON public.financial_years
  FOR DELETE TO authenticated
  USING (firm_id = public.get_user_firm_id(auth.uid()) AND public.has_role(auth.uid(), 'admin'));

-- Sections: access via client's firm_id
CREATE POLICY "Members can view sections" ON public.sections
  FOR SELECT TO authenticated
  USING (
    (SELECT firm_id FROM public.clients WHERE id = sections.client_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Members can insert sections" ON public.sections
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT firm_id FROM public.clients WHERE id = sections.client_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Admins can delete sections" ON public.sections
  FOR DELETE TO authenticated
  USING (
    (SELECT firm_id FROM public.clients WHERE id = sections.client_id)
    = public.get_user_firm_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- Compliance Items: access via section -> client -> firm
CREATE POLICY "Members can view items" ON public.compliance_items
  FOR SELECT TO authenticated
  USING (
    (SELECT c.firm_id FROM public.sections s JOIN public.clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Members can insert items" ON public.compliance_items
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT c.firm_id FROM public.sections s JOIN public.clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Members can update items" ON public.compliance_items
  FOR UPDATE TO authenticated
  USING (
    (SELECT c.firm_id FROM public.sections s JOIN public.clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Admins can delete items" ON public.compliance_items
  FOR DELETE TO authenticated
  USING (
    (SELECT c.firm_id FROM public.sections s JOIN public.clients c ON c.id = s.client_id WHERE s.id = compliance_items.section_id)
    = public.get_user_firm_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- Documents
CREATE POLICY "Members can view documents" ON public.documents
  FOR SELECT TO authenticated
  USING (
    (SELECT c.firm_id FROM public.compliance_items ci JOIN public.sections s ON s.id = ci.section_id JOIN public.clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Members can insert documents" ON public.documents
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT c.firm_id FROM public.compliance_items ci JOIN public.sections s ON s.id = ci.section_id JOIN public.clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Admins can delete documents" ON public.documents
  FOR DELETE TO authenticated
  USING (
    (SELECT c.firm_id FROM public.compliance_items ci JOIN public.sections s ON s.id = ci.section_id JOIN public.clients c ON c.id = s.client_id WHERE ci.id = documents.compliance_item_id)
    = public.get_user_firm_id(auth.uid())
    AND public.has_role(auth.uid(), 'admin')
  );

-- Activity Logs
CREATE POLICY "Members can view activity" ON public.activity_logs
  FOR SELECT TO authenticated
  USING (
    (SELECT c.firm_id FROM public.compliance_items ci JOIN public.sections s ON s.id = ci.section_id JOIN public.clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id)
    = public.get_user_firm_id(auth.uid())
  );

CREATE POLICY "Members can insert activity" ON public.activity_logs
  FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT c.firm_id FROM public.compliance_items ci JOIN public.sections s ON s.id = ci.section_id JOIN public.clients c ON c.id = s.client_id WHERE ci.id = activity_logs.compliance_item_id)
    = public.get_user_firm_id(auth.uid())
  );

-- 7. Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('compliance-docs', 'compliance-docs', false);

CREATE POLICY "Members can view docs" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'compliance-docs' AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.firms WHERE id = public.get_user_firm_id(auth.uid())
  ));

CREATE POLICY "Members can upload docs" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'compliance-docs' AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.firms WHERE id = public.get_user_firm_id(auth.uid())
  ));

CREATE POLICY "Admins can delete docs" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'compliance-docs' AND public.has_role(auth.uid(), 'admin') AND (storage.foldername(name))[1] IN (
    SELECT id::text FROM public.firms WHERE id = public.get_user_firm_id(auth.uid())
  ));

-- 8. Trigger to auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 9. Function to auto-generate sections when FY is created
CREATE OR REPLACE FUNCTION public.auto_generate_sections()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _client RECORD;
  _section_names TEXT[] := ARRAY['GST', 'Income Tax', 'TDS', 'ROC', 'Audit', 'Notices', 'Other'];
  _section_name TEXT;
BEGIN
  FOR _client IN SELECT id FROM public.clients WHERE firm_id = NEW.firm_id LOOP
    FOREACH _section_name IN ARRAY _section_names LOOP
      INSERT INTO public.sections (client_id, financial_year_id, name)
      VALUES (_client.id, NEW.id, _section_name);
    END LOOP;
  END LOOP;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_financial_year_created
  AFTER INSERT ON public.financial_years
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_sections();

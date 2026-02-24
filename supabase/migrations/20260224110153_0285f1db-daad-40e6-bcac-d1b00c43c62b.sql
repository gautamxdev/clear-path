
-- Allow users to always read their own profile (needed before firm assignment)
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

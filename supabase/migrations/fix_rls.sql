-- 1. Enable RLS on profiles (usually already on, but good to ensure)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Allow users to read their own profile (users need to read their role!)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- 3. Allow users to update their own profile (name, phone, etc)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);


-- 4. Allow ADMINS to do EVERYTHING (Read/Write/Delete ALL profiles)
-- Note: Replace 'admin' with actual role string if different
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;
CREATE POLICY "Admins can do everything" 
ON public.profiles 
TO authenticated
USING (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'admin'
);

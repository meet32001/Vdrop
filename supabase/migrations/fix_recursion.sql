-- 1. Create a secure function to check if the current user is an admin
-- This function runs with SECURITY DEFINER, meaning it bypasses RLS to check the role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the buggy recursive policy
DROP POLICY IF EXISTS "Admins can do everything" ON public.profiles;

-- 3. Create the new policy using the secure function
-- Because the function is SECURITY DEFINER, it doesn't trigger the policy recursively
CREATE POLICY "Admins can do everything" 
ON public.profiles 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 4. Ensure standard user policies are still there (optional, but good to be safe)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

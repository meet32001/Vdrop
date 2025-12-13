-- SECURITY PATCH: Prevent users from escalating their own privileges
-- Even if RLS allows 'UPDATE', this trigger ensures 'role' column is immutable for normal users.

CREATE OR REPLACE FUNCTION public.protect_role_column() 
RETURNS TRIGGER AS $$
BEGIN
  -- If the role is being changed...
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- ...AND the user is NOT a service_role (Super Admin)...
    -- (auth.uid() checks who is signed in. The Edge Function uses service_role which bypasses this, usually)
    -- Actually, simpler: Use 'auth.jwt()->role' check or just block standard updates.
    
    -- We allow updates ONLY if the executing context has the 'service_role' (e.g. Edge Function or Dashboard)
    -- OR if the user is ALREADY an admin trying to update someone.
    
    IF (auth.jwt() ->> 'role') != 'service_role' AND (auth.jwt() ->> 'role') != 'supabase_admin' THEN
        -- Check if current user is an admin via metadata (secure check)
        IF (auth.jwt() -> 'app_metadata' ->> 'role') != 'admin' THEN
           RAISE EXCEPTION 'You are not authorized to change user roles.';
        END IF;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the profiles table
DROP TRIGGER IF EXISTS protect_profile_role_change ON public.profiles;
CREATE TRIGGER protect_profile_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.protect_role_column();

-- 1. Create a function to validly sync the profile role to user metadata
CREATE OR REPLACE FUNCTION public.handle_role_update() 
RETURNS TRIGGER AS $$
BEGIN
  -- Update the auth.users table using the role from the profiles table
  UPDATE auth.users
  SET raw_app_meta_data = 
    COALESCE(raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object('role', NEW.role)
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create the Trigger
DROP TRIGGER IF EXISTS on_profile_role_update ON public.profiles;
CREATE TRIGGER on_profile_role_update
  AFTER UPDATE OF role OR INSERT ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_role_update();

-- 3. ONE-TIME FIX: Sync all existing users right now
-- This ensures you (and others) get the metadata immediately without needing an edit
DO $$
DECLARE
  rec RECORD;
BEGIN
  FOR rec IN SELECT user_id, role FROM public.profiles
  LOOP
    UPDATE auth.users
    SET raw_app_meta_data = 
      COALESCE(raw_app_meta_data, '{}'::jsonb) || 
      jsonb_build_object('role', rec.role)
    WHERE id = rec.user_id;
  END LOOP;
END;
$$;

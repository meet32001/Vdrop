-- Create a function to check if an email exists in the auth.users table
-- This function is security definer to allow access to auth.users
create or replace function check_email_exists(email_to_check text)
returns boolean
security definer
language plpgsql
as $$
begin
  return exists (
    select 1 from auth.users
    where email = email_to_check
  );
end;
$$;

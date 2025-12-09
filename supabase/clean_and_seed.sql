-- DANGER: This script deletes all data from the public tables.
-- Run this in the Supabase SQL Editor to reset your database state.

-- 1. Clean up all user-generated data (Cascade handles foreign key dependencies)
truncate table public.pickups cascade;
truncate table public.addresses cascade;
truncate table public.profiles cascade;
truncate table public.cities cascade;

-- 2. Reseed the initial data for the new structure
insert into public.cities (name, state)
values ('London', 'ON');

-- Add city_id column
alter table public.addresses 
add column city_id uuid references public.cities(id);

-- Ensure all existing cities in addresses exist in cities table (safe migration)
insert into public.cities (name, state)
select distinct city, state 
from public.addresses 
where not exists (
  select 1 from public.cities 
  where name = public.addresses.city 
  and state = public.addresses.state
);

-- Populate city_id
update public.addresses
set city_id = public.cities.id
from public.cities
where public.addresses.city = public.cities.name 
and public.addresses.state = public.cities.state;

-- Enforce not null
alter table public.addresses 
alter column city_id set not null;

-- Drop redundant columns
alter table public.addresses 
drop column city,
drop column state;

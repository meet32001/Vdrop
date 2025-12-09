-- Create cities table
create table public.cities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  state text not null,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.cities enable row level security;

-- Allow public read access
create policy "Allow public read access"
  on public.cities for select
  using (true);

-- Seed data
insert into public.cities (name, state)
values ('London', 'ON');

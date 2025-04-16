-- Enable necessary extensions
create extension if not exists "vector" with schema public;
create extension if not exists "postgis" with schema public;

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Heat reports table for community input
create table public.heat_reports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  temperature decimal not null,
  location geometry(Point, 4326) not null,
  description text,
  surface_type text,
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Interventions table for cooling solutions
create table public.interventions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  type text not null,
  effectiveness_rating decimal,
  cost_estimate decimal,
  implementation_time text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Heat map data points
create table public.heat_map_data (
  id uuid default gen_random_uuid() primary key,
  location geometry(Point, 4326) not null,
  temperature decimal not null,
  timestamp timestamptz default now(),
  source text,
  created_at timestamptz default now()
);

-- Create indexes
create index heat_reports_location_idx on public.heat_reports using gist(location);
create index heat_map_data_location_idx on public.heat_map_data using gist(location);
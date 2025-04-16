-- Enable necessary extensions
create extension if not exists "vector" with schema public;
create extension if not exists "postgis" with schema public;

-- Add common validation functions
CREATE OR REPLACE FUNCTION validate_temperature(temp decimal)
RETURNS boolean AS $$
BEGIN
  RETURN temp BETWEEN -50 AND 70;
END;
$$ LANGUAGE plpgsql;

-- Add temperature range check function
CREATE OR REPLACE FUNCTION check_temperature_range()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT validate_temperature(NEW.temperature) THEN
    RAISE EXCEPTION 'Temperature must be between -50°C and 70°C';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for data validation
CREATE TRIGGER validate_heat_report_temperature
  BEFORE INSERT OR UPDATE ON heat_reports
  FOR EACH ROW
  EXECUTE FUNCTION check_temperature_range();

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE land_use_type AS ENUM ('residential', 'commercial', 'industrial', 'park', 'water');

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

-- Add archival tables
CREATE TABLE public.heat_reports_archive (
  LIKE public.heat_reports,
  archived_at timestamptz DEFAULT now(),
  archived_by uuid REFERENCES auth.users(id)
);

-- Add archiving function
CREATE OR REPLACE FUNCTION archive_old_heat_reports()
RETURNS void AS $$
BEGIN
  INSERT INTO heat_reports_archive 
  SELECT *, now(), auth.uid()
  FROM heat_reports
  WHERE created_at < now() - interval '1 year';
  
  DELETE FROM heat_reports
  WHERE created_at < now() - interval '1 year';
END;
$$ LANGUAGE plpgsql;

-- Create indexes
create index heat_reports_location_idx on public.heat_reports using gist(location);
create index heat_map_data_location_idx on public.heat_map_data using gist(location);

-- Add materialized view for analytics
CREATE MATERIALIZED VIEW heat_statistics AS
SELECT 
  date_trunc('day', created_at) as day,
  avg(temperature) as avg_temp,
  min(temperature) as min_temp,
  max(temperature) as max_temp,
  count(*) as measurements,
  surface_type
FROM heat_reports
GROUP BY date_trunc('day', created_at), surface_type;

-- Add refresh function
CREATE OR REPLACE FUNCTION refresh_heat_statistics()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW heat_statistics;
END;
$$ LANGUAGE plpgsql;




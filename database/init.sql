-- Initialize extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Create custom types if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'severity_level') THEN
        CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'land_use_type') THEN
        CREATE TYPE land_use_type AS ENUM ('residential', 'commercial', 'industrial', 'park', 'water');
    END IF;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid references auth.users on delete cascade primary key,
    email text unique,
    full_name text,
    avatar_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create heat reports table
CREATE TABLE IF NOT EXISTS public.heat_reports (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade,
    temperature decimal not null,
    location geometry(Point, 4326) not null,
    description text,
    surface_type text,
    image_url text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    CONSTRAINT valid_temperature CHECK (temperature BETWEEN -50 AND 70)
);

-- Create heat reports archive
CREATE TABLE IF NOT EXISTS public.heat_reports_archive (
    LIKE public.heat_reports,
    archived_at timestamptz DEFAULT now(),
    archived_by uuid REFERENCES auth.users(id)
);

-- Create interventions table
CREATE TABLE IF NOT EXISTS public.interventions (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    description text,
    type text not null,
    effectiveness_rating decimal CHECK (effectiveness_rating BETWEEN 0 AND 100),
    cost_estimate decimal,
    implementation_time text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- Create heat map data table
CREATE TABLE IF NOT EXISTS public.heat_map_data (
    id uuid default gen_random_uuid() primary key,
    location geometry(Point, 4326) not null,
    temperature decimal not null,
    timestamp timestamptz default now(),
    source text,
    created_at timestamptz default now(),
    CONSTRAINT valid_temperature CHECK (temperature BETWEEN -50 AND 70)
);

-- Create spatial indexes
CREATE INDEX IF NOT EXISTS heat_reports_location_idx ON public.heat_reports USING GIST(location);
CREATE INDEX IF NOT EXISTS heat_map_data_location_idx ON public.heat_map_data USING GIST(location);

-- Create materialized view for heat statistics
CREATE MATERIALIZED VIEW IF NOT EXISTS heat_statistics AS
SELECT 
    date_trunc('day', created_at) as day,
    avg(temperature) as avg_temp,
    min(temperature) as min_temp,
    max(temperature) as max_temp,
    count(*) as measurements,
    surface_type
FROM heat_reports
GROUP BY date_trunc('day', created_at), surface_type;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS heat_statistics_day_idx ON heat_statistics(day);
-- Function to update timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Update timestamps triggers
create trigger handle_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.heat_reports
  for each row
  execute procedure public.handle_updated_at();

create trigger handle_updated_at
  before update on public.interventions
  for each row
  execute procedure public.handle_updated_at();

-- Function to create profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
exception
  when others then
    -- Log the error (optional)
    raise notice 'Error creating profile: %', SQLERRM;
    return new;
end;
$$ language plpgsql;

-- Trigger to create profile after signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to get nearby heat reports
create or replace function public.get_nearby_heat_reports(
  lat double precision,
  lng double precision,
  radius_meters double precision
)
returns table (
  id uuid,
  temperature decimal,
  description text,
  surface_type text,
  distance double precision
) as $$
begin
  -- Default to Nagpur coordinates if none provided
  lat := COALESCE(lat, 21.1458);
  lng := COALESCE(lng, 79.0882);
  
  return query
  select
    hr.id,
    hr.temperature,
    hr.description,
    hr.surface_type,
    ST_Distance(
      hr.location,
      ST_SetSRID(ST_MakePoint(lng, lat), 4326)
    ) as distance
  from heat_reports hr
  where ST_DWithin(
    hr.location,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326),
    radius_meters
  )
  order by distance;
end;
$$ language plpgsql;

-- Add Nagpur-specific heat zones
CREATE OR REPLACE FUNCTION get_nagpur_heat_zones()
RETURNS TABLE (
    zone_name text,
    center_lat double precision,
    center_lng double precision,
    zone_type text
) AS $$
BEGIN
    RETURN QUERY
    VALUES
        ('Sitabuldi Market', 21.1456, 79.0849, 'commercial'),
        ('MIDC Industrial Area', 21.1601, 79.0891, 'industrial'),
        ('Dharampeth', 21.1397, 79.0645, 'residential'),
        ('Medical Square', 21.1354, 79.0928, 'commercial'),
        ('Sadar', 21.1534, 79.0797, 'commercial'),
        ('Cotton Market', 21.1426, 79.0935, 'commercial');
END;
$$ LANGUAGE plpgsql;

-- Function to get temperature data within radius
CREATE OR REPLACE FUNCTION get_temperature_in_radius(
    center_lat FLOAT,
    center_lng FLOAT,
    radius_km FLOAT
) RETURNS TABLE (
    id UUID,
    lat FLOAT,
    lng FLOAT,
    temperature FLOAT,
    land_use land_use_type,
    distance FLOAT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.lat,
        t.lng,
        t.temperature,
        t.land_use,
        (
            6371 * acos(
                cos(radians(center_lat)) * cos(radians(t.lat)) *
                cos(radians(t.lng) - radians(center_lng)) +
                sin(radians(center_lat)) * sin(radians(t.lat))
            )
        ) AS distance
    FROM temperature_data t
    WHERE (
        6371 * acos(
            cos(radians(center_lat)) * cos(radians(t.lat)) *
            cos(radians(t.lng) - radians(center_lng)) +
            sin(radians(center_lat)) * sin(radians(t.lat))
        )
    ) <= radius_km
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to identify hotspots
CREATE OR REPLACE FUNCTION identify_hotspots(threshold_temp FLOAT)
RETURNS TABLE (
    lat FLOAT,
    lng FLOAT,
    avg_temperature FLOAT,
    report_count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.lat,
        t.lng,
        AVG(t.temperature) as avg_temperature,
        COUNT(r.id) as report_count
    FROM temperature_data t
    LEFT JOIN reports r ON (
        6371 * acos(
            cos(radians(t.lat)) * cos(radians(r.lat)) *
            cos(radians(r.lng) - radians(t.lng)) +
            sin(radians(t.lat)) * sin(radians(r.lat))
        )
    ) <= 0.5
    WHERE t.temperature >= threshold_temp
    GROUP BY t.lat, t.lng
    HAVING COUNT(r.id) > 0;
END;
$$ LANGUAGE plpgsql;

-- Spatial query function for heat reports
CREATE OR REPLACE FUNCTION get_heat_reports_in_radius(
    center_lat double precision,
    center_lng double precision,
    radius_meters double precision
) RETURNS TABLE (
    id uuid,
    temperature decimal,
    description text,
    surface_type text,
    distance double precision
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        hr.id,
        hr.temperature,
        hr.description,
        hr.surface_type,
        ST_Distance(
            hr.location::geography,
            ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography
        ) as distance
    FROM heat_reports hr
    WHERE ST_DWithin(
        hr.location::geography,
        ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
        radius_meters
    )
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate heat intensity
CREATE OR REPLACE FUNCTION calculate_heat_intensity(
    point geometry(Point, 4326)
) RETURNS decimal AS $$
DECLARE
    avg_temp decimal;
    report_count integer;
BEGIN
    SELECT 
        AVG(temperature),
        COUNT(*)
    INTO 
        avg_temp,
        report_count
    FROM heat_reports
    WHERE ST_DWithin(location::geography, point::geography, 100);
    
    RETURN CASE 
        WHEN report_count = 0 THEN 0
        ELSE avg_temp * (1 + (report_count * 0.1))
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to get intervention recommendations
CREATE OR REPLACE FUNCTION get_intervention_recommendations(
    location_point geometry(Point, 4326),
    max_results integer DEFAULT 3
) RETURNS TABLE (
    intervention_id uuid,
    name text,
    effectiveness_rating decimal,
    heat_intensity decimal
) AS $$
BEGIN
    RETURN QUERY
    WITH heat_calc AS (
        SELECT calculate_heat_intensity(location_point) as intensity
    )
    SELECT 
        i.id,
        i.name,
        i.effectiveness_rating,
        hc.intensity
    FROM 
        interventions i,
        heat_calc hc
    WHERE 
        i.effectiveness_rating >= hc.intensity * 0.5
    ORDER BY 
        i.effectiveness_rating DESC,
        i.cost_estimate ASC
    LIMIT max_results;
END;
$$ LANGUAGE plpgsql;

-- Automatic archiving function
CREATE OR REPLACE FUNCTION auto_archive_heat_reports() RETURNS void AS $$
BEGIN
    INSERT INTO heat_reports_archive 
    SELECT *, now(), auth.uid()
    FROM heat_reports
    WHERE created_at < now() - interval '1 year';
    
    DELETE FROM heat_reports
    WHERE created_at < now() - interval '1 year';
END;
$$ LANGUAGE plpgsql;

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_all_mat_views() RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY heat_statistics;
END;
$$ LANGUAGE plpgsql;


-- Function to get default map location
CREATE OR REPLACE FUNCTION get_default_map_location()
RETURNS TABLE (
    lat double precision,
    lng double precision,
    zoom integer,
    city_name text
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        21.1458 as lat,      -- Nagpur latitude
        79.0882 as lng,      -- Nagpur longitude
        12 as zoom,          -- Default zoom level for city view
        'Nagpur, Maharashtra' as city_name;
END;
$$ LANGUAGE plpgsql;

-- Function to get Nagpur map location and bounds
CREATE OR REPLACE FUNCTION get_nagpur_location()
RETURNS TABLE (
    center_lat double precision,
    center_lng double precision,
    zoom integer,
    city_name text,
    bounds_north double precision,
    bounds_south double precision,
    bounds_east double precision,
    bounds_west double precision
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        21.1458 as center_lat,      -- Nagpur city center latitude
        79.0882 as center_lng,      -- Nagpur city center longitude
        11 as zoom,                 -- Zoom level to show full city
        'Nagpur, Maharashtra' as city_name,
        21.2271 as bounds_north,    -- Northern boundary
        21.0645 as bounds_south,    -- Southern boundary
        79.1802 as bounds_east,     -- Eastern boundary
        78.9962 as bounds_west;     -- Western boundary
END;
$$ LANGUAGE plpgsql;

-- Function to get Nagpur landmarks
CREATE OR REPLACE FUNCTION get_nagpur_landmarks()
RETURNS TABLE (
    name text,
    lat double precision,
    lng double precision,
    type text
) AS $$
BEGIN
    RETURN QUERY
    VALUES
        ('Zero Mile Stone', 21.1498, 79.0825, 'landmark'),
        ('Deekshabhoomi', 21.1427, 79.0611, 'religious'),
        ('Futala Lake', 21.1545, 79.0673, 'water_body'),
        ('Dragon Palace Temple', 21.1814, 79.0479, 'religious'),
        ('Ambazari Lake', 21.1350, 79.0448, 'water_body'),
        ('Sitabuldi Fort', 21.1456, 79.0849, 'historical');
END;
$$ LANGUAGE plpgsql;

-- Function to get initial map view settings
CREATE OR REPLACE FUNCTION get_initial_map_view()
RETURNS TABLE (
    center_lat double precision,
    center_lng double precision,
    zoom integer,
    min_zoom integer,
    max_zoom integer,
    default_bounds json
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        21.1458 as center_lat,      -- Nagpur city center
        79.0882 as center_lng,      -- Nagpur city center
        12 as zoom,                 -- Default zoom
        8 as min_zoom,             -- Minimum zoom level
        18 as max_zoom,            -- Maximum zoom level
        json_build_object(
            'north', 21.2271,
            'south', 21.0645,
            'east', 79.1802,
            'west', 78.9962
        ) as default_bounds;        -- Nagpur city bounds
END;
$$ LANGUAGE plpgsql;

-- Function to validate coordinates are within Nagpur bounds
CREATE OR REPLACE FUNCTION is_within_nagpur_bounds(
    lat double precision,
    lng double precision
) RETURNS boolean AS $$
BEGIN
    RETURN (
        lat BETWEEN 21.0645 AND 21.2271 AND
        lng BETWEEN 78.9962 AND 79.1802
    );
END;
$$ LANGUAGE plpgsql;
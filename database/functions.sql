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
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql;

-- Trigger to create profile after signup
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
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.heat_reports enable row level security;
alter table public.interventions enable row level security;
alter table public.heat_map_data enable row level security;

-- Profiles policies
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Heat reports policies
create policy "Anyone can view heat reports"
  on public.heat_reports for select
  to authenticated
  using (true);

create policy "Users can create heat reports"
  on public.heat_reports for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own heat reports"
  on public.heat_reports for update
  using (auth.uid() = user_id);

create policy "Users can delete their own heat reports"
  on public.heat_reports for delete
  using (auth.uid() = user_id);

-- Interventions policies
create policy "Anyone can view interventions"
  on public.interventions for select
  to authenticated
  using (true);

-- Heat map data policies
create policy "Anyone can view heat map data"
  on public.heat_map_data for select
  to authenticated
  using (true);
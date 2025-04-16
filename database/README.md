# Database Schema

## Tables
- `profiles`: User profiles extending Supabase auth
- `heat_reports`: Community-submitted heat measurements
- `interventions`: Cooling solution interventions
- `heat_map_data`: Heat map measurement points

## Setup Instructions
1. Create a new Supabase project
2. Run the files in this order:
   - types.sql
   - schema.sql
   - functions.sql
   - policies.sql

## Security
- Row Level Security (RLS) is enabled on all tables
- Authentication is required for most operations
- Users can only modify their own data

## Spatial Features
- Uses PostGIS for location data
- Includes functions for proximity searches
- Optimized spatial indexes

## Maintenance
- Automatic timestamp updates
- Automatic profile creation on signup
- Cascading deletes for related data
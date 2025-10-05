#!/bin/bash

# This script applies the database migrations to Supabase
# Make sure you have the Supabase CLI installed and configured

echo "Applying database migrations..."

# Apply the recordings table migration
supabase migration up

echo "Migrations applied successfully!"
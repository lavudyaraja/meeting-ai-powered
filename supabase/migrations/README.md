# Database Migrations

This directory contains the database migration scripts for the Optima Assist application.

## Migration Files

1. `20251005190000_create_recordings_table.sql` - Creates the recordings table for storing meeting recordings metadata

## Applying Migrations

To apply these migrations to your Supabase database, run:

```bash
supabase migration up
```

Or use the provided script:

```bash
./apply_migrations.sh
```

## Table Structure

### recordings

The recordings table stores metadata about meeting recordings:

- `id` (UUID) - Primary key
- `meeting_id` (UUID) - Foreign key to meetings table
- `title` (TEXT) - Recording title
- `description` (TEXT) - Recording description
- `file_url` (TEXT) - URL to the recording file
- `transcript_url` (TEXT) - URL to the transcript file
- `duration` (INTEGER) - Duration in seconds
- `file_size` (BIGINT) - File size in bytes
- `status` (TEXT) - Processing status (processing, ready, failed)
- `created_at` (TIMESTAMP) - Creation timestamp
- `updated_at` (TIMESTAMP) - Last update timestamp
- `created_by` (UUID) - Foreign key to users table
- `participants_count` (INTEGER) - Number of participants
- `views_count` (INTEGER) - Number of views
- `is_favorite` (BOOLEAN) - Whether the recording is marked as favorite

## Real-time Features

The recordings functionality includes real-time updates using Supabase's real-time capabilities:

- New recordings are automatically added to the UI
- Updates to recordings (favorites, view counts, etc.) are reflected in real-time
- Deleted recordings are immediately removed from the UI
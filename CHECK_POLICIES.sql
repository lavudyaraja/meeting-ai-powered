-- Run this SQL in your Supabase SQL editor to check current policies on meetings table

SELECT 
  polname AS policy_name,
  polcmd AS command_type,
  polqual AS using_clause,
  polwithcheck AS with_check_clause
FROM pg_policy
WHERE polrelid = 'public.meetings'::regclass;
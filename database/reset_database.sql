-- ============================================================================
-- FitSync Database Teardown & Reset Script: reset_database.sql
-- Environment: Development & Testing ONLY
-- Description: Drops all FitSync tables, triggers, and functions in reverse dependency order.
-- WARNING: This will permanently delete all gym data in the public schema!
-- ============================================================================

BEGIN;

-- 1. Drop Tables (CASCADE handles all foreign keys cleanly)
DROP TABLE IF EXISTS progress_records CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS training_sessions CASCADE;
DROP TABLE IF EXISTS workout_logs CASCADE;
DROP TABLE IF EXISTS exercises CASCADE;
DROP TABLE IF EXISTS workout_plans CASCADE;
DROP TABLE IF EXISTS memberships CASCADE;
DROP TABLE IF EXISTS membership_plans CASCADE;
DROP TABLE IF EXISTS members CASCADE;
DROP TABLE IF EXISTS trainers CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 2. Drop Helper Functions and Triggers
DROP FUNCTION IF EXISTS public.prevent_unauthorized_role_escalation() CASCADE;
DROP FUNCTION IF EXISTS public.current_user_role() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;
DROP FUNCTION IF EXISTS public.current_member_id() CASCADE;
DROP FUNCTION IF EXISTS public.current_trainer_id() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at_timestamp() CASCADE;

COMMIT;

-- ============================================================================
-- Reset Complete. To recreate tables, run:
-- 1. database/supabase_complete_setup.sql
-- OR
-- 2. Flyway migrations V1 through V5 via Spring Boot
-- ============================================================================

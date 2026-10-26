-- ============================================================================
-- FitSync Database Verification Script: verification_queries.sql
-- Description: Run these diagnostic queries in Supabase SQL Editor or psql
--              to verify tables, foreign keys, indexes, constraints, and data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Verify All 12 FitSync Tables Exist in public schema
-- Expected: 12 tables
-- ----------------------------------------------------------------------------
SELECT 
    table_name,
    (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) AS column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_type = 'BASE TABLE'
  AND table_name IN (
    'users', 'trainers', 'members', 'membership_plans', 
    'memberships', 'workout_plans', 'exercises', 'workout_logs', 
    'training_sessions', 'attendance', 'payments', 'progress_records'
  )
ORDER BY table_name;


-- ----------------------------------------------------------------------------
-- 2. Verify Foreign Key Constraints Across All Tables
-- ----------------------------------------------------------------------------
SELECT
    tc.table_name AS from_table,
    kcu.column_name AS from_column,
    ccu.table_name AS target_table,
    ccu.column_name AS target_column,
    rc.delete_rule
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
    ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;


-- ----------------------------------------------------------------------------
-- 3. Verify Indexes Created
-- ----------------------------------------------------------------------------
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'trainers', 'members', 'membership_plans', 
    'memberships', 'workout_plans', 'exercises', 'workout_logs', 
    'training_sessions', 'attendance', 'payments', 'progress_records'
  )
ORDER BY tablename, indexname;


-- ----------------------------------------------------------------------------
-- 4. Verify Row Level Security (RLS) Status
-- Expected: rowsecurity = true for all 12 tables
-- ----------------------------------------------------------------------------
SELECT
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'users', 'trainers', 'members', 'membership_plans', 
    'memberships', 'workout_plans', 'exercises', 'workout_logs', 
    'training_sessions', 'attendance', 'payments', 'progress_records'
  )
ORDER BY tablename;


-- ----------------------------------------------------------------------------
-- 5. Verify Active RLS Policies
-- ----------------------------------------------------------------------------
SELECT
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;


-- ----------------------------------------------------------------------------
-- 6. Inspect Sample Record Counts (After running seed_data.sql)
-- ----------------------------------------------------------------------------
SELECT 'users' AS table_name, count(*) AS total_rows FROM users
UNION ALL SELECT 'trainers', count(*) FROM trainers
UNION ALL SELECT 'members', count(*) FROM members
UNION ALL SELECT 'membership_plans', count(*) FROM membership_plans
UNION ALL SELECT 'memberships', count(*) FROM memberships
UNION ALL SELECT 'workout_plans', count(*) FROM workout_plans
UNION ALL SELECT 'exercises', count(*) FROM exercises
UNION ALL SELECT 'workout_logs', count(*) FROM workout_logs
UNION ALL SELECT 'training_sessions', count(*) FROM training_sessions
UNION ALL SELECT 'attendance', count(*) FROM attendance
UNION ALL SELECT 'payments', count(*) FROM payments
UNION ALL SELECT 'progress_records', count(*) FROM progress_records;


-- ----------------------------------------------------------------------------
-- 7. Business Query Verification: Active Members with Assigned Coach & Plan
-- ----------------------------------------------------------------------------
SELECT
    m.id AS member_id,
    u.full_name AS member_name,
    u.email AS member_email,
    m.current_weight_kg,
    m.target_weight_kg,
    tu.full_name AS coach_name,
    t.specialization AS coach_specialty,
    mp.name AS active_plan,
    ms.end_date AS plan_expiry,
    ms.status AS membership_status
FROM members m
JOIN users u ON u.id = m.user_id
LEFT JOIN trainers t ON t.id = m.assigned_trainer_id
LEFT JOIN users tu ON tu.id = t.user_id
LEFT JOIN memberships ms ON ms.member_id = m.id AND ms.status = 'ACTIVE'
LEFT JOIN membership_plans mp ON mp.id = ms.plan_id
ORDER BY u.full_name;


-- ----------------------------------------------------------------------------
-- 8. Business Query Verification: Workout Plan with Prescribed Movements
-- ----------------------------------------------------------------------------
SELECT
    wp.name AS workout_routine,
    wp.target_level,
    wp.duration_weeks,
    tu.full_name AS authored_by_coach,
    e.name AS exercise_movement,
    e.muscle_group,
    e.sets,
    e.repetitions,
    e.target_weight_kg,
    e.rest_seconds
FROM workout_plans wp
LEFT JOIN trainers t ON t.id = wp.trainer_id
LEFT JOIN users tu ON tu.id = t.user_id
JOIN exercises e ON e.workout_plan_id = wp.id
ORDER BY wp.name, e.name;


-- ----------------------------------------------------------------------------
-- 9. Business Query Verification: Total Verified Revenue
-- (Rule: Only count COMPLETED payments)
-- ----------------------------------------------------------------------------
SELECT
    status,
    count(*) AS transaction_count,
    SUM(amount) AS total_amount,
    currency
FROM payments
GROUP BY status, currency
ORDER BY status;

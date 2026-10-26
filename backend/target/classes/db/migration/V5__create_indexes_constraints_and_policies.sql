-- ============================================================================
-- FitSync Database Migration: V5__create_indexes_constraints_and_policies.sql
-- Database: Supabase PostgreSQL
-- Description: Performance Indexes, Role Escalation Protection, and Row Level Security (RLS)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Performance Indexes on Foreign Keys and Frequently Filtered Columns
-- ----------------------------------------------------------------------------

-- users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id) WHERE auth_user_id IS NOT NULL;

-- trainers indexes
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);
CREATE INDEX IF NOT EXISTS idx_trainers_specialization ON trainers(specialization);

-- members indexes
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_assigned_trainer_id ON members(assigned_trainer_id);

-- membership_plans indexes
CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans(active);

-- memberships indexes
CREATE INDEX IF NOT EXISTS idx_memberships_member_id ON memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_memberships_plan_id ON memberships(plan_id);
CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships(end_date);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);

-- workout_plans indexes
CREATE INDEX IF NOT EXISTS idx_workout_plans_member_id ON workout_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_trainer_id ON workout_plans(trainer_id);

-- exercises indexes
CREATE INDEX IF NOT EXISTS idx_exercises_workout_plan_id ON exercises(workout_plan_id);

-- workout_logs indexes
CREATE INDEX IF NOT EXISTS idx_workout_logs_member_id ON workout_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise_id ON workout_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_completed_at ON workout_logs(completed_at DESC);

-- training_sessions indexes
CREATE INDEX IF NOT EXISTS idx_training_sessions_member_id ON training_sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer_id ON training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_scheduled_at ON training_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);

-- attendance indexes
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- progress_records indexes
CREATE INDEX IF NOT EXISTS idx_progress_records_member_id ON progress_records(member_id);
CREATE INDEX IF NOT EXISTS idx_progress_records_date ON progress_records(recorded_at DESC);


-- ----------------------------------------------------------------------------
-- 2. Role Escalation Prevention Trigger
-- Prevents non-admin users from changing their own role to 'ADMIN'.
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_unauthorized_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    -- If role is being changed to ADMIN
    IF NEW.role = 'ADMIN' AND OLD.role <> 'ADMIN' THEN
        -- Verify that the caller is an active ADMIN or a DB superuser/service role
        IF CURRENT_USER NOT IN ('postgres', 'service_role', 'supabase_admin') THEN
            IF NOT EXISTS (
                SELECT 1 FROM users
                WHERE auth_user_id = auth.uid() AND role = 'ADMIN'
            ) THEN
                RAISE EXCEPTION 'Security Violation: Unauthorized attempt to escalate role to ADMIN.';
            END IF;
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_prevent_role_escalation ON users;
CREATE TRIGGER trg_prevent_role_escalation
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION prevent_unauthorized_role_escalation();


-- ----------------------------------------------------------------------------
-- 3. Security Helper Functions for Supabase Row Level Security (RLS)
-- ----------------------------------------------------------------------------

-- Helper: Get current user role from auth.uid()
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Check if current authenticated user is an ADMIN
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE auth_user_id = auth.uid() AND role = 'ADMIN'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Get member ID for current authenticated user
CREATE OR REPLACE FUNCTION public.current_member_id()
RETURNS UUID AS $$
    SELECT m.id FROM public.members m
    JOIN public.users u ON u.id = m.user_id
    WHERE u.auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper: Get trainer ID for current authenticated user
CREATE OR REPLACE FUNCTION public.current_trainer_id()
RETURNS UUID AS $$
    SELECT t.id FROM public.trainers t
    JOIN public.users u ON u.id = t.user_id
    WHERE u.auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ----------------------------------------------------------------------------
-- 4. Enable Row Level Security (RLS) on all tables
-- ----------------------------------------------------------------------------
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_records ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- 5. RLS Policies
-- Note: PostgreSQL superuser, 'postgres', and 'service_role' bypass RLS automatically.
-- These policies safeguard client-side Supabase connections and REST access.
-- ----------------------------------------------------------------------------

-- --- USERS POLICIES ---
DROP POLICY IF EXISTS "Admins full access to users" ON users;
CREATE POLICY "Admins full access to users" ON users
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = auth_user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = auth_user_id);

-- --- TRAINERS POLICIES ---
DROP POLICY IF EXISTS "Anyone can view active trainers" ON trainers;
CREATE POLICY "Anyone can view active trainers" ON trainers
    FOR SELECT USING (status = 'ACTIVE' OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access to trainers" ON trainers;
CREATE POLICY "Admins full access to trainers" ON trainers
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Trainers can update own profile" ON trainers;
CREATE POLICY "Trainers can update own profile" ON trainers
    FOR UPDATE USING (id = public.current_trainer_id());

-- --- MEMBERS POLICIES ---
DROP POLICY IF EXISTS "Admins full access to members" ON members;
CREATE POLICY "Admins full access to members" ON members
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Members can view own profile" ON members;
CREATE POLICY "Members can view own profile" ON members
    FOR SELECT USING (id = public.current_member_id());

DROP POLICY IF EXISTS "Trainers can view assigned members" ON members;
CREATE POLICY "Trainers can view assigned members" ON members
    FOR SELECT USING (assigned_trainer_id = public.current_trainer_id());

-- --- MEMBERSHIP PLANS POLICIES ---
DROP POLICY IF EXISTS "Anyone can view active plans" ON membership_plans;
CREATE POLICY "Anyone can view active plans" ON membership_plans
    FOR SELECT USING (active = TRUE OR public.is_admin());

DROP POLICY IF EXISTS "Admins full access to membership plans" ON membership_plans;
CREATE POLICY "Admins full access to membership plans" ON membership_plans
    FOR ALL USING (public.is_admin());

-- --- MEMBERSHIPS POLICIES ---
DROP POLICY IF EXISTS "Admins full access to memberships" ON memberships;
CREATE POLICY "Admins full access to memberships" ON memberships
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Members can view own memberships" ON memberships;
CREATE POLICY "Members can view own memberships" ON memberships
    FOR SELECT USING (member_id = public.current_member_id());

-- --- WORKOUT PLANS & EXERCISES POLICIES ---
DROP POLICY IF EXISTS "Admins full access to workout plans" ON workout_plans;
CREATE POLICY "Admins full access to workout plans" ON workout_plans
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Trainers can manage own workout plans" ON workout_plans;
CREATE POLICY "Trainers can manage own workout plans" ON workout_plans
    FOR ALL USING (trainer_id = public.current_trainer_id());

DROP POLICY IF EXISTS "Members can view assigned workout plans" ON workout_plans;
CREATE POLICY "Members can view assigned workout plans" ON workout_plans
    FOR SELECT USING (member_id = public.current_member_id());

DROP POLICY IF EXISTS "Anyone with access to plan can view exercises" ON exercises;
CREATE POLICY "Anyone with access to plan can view exercises" ON exercises
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workout_plans wp
            WHERE wp.id = exercises.workout_plan_id
            AND (wp.member_id = public.current_member_id() OR wp.trainer_id = public.current_trainer_id() OR public.is_admin())
        )
    );

-- --- WORKOUT LOGS POLICIES ---
DROP POLICY IF EXISTS "Members can manage own workout logs" ON workout_logs;
CREATE POLICY "Members can manage own workout logs" ON workout_logs
    FOR ALL USING (member_id = public.current_member_id());

DROP POLICY IF EXISTS "Trainers can view assigned members workout logs" ON workout_logs;
CREATE POLICY "Trainers can view assigned members workout logs" ON workout_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = workout_logs.member_id AND m.assigned_trainer_id = public.current_trainer_id()
        )
    );

DROP POLICY IF EXISTS "Admins full access to workout logs" ON workout_logs;
CREATE POLICY "Admins full access to workout logs" ON workout_logs
    FOR ALL USING (public.is_admin());

-- --- TRAINING SESSIONS POLICIES ---
DROP POLICY IF EXISTS "Admins full access to training sessions" ON training_sessions;
CREATE POLICY "Admins full access to training sessions" ON training_sessions
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Trainers can manage own sessions" ON training_sessions;
CREATE POLICY "Trainers can manage own sessions" ON training_sessions
    FOR ALL USING (trainer_id = public.current_trainer_id());

DROP POLICY IF EXISTS "Members can view own sessions" ON training_sessions;
CREATE POLICY "Members can view own sessions" ON training_sessions
    FOR SELECT USING (member_id = public.current_member_id());

-- --- ATTENDANCE POLICIES ---
DROP POLICY IF EXISTS "Admins full access to attendance" ON attendance;
CREATE POLICY "Admins full access to attendance" ON attendance
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Trainers can view attendance" ON attendance;
CREATE POLICY "Trainers can view attendance" ON attendance
    FOR SELECT USING (public.current_trainer_id() IS NOT NULL);

DROP POLICY IF EXISTS "Members can view own attendance" ON attendance;
CREATE POLICY "Members can view own attendance" ON attendance
    FOR SELECT USING (member_id = public.current_member_id());

-- --- PAYMENTS POLICIES ---
DROP POLICY IF EXISTS "Admins full access to payments" ON payments;
CREATE POLICY "Admins full access to payments" ON payments
    FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "Members can view own payments" ON payments;
CREATE POLICY "Members can view own payments" ON payments
    FOR SELECT USING (member_id = public.current_member_id());

-- --- PROGRESS RECORDS POLICIES ---
DROP POLICY IF EXISTS "Members can manage own progress" ON progress_records;
CREATE POLICY "Members can manage own progress" ON progress_records
    FOR ALL USING (member_id = public.current_member_id());

DROP POLICY IF EXISTS "Trainers can view assigned members progress" ON progress_records;
CREATE POLICY "Trainers can view assigned members progress" ON progress_records
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM members m
            WHERE m.id = progress_records.member_id AND m.assigned_trainer_id = public.current_trainer_id()
        )
    );

DROP POLICY IF EXISTS "Admins full access to progress records" ON progress_records;
CREATE POLICY "Admins full access to progress records" ON progress_records
    FOR ALL USING (public.is_admin());

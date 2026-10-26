-- ============================================================================
-- FitSync Complete Supabase PostgreSQL Database Setup
-- Description: All-in-one executable script for Supabase SQL Editor.
--              Includes Schema, Constraints, Triggers, Indexes, RLS Policies,
--              and Development Seed Data.
-- ============================================================================

-- 0. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Helper Function: Automatic updated_at timestamp trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ----------------------------------------------------------------------------
-- 2. Schema DDL: Core Tables
-- ----------------------------------------------------------------------------

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    password_hash VARCHAR(255),
    auth_user_id UUID,
    avatar_url VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_auth_user_id UNIQUE (auth_user_id),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'TRAINER', 'MEMBER')),
    CONSTRAINT chk_users_email_non_empty CHECK (length(trim(email)) > 0),
    CONSTRAINT chk_users_full_name_non_empty CHECK (length(trim(full_name)) > 0)
);

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- TRAINERS TABLE
CREATE TABLE IF NOT EXISTS trainers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    biography TEXT,
    availability VARCHAR(100),
    rating NUMERIC(3, 2) DEFAULT 5.00,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_trainers_user_id UNIQUE (user_id),
    CONSTRAINT fk_trainers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_trainers_experience CHECK (experience_years >= 0),
    CONSTRAINT chk_trainers_rating CHECK (rating >= 0.00 AND rating <= 5.00),
    CONSTRAINT chk_trainers_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

-- MEMBERS TABLE
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    assigned_trainer_id UUID,
    height_cm INT,
    current_weight_kg NUMERIC(5, 2),
    target_weight_kg NUMERIC(5, 2),
    emergency_contact VARCHAR(150),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_members_user_id UNIQUE (user_id),
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_trainer FOREIGN KEY (assigned_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    CONSTRAINT chk_members_height CHECK (height_cm IS NULL OR (height_cm >= 50 AND height_cm <= 300)),
    CONSTRAINT chk_members_current_weight CHECK (current_weight_kg IS NULL OR current_weight_kg > 0),
    CONSTRAINT chk_members_target_weight CHECK (target_weight_kg IS NULL OR target_weight_kg > 0)
);

DROP TRIGGER IF EXISTS trg_members_updated_at ON members;
CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- MEMBERSHIP PLANS TABLE
CREATE TABLE IF NOT EXISTS membership_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration_days INT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    popular BOOLEAN DEFAULT FALSE,
    features TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_membership_plans_name UNIQUE (name),
    CONSTRAINT chk_plans_duration_positive CHECK (duration_days > 0),
    CONSTRAINT chk_plans_price_non_negative CHECK (price >= 0.00),
    CONSTRAINT chk_plans_name_non_empty CHECK (length(trim(name)) > 0)
);

-- MEMBERSHIPS TABLE
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_memberships_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_memberships_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT,
    CONSTRAINT chk_memberships_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_memberships_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'PENDING', 'CANCELLED'))
);

-- WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID,
    trainer_id UUID,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    target_level VARCHAR(30) DEFAULT 'INTERMEDIATE',
    duration_weeks INT DEFAULT 8,
    days_per_week INT DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_workout_plans_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    CONSTRAINT fk_workout_plans_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    CONSTRAINT chk_plans_target_level CHECK (target_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_plans_duration_weeks CHECK (duration_weeks > 0),
    CONSTRAINT chk_plans_days_per_week CHECK (days_per_week >= 1 AND days_per_week <= 7),
    CONSTRAINT chk_plans_name_non_empty CHECK (length(trim(name)) > 0)
);

DROP TRIGGER IF EXISTS trg_workout_plans_updated_at ON workout_plans;
CREATE TRIGGER trg_workout_plans_updated_at
BEFORE UPDATE ON workout_plans
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

-- EXERCISES TABLE
CREATE TABLE IF NOT EXISTS exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id UUID NOT NULL,
    name VARCHAR(120) NOT NULL,
    muscle_group VARCHAR(80),
    equipment VARCHAR(80),
    sets INT NOT NULL,
    repetitions INT NOT NULL,
    target_weight_kg NUMERIC(6, 2) DEFAULT 0.00,
    rest_seconds INT DEFAULT 60,
    notes TEXT,

    CONSTRAINT fk_exercises_plan FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    CONSTRAINT chk_exercises_sets_positive CHECK (sets > 0),
    CONSTRAINT chk_exercises_reps_positive CHECK (repetitions > 0),
    CONSTRAINT chk_exercises_target_weight CHECK (target_weight_kg >= 0.00),
    CONSTRAINT chk_exercises_rest CHECK (rest_seconds >= 0),
    CONSTRAINT chk_exercises_name_non_empty CHECK (length(trim(name)) > 0)
);

-- WORKOUT LOGS TABLE
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    exercise_id UUID,
    completed_sets INT NOT NULL,
    repetitions INT NOT NULL,
    weight_used_kg NUMERIC(6, 2) NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    CONSTRAINT fk_workout_logs_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_workout_logs_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE SET NULL,
    CONSTRAINT chk_logs_completed_sets CHECK (completed_sets > 0),
    CONSTRAINT chk_logs_repetitions CHECK (repetitions > 0),
    CONSTRAINT chk_logs_weight_used CHECK (weight_used_kg >= 0.00)
);

-- TRAINING SESSIONS TABLE
CREATE TABLE IF NOT EXISTS training_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    trainer_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    session_type VARCHAR(50) NOT NULL DEFAULT 'PERSONAL_TRAINING',
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INT DEFAULT 60,
    status VARCHAR(30) NOT NULL DEFAULT 'SCHEDULED',
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_training_sessions_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_training_sessions_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    CONSTRAINT chk_sessions_type CHECK (session_type IN ('PERSONAL_TRAINING', 'ASSESSMENT', 'NUTRITION_CONSULT')),
    CONSTRAINT chk_sessions_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_sessions_duration CHECK (duration_minutes > 0),
    CONSTRAINT chk_sessions_title_non_empty CHECK (length(trim(title)) > 0)
);

-- ATTENDANCE TABLE
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    check_in_time VARCHAR(20) NOT NULL,
    check_out_time VARCHAR(20),
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT chk_attendance_status CHECK (status IN ('CHECKED_IN', 'COMPLETED')),
    CONSTRAINT uq_member_attendance_slot UNIQUE (member_id, attendance_date, check_in_time)
);

-- PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    membership_id UUID,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'USD',
    payment_method VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uq_payments_transaction_ref UNIQUE (transaction_reference),
    CONSTRAINT fk_payments_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_membership FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE SET NULL,
    CONSTRAINT chk_payments_amount_non_negative CHECK (amount >= 0.00),
    CONSTRAINT chk_payments_method CHECK (payment_method IN ('CARD', 'UPI', 'CASH', 'BANK_TRANSFER')),
    CONSTRAINT chk_payments_status CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'))
);

-- PROGRESS RECORDS TABLE
CREATE TABLE IF NOT EXISTS progress_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    weight_kg NUMERIC(5, 2) NOT NULL,
    body_fat_percentage NUMERIC(4, 2),
    recorded_at DATE NOT NULL,
    notes TEXT,

    CONSTRAINT fk_progress_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT chk_progress_weight_positive CHECK (weight_kg > 0.00),
    CONSTRAINT chk_progress_body_fat CHECK (body_fat_percentage IS NULL OR (body_fat_percentage >= 2.00 AND body_fat_percentage <= 70.00)),
    CONSTRAINT uq_member_progress_date UNIQUE (member_id, recorded_at)
);


-- ----------------------------------------------------------------------------
-- 3. Indexes for Query Performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON users(auth_user_id) WHERE auth_user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_trainers_user_id ON trainers(user_id);
CREATE INDEX IF NOT EXISTS idx_trainers_status ON trainers(status);
CREATE INDEX IF NOT EXISTS idx_trainers_specialization ON trainers(specialization);
CREATE INDEX IF NOT EXISTS idx_members_user_id ON members(user_id);
CREATE INDEX IF NOT EXISTS idx_members_assigned_trainer_id ON members(assigned_trainer_id);
CREATE INDEX IF NOT EXISTS idx_membership_plans_active ON membership_plans(active);
CREATE INDEX IF NOT EXISTS idx_memberships_member_id ON memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_memberships_plan_id ON memberships(plan_id);
CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships(end_date);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_workout_plans_member_id ON workout_plans(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_plans_trainer_id ON workout_plans(trainer_id);
CREATE INDEX IF NOT EXISTS idx_exercises_workout_plan_id ON exercises(workout_plan_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_member_id ON workout_logs(member_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_exercise_id ON workout_logs(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workout_logs_completed_at ON workout_logs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_training_sessions_member_id ON training_sessions(member_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_trainer_id ON training_sessions(trainer_id);
CREATE INDEX IF NOT EXISTS idx_training_sessions_scheduled_at ON training_sessions(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_training_sessions_status ON training_sessions(status);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_progress_records_member_id ON progress_records(member_id);
CREATE INDEX IF NOT EXISTS idx_progress_records_date ON progress_records(recorded_at DESC);


-- ----------------------------------------------------------------------------
-- 4. Role Escalation Prevention Trigger
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION prevent_unauthorized_role_escalation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role = 'ADMIN' AND OLD.role <> 'ADMIN' THEN
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
-- 5. Helper Functions for Row Level Security (RLS)
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.users WHERE auth_user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.users
        WHERE auth_user_id = auth.uid() AND role = 'ADMIN'
    );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_member_id()
RETURNS UUID AS $$
    SELECT m.id FROM public.members m
    JOIN public.users u ON u.id = m.user_id
    WHERE u.auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.current_trainer_id()
RETURNS UUID AS $$
    SELECT t.id FROM public.trainers t
    JOIN public.users u ON u.id = t.user_id
    WHERE u.auth_user_id = auth.uid()
    LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ----------------------------------------------------------------------------
-- 6. Enable Row Level Security (RLS)
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
-- 7. RLS Policies
-- ----------------------------------------------------------------------------
-- users
DROP POLICY IF EXISTS "Admins full access to users" ON users;
CREATE POLICY "Admins full access to users" ON users FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = auth_user_id);
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = auth_user_id);

-- trainers
DROP POLICY IF EXISTS "Anyone can view active trainers" ON trainers;
CREATE POLICY "Anyone can view active trainers" ON trainers FOR SELECT USING (status = 'ACTIVE' OR public.is_admin());
DROP POLICY IF EXISTS "Admins full access to trainers" ON trainers;
CREATE POLICY "Admins full access to trainers" ON trainers FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Trainers can update own profile" ON trainers;
CREATE POLICY "Trainers can update own profile" ON trainers FOR UPDATE USING (id = public.current_trainer_id());

-- members
DROP POLICY IF EXISTS "Admins full access to members" ON members;
CREATE POLICY "Admins full access to members" ON members FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Members can view own profile" ON members;
CREATE POLICY "Members can view own profile" ON members FOR SELECT USING (id = public.current_member_id());
DROP POLICY IF EXISTS "Trainers can view assigned members" ON members;
CREATE POLICY "Trainers can view assigned members" ON members FOR SELECT USING (assigned_trainer_id = public.current_trainer_id());

-- plans
DROP POLICY IF EXISTS "Anyone can view active plans" ON membership_plans;
CREATE POLICY "Anyone can view active plans" ON membership_plans FOR SELECT USING (active = TRUE OR public.is_admin());
DROP POLICY IF EXISTS "Admins full access to membership plans" ON membership_plans;
CREATE POLICY "Admins full access to membership plans" ON membership_plans FOR ALL USING (public.is_admin());

-- memberships
DROP POLICY IF EXISTS "Admins full access to memberships" ON memberships;
CREATE POLICY "Admins full access to memberships" ON memberships FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Members can view own memberships" ON memberships;
CREATE POLICY "Members can view own memberships" ON memberships FOR SELECT USING (member_id = public.current_member_id());

-- workout plans & exercises
DROP POLICY IF EXISTS "Admins full access to workout plans" ON workout_plans;
CREATE POLICY "Admins full access to workout plans" ON workout_plans FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Trainers can manage own workout plans" ON workout_plans;
CREATE POLICY "Trainers can manage own workout plans" ON workout_plans FOR ALL USING (trainer_id = public.current_trainer_id());
DROP POLICY IF EXISTS "Members can view assigned workout plans" ON workout_plans;
CREATE POLICY "Members can view assigned workout plans" ON workout_plans FOR SELECT USING (member_id = public.current_member_id());

DROP POLICY IF EXISTS "Anyone with access to plan can view exercises" ON exercises;
CREATE POLICY "Anyone with access to plan can view exercises" ON exercises FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM workout_plans wp
        WHERE wp.id = exercises.workout_plan_id
        AND (wp.member_id = public.current_member_id() OR wp.trainer_id = public.current_trainer_id() OR public.is_admin())
    )
);

-- workout logs
DROP POLICY IF EXISTS "Members can manage own workout logs" ON workout_logs;
CREATE POLICY "Members can manage own workout logs" ON workout_logs FOR ALL USING (member_id = public.current_member_id());
DROP POLICY IF EXISTS "Trainers can view assigned members workout logs" ON workout_logs;
CREATE POLICY "Trainers can view assigned members workout logs" ON workout_logs FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.id = workout_logs.member_id AND m.assigned_trainer_id = public.current_trainer_id()
    )
);
DROP POLICY IF EXISTS "Admins full access to workout logs" ON workout_logs;
CREATE POLICY "Admins full access to workout logs" ON workout_logs FOR ALL USING (public.is_admin());

-- sessions
DROP POLICY IF EXISTS "Admins full access to training sessions" ON training_sessions;
CREATE POLICY "Admins full access to training sessions" ON training_sessions FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Trainers can manage own sessions" ON training_sessions;
CREATE POLICY "Trainers can manage own sessions" ON training_sessions FOR ALL USING (trainer_id = public.current_trainer_id());
DROP POLICY IF EXISTS "Members can view own sessions" ON training_sessions;
CREATE POLICY "Members can view own sessions" ON training_sessions FOR SELECT USING (member_id = public.current_member_id());

-- attendance
DROP POLICY IF EXISTS "Admins full access to attendance" ON attendance;
CREATE POLICY "Admins full access to attendance" ON attendance FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Trainers can view attendance" ON attendance;
CREATE POLICY "Trainers can view attendance" ON attendance FOR SELECT USING (public.current_trainer_id() IS NOT NULL);
DROP POLICY IF EXISTS "Members can view own attendance" ON attendance;
CREATE POLICY "Members can view own attendance" ON attendance FOR SELECT USING (member_id = public.current_member_id());

-- payments
DROP POLICY IF EXISTS "Admins full access to payments" ON payments;
CREATE POLICY "Admins full access to payments" ON payments FOR ALL USING (public.is_admin());
DROP POLICY IF EXISTS "Members can view own payments" ON payments;
CREATE POLICY "Members can view own payments" ON payments FOR SELECT USING (member_id = public.current_member_id());

-- progress records
DROP POLICY IF EXISTS "Members can manage own progress" ON progress_records;
CREATE POLICY "Members can manage own progress" ON progress_records FOR ALL USING (member_id = public.current_member_id());
DROP POLICY IF EXISTS "Trainers can view assigned members progress" ON progress_records;
CREATE POLICY "Trainers can view assigned members progress" ON progress_records FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM members m
        WHERE m.id = progress_records.member_id AND m.assigned_trainer_id = public.current_trainer_id()
    )
);
DROP POLICY IF EXISTS "Admins full access to progress records" ON progress_records;
CREATE POLICY "Admins full access to progress records" ON progress_records FOR ALL USING (public.is_admin());

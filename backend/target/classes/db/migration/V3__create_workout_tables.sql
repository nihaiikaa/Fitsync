-- ============================================================================
-- FitSync Database Migration: V3__create_workout_tables.sql
-- Database: Supabase PostgreSQL
-- Description: Workout Templates, Exercises, Logged Sessions, and 1-on-1 Appointments
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table: workout_plans
-- Structured training programs authored by coaches or self-directed by athletes.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT fk_workout_plans_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE SET NULL,
    CONSTRAINT fk_workout_plans_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    CONSTRAINT chk_plans_target_level CHECK (target_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
    CONSTRAINT chk_plans_duration_weeks CHECK (duration_weeks > 0),
    CONSTRAINT chk_plans_days_per_week CHECK (days_per_week >= 1 AND days_per_week <= 7),
    CONSTRAINT chk_plans_name_non_empty CHECK (length(trim(name)) > 0)
);

CREATE TRIGGER trg_workout_plans_updated_at
BEFORE UPDATE ON workout_plans
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

COMMENT ON TABLE workout_plans IS 'Structured training templates with volume and frequency configurations';

-- ----------------------------------------------------------------------------
-- 2. Table: exercises
-- Individual prescribed movements inside a workout program.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT fk_exercises_plan FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    CONSTRAINT chk_exercises_sets_positive CHECK (sets > 0),
    CONSTRAINT chk_exercises_reps_positive CHECK (repetitions > 0),
    CONSTRAINT chk_exercises_target_weight CHECK (target_weight_kg >= 0.00),
    CONSTRAINT chk_exercises_rest CHECK (rest_seconds >= 0),
    CONSTRAINT chk_exercises_name_non_empty CHECK (length(trim(name)) > 0)
);

COMMENT ON TABLE exercises IS 'Prescribed exercise movements, target loading, and rest periods';

-- ----------------------------------------------------------------------------
-- 3. Table: workout_logs
-- Concrete records of sets, repetitions, and loads achieved by members.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS workout_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    exercise_id UUID,
    completed_sets INT NOT NULL,
    repetitions INT NOT NULL,
    weight_used_kg NUMERIC(6, 2) NOT NULL,
    completed_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    -- Constraints
    CONSTRAINT fk_workout_logs_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_workout_logs_exercise FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE SET NULL,
    CONSTRAINT chk_logs_completed_sets CHECK (completed_sets > 0),
    CONSTRAINT chk_logs_repetitions CHECK (repetitions > 0),
    CONSTRAINT chk_logs_weight_used CHECK (weight_used_kg >= 0.00)
);

COMMENT ON TABLE workout_logs IS 'Actual workout performance logbook demonstrating progressive overload';

-- ----------------------------------------------------------------------------
-- 4. Table: training_sessions
-- Scheduled 1-on-1 personal training, biomechanic checks, and consultations.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT fk_training_sessions_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_training_sessions_trainer FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
    CONSTRAINT chk_sessions_type CHECK (session_type IN ('PERSONAL_TRAINING', 'ASSESSMENT', 'NUTRITION_CONSULT')),
    CONSTRAINT chk_sessions_status CHECK (status IN ('SCHEDULED', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_sessions_duration CHECK (duration_minutes > 0),
    CONSTRAINT chk_sessions_title_non_empty CHECK (length(trim(title)) > 0)
);

COMMENT ON TABLE training_sessions IS 'Scheduled 1-on-1 training and coaching appointments';

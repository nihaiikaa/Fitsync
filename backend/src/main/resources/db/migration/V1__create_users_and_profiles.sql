-- ============================================================================
-- FitSync Database Migration: V1__create_users_and_profiles.sql
-- Database: Supabase PostgreSQL
-- Description: Core User, Trainer, and Member Profile Tables with UUID PKs
-- ============================================================================

-- Ensure standard cryptographic extension is available for UUID generation
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
-- 2. Table: users
-- Core identity table for Admins, Trainers, and Gym Members.
-- Supports both Spring Security (password_hash) and Supabase Auth (auth_user_id).
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT uq_users_email UNIQUE (email),
    CONSTRAINT uq_users_auth_user_id UNIQUE (auth_user_id),
    CONSTRAINT chk_users_role CHECK (role IN ('ADMIN', 'TRAINER', 'MEMBER')),
    CONSTRAINT chk_users_email_non_empty CHECK (length(trim(email)) > 0),
    CONSTRAINT chk_users_full_name_non_empty CHECK (length(trim(full_name)) > 0)
);

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

COMMENT ON TABLE users IS 'Application-level user profiles supporting both Spring Security and Supabase Auth';
COMMENT ON COLUMN users.auth_user_id IS 'Foreign key reference to Supabase auth.users(id) when Supabase Auth is connected';
COMMENT ON COLUMN users.role IS 'Role authorization level: ADMIN, TRAINER, or MEMBER';

-- ----------------------------------------------------------------------------
-- 3. Table: trainers
-- Professional profile, credentials, and coaching availability.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT uq_trainers_user_id UNIQUE (user_id),
    CONSTRAINT fk_trainers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_trainers_experience CHECK (experience_years >= 0),
    CONSTRAINT chk_trainers_rating CHECK (rating >= 0.00 AND rating <= 5.00),
    CONSTRAINT chk_trainers_status CHECK (status IN ('ACTIVE', 'INACTIVE'))
);

COMMENT ON TABLE trainers IS 'Certified gym personal trainers and strength coaches';

-- ----------------------------------------------------------------------------
-- 4. Table: members
-- Gym athlete record, initial physical metrics, and coach assignment.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT uq_members_user_id UNIQUE (user_id),
    CONSTRAINT fk_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_members_trainer FOREIGN KEY (assigned_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    CONSTRAINT chk_members_height CHECK (height_cm IS NULL OR (height_cm >= 50 AND height_cm <= 300)),
    CONSTRAINT chk_members_current_weight CHECK (current_weight_kg IS NULL OR current_weight_kg > 0),
    CONSTRAINT chk_members_target_weight CHECK (target_weight_kg IS NULL OR target_weight_kg > 0)
);

CREATE TRIGGER trg_members_updated_at
BEFORE UPDATE ON members
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

COMMENT ON TABLE members IS 'Active and historical gym member athletes';

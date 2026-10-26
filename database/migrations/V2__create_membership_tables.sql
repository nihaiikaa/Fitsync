-- ============================================================================
-- FitSync Database Migration: V2__create_membership_tables.sql
-- Database: Supabase PostgreSQL
-- Description: Membership Plans, Durations, Pricing, and Member Subscriptions
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table: membership_plans
-- Commercial gym tiers (e.g. Standard Flex, Pro Performance, Elite Athlete).
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT uq_membership_plans_name UNIQUE (name),
    CONSTRAINT chk_plans_duration_positive CHECK (duration_days > 0),
    CONSTRAINT chk_plans_price_non_negative CHECK (price >= 0.00),
    CONSTRAINT chk_plans_name_non_empty CHECK (length(trim(name)) > 0)
);

COMMENT ON TABLE membership_plans IS 'Configurable membership tiers and subscription pricing plans';

-- ----------------------------------------------------------------------------
-- 2. Table: memberships
-- Active and past member subscription enrollments.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    plan_id UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_memberships_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_memberships_plan FOREIGN KEY (plan_id) REFERENCES membership_plans(id) ON DELETE RESTRICT,
    CONSTRAINT chk_memberships_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_memberships_status CHECK (status IN ('ACTIVE', 'EXPIRED', 'PENDING', 'CANCELLED'))
);

COMMENT ON TABLE memberships IS 'Member enrollment periods and subscription lifecycle state';

-- ============================================================================
-- FitSync Database Migration: V4__create_attendance_payments_progress.sql
-- Database: Supabase PostgreSQL
-- Description: Attendance Tracking, Payments/Billing Ledger, and Body Metric Progress
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Table: attendance
-- Real-time facility check-in and check-out logs for members.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    check_in_time VARCHAR(20) NOT NULL,
    check_out_time VARCHAR(20),
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'CHECKED_IN',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    CONSTRAINT fk_attendance_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT chk_attendance_status CHECK (status IN ('CHECKED_IN', 'COMPLETED')),
    -- Prevents identical duplicate scan entries for the same member at the same time
    CONSTRAINT uq_member_attendance_slot UNIQUE (member_id, attendance_date, check_in_time)
);

COMMENT ON TABLE attendance IS 'Gym facility floor entry scans and visit duration logs';

-- ----------------------------------------------------------------------------
-- 2. Table: payments
-- Membership billing receipts, audit logs, and digital gateway transactions.
-- ----------------------------------------------------------------------------
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

    -- Constraints
    CONSTRAINT uq_payments_transaction_ref UNIQUE (transaction_reference),
    CONSTRAINT fk_payments_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_membership FOREIGN KEY (membership_id) REFERENCES memberships(id) ON DELETE SET NULL,
    CONSTRAINT chk_payments_amount_non_negative CHECK (amount >= 0.00),
    CONSTRAINT chk_payments_method CHECK (payment_method IN ('CARD', 'UPI', 'CASH', 'BANK_TRANSFER')),
    CONSTRAINT chk_payments_status CHECK (status IN ('COMPLETED', 'PENDING', 'FAILED', 'REFUNDED'))
);

COMMENT ON TABLE payments IS 'Verified revenue records, point-of-sale cash, and digital transactions';

-- ----------------------------------------------------------------------------
-- 3. Table: progress_records
-- Historical body composition, weigh-in points, and body fat progression.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS progress_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    member_id UUID NOT NULL,
    weight_kg NUMERIC(5, 2) NOT NULL,
    body_fat_percentage NUMERIC(4, 2),
    recorded_at DATE NOT NULL,
    notes TEXT,

    -- Constraints
    CONSTRAINT fk_progress_member FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT chk_progress_weight_positive CHECK (weight_kg > 0.00),
    CONSTRAINT chk_progress_body_fat CHECK (body_fat_percentage IS NULL OR (body_fat_percentage >= 2.00 AND body_fat_percentage <= 70.00)),
    -- Ensures clean daily tracking by preventing duplicate weigh-ins on the same day for a member
    CONSTRAINT uq_member_progress_date UNIQUE (member_id, recorded_at)
);

COMMENT ON TABLE progress_records IS 'Bi-weekly and daily weigh-in curve data points and body fat metrics';

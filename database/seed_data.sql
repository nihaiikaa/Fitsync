-- ============================================================================
-- FitSync Database Seed Script: seed_data.sql
-- Environment: Development & Demo Environment
-- Description: Realistic seed data for 1 Admin, 2 Trainers, 5 Members, Plans,
--              Memberships, Routines, Attendance, Sessions, Payments, and Progress.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. Seed Membership Plans
-- ----------------------------------------------------------------------------
INSERT INTO membership_plans (id, name, description, duration_days, price, currency, popular, features, active) VALUES
('40000000-0000-0000-0000-000000000001', 'Standard Flex', 'Perfect for casual lifters and cardio enthusiasts.', 30, 49.00, 'USD', FALSE, 'Access to Gym Floor,Locker Room & Showers,Standard Cardio Equipment,FitSync Mobile App', TRUE),
('40000000-0000-0000-0000-000000000002', 'Pro Performance', 'Designed for serious athletes aiming for consistent progressive overload.', 30, 89.00, 'USD', TRUE, 'Full Gym & Free Weights Access,Assigned Personal Trainer,Customized Workout Plans,Sauna & Steam Bath Access,Nutrition Guidance', TRUE),
('40000000-0000-0000-0000-000000000003', 'Elite Athlete Annual', 'Our top-tier all-inclusive package with elite physical coaching.', 365, 890.00, 'USD', FALSE, 'Unlimited 24/7 Access,Weekly 1-on-1 PT Sessions,Full Body Composition Scans,Custom Supplementation Plan,VIP Locker & Guest Passes', TRUE)
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 2. Seed Users
-- Password hash corresponds to BCrypt hash for 'admin123', 'trainer123', 'member123'
-- ----------------------------------------------------------------------------
INSERT INTO users (id, full_name, email, phone, role, password_hash, avatar_url) VALUES
-- Admin
('10000000-0000-0000-0000-000000000001', 'Alex Vance', 'admin@fitsync.com', '+1 (555) 019-2834', 'ADMIN', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'),
-- Trainers
('10000000-0000-0000-0000-000000000002', 'Marcus Hayes', 'trainer@fitsync.com', '+1 (555) 438-9201', 'TRAINER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&q=80&w=200'),
('10000000-0000-0000-0000-000000000003', 'Elena Rostova', 'elena.rostova@fitsync.com', '+1 (555) 321-7788', 'TRAINER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'),
-- 5 Members
('10000000-0000-0000-0000-000000000004', 'Sarah Connor', 'member@fitsync.com', '+1 (555) 782-3490', 'MEMBER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
('10000000-0000-0000-0000-000000000005', 'James Rodriguez', 'j.rodriguez@email.com', '+1 (555) 234-5678', 'MEMBER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
('10000000-0000-0000-0000-000000000006', 'Emily Watson', 'emily.w@email.com', '+1 (555) 345-6789', 'MEMBER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'),
('10000000-0000-0000-0000-000000000007', 'Liam Neeson', 'liam.n@email.com', '+1 (555) 456-7890', 'MEMBER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'),
('10000000-0000-0000-0000-000000000008', 'Sophia Martinez', 'sophia.m@email.com', '+1 (555) 567-8901', 'MEMBER', '$2a$10$8K1p/a0dL1LXMIgoEDFrwOfkM8IomKqfQ89a8m9V0K6c/P2Q7T0eG', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=200')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 3. Seed Trainers
-- ----------------------------------------------------------------------------
INSERT INTO trainers (id, user_id, specialization, experience_years, biography, availability, rating, status) VALUES
('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'Hypertrophy & Strength', 7, 'CSCS certified trainer specializing in barbell biomechanics, powerlifting, and muscle hypertrophy.', 'Mon-Fri 08:00-18:00', 4.90, 'ACTIVE'),
('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000003', 'Functional & HIIT', 5, 'Former track athlete focusing on athletic conditioning, mobility, and high-intensity metabolic training.', 'Tue-Sat 09:00-17:00', 4.80, 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 4. Seed Members
-- ----------------------------------------------------------------------------
INSERT INTO members (id, user_id, assigned_trainer_id, height_cm, current_weight_kg, target_weight_kg, emergency_contact, joined_at) VALUES
('30000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001', 168, 63.50, 60.00, 'John Connor (+1 555-901-2244)', CURRENT_TIMESTAMP - INTERVAL '90 day'),
('30000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000001', 180, 82.00, 78.00, 'Maria Rodriguez (+1 555-234-9999)', CURRENT_TIMESTAMP - INTERVAL '60 day'),
('30000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000002', 165, 57.00, 55.00, 'Robert Watson (+1 555-345-1111)', CURRENT_TIMESTAMP - INTERVAL '120 day'),
('30000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000007', NULL, 185, 89.00, 84.00, 'Clara Neeson (+1 555-456-2222)', CURRENT_TIMESTAMP - INTERVAL '40 day'),
('30000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000008', '20000000-0000-0000-0000-000000000002', 170, 61.20, 58.00, 'Diego Martinez (+1 555-567-3333)', CURRENT_TIMESTAMP - INTERVAL '15 day')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 5. Seed Memberships
-- ----------------------------------------------------------------------------
INSERT INTO memberships (id, member_id, plan_id, start_date, end_date, status) VALUES
('50000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '15 day', CURRENT_DATE + INTERVAL '45 day', 'ACTIVE'),
('50000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000002', CURRENT_DATE - INTERVAL '20 day', CURRENT_DATE + INTERVAL '40 day', 'ACTIVE'),
('50000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000003', CURRENT_DATE - INTERVAL '60 day', CURRENT_DATE + INTERVAL '305 day', 'ACTIVE'),
('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', CURRENT_DATE - INTERVAL '40 day', CURRENT_DATE - INTERVAL '10 day', 'EXPIRED'),
('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000002', CURRENT_DATE, CURRENT_DATE + INTERVAL '30 day', 'PENDING')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 6. Seed Workout Plans & Exercises
-- ----------------------------------------------------------------------------
INSERT INTO workout_plans (id, member_id, trainer_id, name, description, target_level, duration_weeks, days_per_week) VALUES
('60000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Upper Body Hypertrophy & Delts', 'Targeted shoulder capping and chest volume with mechanical drop sets.', 'INTERMEDIATE', 8, 4),
('60000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Legs & Core Power Builder', 'Compound posterior chain dominance and quadriceps development.', 'ADVANCED', 12, 3),
('60000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Functional Full-Body Conditioning', 'High-calorie burn, cardiovascular durability, and explosive power.', 'BEGINNER', 6, 3)
ON CONFLICT (id) DO NOTHING;

INSERT INTO exercises (id, workout_plan_id, name, muscle_group, equipment, sets, repetitions, target_weight_kg, rest_seconds, notes) VALUES
('70000000-0000-0000-0000-000000000001', '60000000-0000-0000-0000-000000000001', 'Barbell Incline Bench Press', 'Chest', 'Barbell & Bench', 4, 10, 55.00, 90, 'Control eccentric for 2 seconds'),
('70000000-0000-0000-0000-000000000002', '60000000-0000-0000-0000-000000000001', 'Seated Dumbbell Overhead Press', 'Shoulders', 'Dumbbells', 3, 12, 18.00, 60, 'Keep core braced, avoid arching'),
('70000000-0000-0000-0000-000000000003', '60000000-0000-0000-0000-000000000001', 'Cable Lateral Raise', 'Lateral Delts', 'Cable Tower', 4, 15, 7.50, 45, 'Pause 1s at peak contraction'),
('70000000-0000-0000-0000-000000000004', '60000000-0000-0000-0000-000000000001', 'Lat Pulldown', 'Back', 'Cable Machine', 4, 10, 50.00, 75, 'Drive elbows down to pockets'),
('70000000-0000-0000-0000-000000000005', '60000000-0000-0000-0000-000000000002', 'Barbell Back Squat', 'Quadriceps', 'Squat Rack', 5, 6, 85.00, 120, 'Hit parallel or deeper'),
('70000000-0000-0000-0000-000000000006', '60000000-0000-0000-0000-000000000002', 'Romanian Deadlift (RDL)', 'Hamstrings', 'Barbell', 4, 8, 70.00, 90, 'Hinge hips backward without rounding spine')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 7. Seed Workout Logs
-- ----------------------------------------------------------------------------
INSERT INTO workout_logs (id, member_id, exercise_id, completed_sets, repetitions, weight_used_kg, completed_at, notes) VALUES
('80000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000001', 4, 10, 55.00, CURRENT_TIMESTAMP - INTERVAL '2 day', 'Great chest pump and control'),
('80000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', '70000000-0000-0000-0000-000000000002', 3, 12, 18.00, CURRENT_TIMESTAMP - INTERVAL '2 day', 'Form clean on all 3 sets'),
('80000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000002', '70000000-0000-0000-0000-000000000005', 5, 6, 85.00, CURRENT_TIMESTAMP - INTERVAL '1 day', 'RPE 8.5')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 8. Seed Training Sessions
-- ----------------------------------------------------------------------------
INSERT INTO training_sessions (id, member_id, trainer_id, title, session_type, scheduled_at, duration_minutes, status, notes) VALUES
('90000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'Shoulder Biomechanics & Strength Check', 'PERSONAL_TRAINING', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '2 hour', 60, 'SCHEDULED', 'Review barbell incline bench press bar path and rotator cuff warmup.'),
('90000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000001', 'Deadlift Technique & Hip Mobility', 'PERSONAL_TRAINING', CURRENT_TIMESTAMP + INTERVAL '1 day' + INTERVAL '6 hour', 60, 'SCHEDULED', 'Check lower back neutral curve under load.'),
('90000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000002', 'Monthly Progress & Body Comp Assessment', 'ASSESSMENT', CURRENT_TIMESTAMP - INTERVAL '3 day', 45, 'COMPLETED', 'Caliper skinfold and DEXA review complete.')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 9. Seed Attendance Records
-- ----------------------------------------------------------------------------
INSERT INTO attendance (id, member_id, check_in_time, check_out_time, attendance_date, status) VALUES
('a0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '07:15 AM', '08:45 AM', CURRENT_DATE, 'COMPLETED'),
('a0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '08:30 AM', '09:50 AM', CURRENT_DATE, 'COMPLETED'),
('a0000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '11:00 AM', NULL, CURRENT_DATE, 'CHECKED_IN'),
('a0000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', '06:00 AM', '07:15 AM', CURRENT_DATE - INTERVAL '1 day', 'COMPLETED'),
('a0000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000004', '05:45 PM', '07:00 PM', CURRENT_DATE - INTERVAL '1 day', 'COMPLETED')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 10. Seed Progress Records (Bi-weekly weight trajectory for Member 1)
-- ----------------------------------------------------------------------------
INSERT INTO progress_records (id, member_id, weight_kg, body_fat_percentage, recorded_at, notes) VALUES
('b0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', 67.20, 24.20, CURRENT_DATE - INTERVAL '90 day', 'Baseline assessment weigh-in'),
('b0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000001', 66.40, 23.50, CURRENT_DATE - INTERVAL '75 day', 'Week 2 weigh-in'),
('b0000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000001', 65.80, 22.80, CURRENT_DATE - INTERVAL '60 day', 'Month 1 review'),
('b0000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000001', 64.90, 22.00, CURRENT_DATE - INTERVAL '45 day', 'Caloric deficit adhering well'),
('b0000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000001', 64.20, 21.40, CURRENT_DATE - INTERVAL '30 day', 'Month 2 review'),
('b0000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000001', 63.80, 21.00, CURRENT_DATE - INTERVAL '15 day', 'Strength retained'),
('b0000000-0000-0000-0000-000000000007', '30000000-0000-0000-0000-000000000001', 63.50, 20.60, CURRENT_DATE, 'Current weigh-in')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------------------------------
-- 11. Seed Payments (With Different Statuses)
-- ----------------------------------------------------------------------------
INSERT INTO payments (id, member_id, membership_id, amount, currency, payment_method, status, transaction_reference, created_at) VALUES
-- Completed Payments
('c0000000-0000-0000-0000-000000000001', '30000000-0000-0000-0000-000000000001', '50000000-0000-0000-0000-000000000001', 89.00, 'USD', 'CARD', 'COMPLETED', 'INV-2026-0891', CURRENT_TIMESTAMP - INTERVAL '15 day'),
('c0000000-0000-0000-0000-000000000002', '30000000-0000-0000-0000-000000000002', '50000000-0000-0000-0000-000000000002', 89.00, 'USD', 'UPI', 'COMPLETED', 'INV-2026-0892', CURRENT_TIMESTAMP - INTERVAL '20 day'),
('c0000000-0000-0000-0000-000000000003', '30000000-0000-0000-0000-000000000003', '50000000-0000-0000-0000-000000000003', 890.00, 'USD', 'BANK_TRANSFER', 'COMPLETED', 'INV-2026-0893', CURRENT_TIMESTAMP - INTERVAL '60 day'),
('c0000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000004', 49.00, 'USD', 'CASH', 'COMPLETED', 'INV-2026-0894', CURRENT_TIMESTAMP - INTERVAL '40 day'),
-- Pending Payment
('c0000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000005', '50000000-0000-0000-0000-000000000005', 89.00, 'USD', 'CARD', 'PENDING', 'INV-2026-0895', CURRENT_TIMESTAMP - INTERVAL '1 day'),
-- Failed Payment
('c0000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000004', '50000000-0000-0000-0000-000000000004', 49.00, 'USD', 'CARD', 'FAILED', 'INV-2026-0780', CURRENT_TIMESTAMP - INTERVAL '10 day')
ON CONFLICT (id) DO NOTHING;

COMMIT;

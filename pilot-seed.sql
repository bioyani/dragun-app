-- ============================================================
-- Dragun.app - Production Pilot Mock Dataset
-- 
-- Run this against your database using the Supabase Dashboard
-- SQL Editor, or locally via CLI. 
-- Make sure you have already run default `seed.sql` so 
-- Merchant 00000000-0000-0000-0000-000000000001 exists.
-- ============================================================

-- Ensure the baseline merchant exists
INSERT INTO auth.users (id, email, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, aud, role, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', 'mezianiyani0@gmail.com', NOW(), '{"full_name": "Yani Meziani", "provider": "google"}'::jsonb, '{"provider": "google", "providers": ["google"]}'::jsonb, 'authenticated', 'authenticated', NOW(), NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO merchants (id, name, email, strictness_level, settlement_floor)
VALUES ('00000000-0000-0000-0000-000000000001', 'Yani Meziani', 'mezianiyani0@gmail.com', 7, 0.75)
ON CONFLICT (id) DO NOTHING;

-- Clean existing mock debtors for this merchant to avoid duplicates on re-runs (optional safety)
DELETE FROM debtors WHERE merchant_id = '00000000-0000-0000-0000-000000000001';

-- 1) PENDING / HIGH PRIORITY (Overdue severely, high amounts)
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Acme Corp', 'ap@acmecorp.example.com', '+15550100', 12500.00, 'USD', 'pending', 95, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Stark Industries', 'tony@stark.example.com', '+15550101', 45000.00, 'USD', 'pending', 120, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Wayne Enterprises', 'bruce@wayne.example.com', '+15550102', 8500.00, 'USD', 'pending', 60, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Globex', 'scorpio@globex.example.com', '+15550103', 2300.00, 'USD', 'pending', 45, NOW() - INTERVAL '1 days', NOW() - INTERVAL '1 days');

-- 2) CONTACTED (Outreach in progress)
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, last_contacted, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Initech', 'bill.lumbergh@initech.example.com', '+15550104', 4200.00, 'USD', 'contacted', 35, NOW() - INTERVAL '12 hours', NOW() - INTERVAL '5 days', NOW() - INTERVAL '12 hours'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Massive Dynamic', 'william.bell@md.example.com', '+15550105', 18500.00, 'USD', 'contacted', 90, NOW() - INTERVAL '2 hours', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 hours'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Soylent Corp', 'hr@soylent.example.com', '+15550106', 950.00, 'USD', 'contacted', 15, NOW() - INTERVAL '1 days', NOW() - INTERVAL '5 days', NOW() - INTERVAL '1 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Umbrella Corp', 'wesker@umbrella.example.com', '+15550107', 31000.00, 'USD', 'contacted', 180, NOW() - INTERVAL '5 hours', NOW() - INTERVAL '10 days', NOW() - INTERVAL '5 hours');

-- 3) NO ANSWER (Ghosting)
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, last_contacted, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Vandelay Ind.', 'art@vandelay.example.com', '+15550108', 1200.00, 'USD', 'no_answer', 70, NOW() - INTERVAL '3 days', NOW() - INTERVAL '14 days', NOW() - INTERVAL '3 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Pied Piper', 'richard@piedpiper.example.com', '+15550109', 5500.00, 'USD', 'no_answer', 45, NOW() - INTERVAL '2 days', NOW() - INTERVAL '10 days', NOW() - INTERVAL '2 days');

-- 4) PROMISE TO PAY
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, last_contacted, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Dunder Mifflin', 'michael@dunder.example.com', '+15550110', 3450.00, 'USD', 'promise_to_pay', 55, NOW() - INTERVAL '1 hours', NOW() - INTERVAL '7 days', NOW() - INTERVAL '1 hours'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Hooli', 'belson@hooli.example.com', '+15550111', 115000.00, 'USD', 'promise_to_pay', 200, NOW() - INTERVAL '4 hours', NOW() - INTERVAL '30 days', NOW() - INTERVAL '4 hours');

-- 5) PAID (Recovered)
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, last_contacted, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Cyberdyne', 'miles@cyberdyne.example.com', '+15550112', 45000.00, 'USD', 'paid', 0, NOW() - INTERVAL '2 days', NOW() - INTERVAL '15 days', NOW() - INTERVAL '1 days'),
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Tyrell Corp', 'eldon@tyrell.example.com', '+15550113', 2800.00, 'USD', 'paid', 0, NOW() - INTERVAL '1 days', NOW() - INTERVAL '20 days', NOW() - INTERVAL '12 hours');

-- 6) ESCALATED (Legal / Collection agency limits)
INSERT INTO debtors (id, merchant_id, name, email, phone, total_debt, currency, status, days_overdue, last_contacted, created_at, updated_at) VALUES
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'Weyland-Yutani', 'burke@weyland.example.com', '+15550114', 85000.00, 'USD', 'escalated', 365, NOW() - INTERVAL '14 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '14 days');

-- Give almost everyone a fake History / Recovery Actions log so timeline renders
INSERT INTO recovery_actions (merchant_id, debtor_id, action_type, status_after, note, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, 'email', 'contacted', 'Automated initial outreach via Dragun.', created_at + INTERVAL '1 hour'
FROM debtors
WHERE status != 'pending';

INSERT INTO recovery_actions (merchant_id, debtor_id, action_type, status_after, note, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, 'sms', 'contacted', 'Follow-up SMS dispatched.', created_at + INTERVAL '2 days'
FROM debtors
WHERE status IN ('contacted', 'promise_to_pay', 'no_answer', 'escalated', 'paid');

INSERT INTO recovery_actions (merchant_id, debtor_id, action_type, status_after, note, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, 'status_update', 'no_answer', 'Debtor unresponsive to 3 consecutive touchpoints.', created_at + INTERVAL '5 days'
FROM debtors
WHERE status = 'no_answer';

INSERT INTO recovery_actions (merchant_id, debtor_id, action_type, status_after, note, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, 'call', 'promise_to_pay', 'Debtor answered interactive voice drop. Committed to paying full sum.', updated_at - INTERVAL '1 hour'
FROM debtors
WHERE status = 'promise_to_pay';

INSERT INTO recovery_actions (merchant_id, debtor_id, action_type, status_after, note, created_at)
SELECT '00000000-0000-0000-0000-000000000001', id, 'status_update', 'paid', 'Stripe checkout complete. Funds secured.', updated_at
FROM debtors
WHERE status = 'paid';

-- Add a couple payments for the paid folks
INSERT INTO payments (debtor_id, amount, status, stripe_session_id, created_at)
SELECT id, total_debt, 'success', 'cs_test_mock', updated_at
FROM debtors
WHERE status = 'paid';

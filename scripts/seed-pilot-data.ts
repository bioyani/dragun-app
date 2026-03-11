import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// --- Configuration Helper to read .env.local ---
function loadEnv() {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = value;
      }
    }
  } catch {
    console.warn('⚠️ No .env.local found. Ensure SUPABASE environment variables are exported in your terminal.');
  }
}

async function runPilotSeed() {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
    process.exit(1);
  }

  // Use the service role key to bypass RLS and perform admin database seeding
  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  const merchantId = '00000000-0000-0000-0000-000000000001';

  console.log('🌱 Starting Pilot Seed via Supabase JS...');
  
  // 1. Ensure Merchant Exists
  const { error: merchantErr } = await supabase
    .from('merchants')
    .upsert({
      id: merchantId,
      name: 'Yani Meziani',
      email: 'mezianiyani0@gmail.com',
      strictness_level: 7,
      settlement_floor: 0.75,
    }, { onConflict: 'id' });

  if (merchantErr) {
    console.error('❌ Failed to seed Merchant:', merchantErr.message);
    process.exit(1);
  }
  console.log('✅ Merchant verified.');

  // 2. Clear previous debtors for this merchant to avoid duplicates
  const { error: clearErr } = await supabase
    .from('debtors')
    .delete()
    .eq('merchant_id', merchantId);

  if (clearErr) {
    console.warn('⚠️ Failed clearing existing debtors (normal if empty):', clearErr.message);
  } else {
    console.log('🧹 Cleared existing mock debtors.');
  }

  // 3. Debtors Dataset
  const debtors = [
    // PENDING
    { merchant_id: merchantId, name: 'Acme Corp', email: 'ap@acmecorp.example.com', phone: '+15550100', total_debt: 12500.00, status: 'pending', days_overdue: 95 },
    { merchant_id: merchantId, name: 'Stark Industries', email: 'tony@stark.example.com', phone: '+15550101', total_debt: 45000.00, status: 'pending', days_overdue: 120 },
    { merchant_id: merchantId, name: 'Wayne Enterprises', email: 'bruce@wayne.example.com', phone: '+15550102', total_debt: 8500.00, status: 'pending', days_overdue: 60 },
    // CONTACTED
    { merchant_id: merchantId, name: 'Initech', email: 'bill.lumbergh@initech.example.com', phone: '+15550104', total_debt: 4200.00, status: 'contacted', days_overdue: 35 },
    { merchant_id: merchantId, name: 'Massive Dynamic', email: 'william.bell@md.example.com', phone: '+15550105', total_debt: 18500.00, status: 'contacted', days_overdue: 90 },
    // NO ANSWER
    { merchant_id: merchantId, name: 'Vandelay Ind.', email: 'art@vandelay.example.com', phone: '+15550108', total_debt: 1200.00, status: 'no_answer', days_overdue: 70 },
    // PROMISE TO PAY
    { merchant_id: merchantId, name: 'Dunder Mifflin', email: 'michael@dunder.example.com', phone: '+15550110', total_debt: 3450.00, status: 'promise_to_pay', days_overdue: 55 },
    // PAID
    { merchant_id: merchantId, name: 'Cyberdyne', email: 'miles@cyberdyne.example.com', phone: '+15550112', total_debt: 45000.00, status: 'paid', days_overdue: 0 },
  ];

  const { data: insertedDebtors, error: debtorErr } = await supabase
    .from('debtors')
    .insert(debtors)
    .select('id, status, total_debt');

  if (debtorErr) {
    console.error('❌ Failed seeding debtors:', debtorErr.message);
    process.exit(1);
  }
  
  console.log(`✅ Seeded ${insertedDebtors.length} Debtors.`);

  // 4. Generate some Action Logs + Payments
  const actions = [];
  const payments = [];

  for (const d of insertedDebtors) {
    // Everyone except pending gets a contacted event
    if (d.status !== 'pending') {
      actions.push({
        merchant_id: merchantId,
        debtor_id: d.id,
        action_type: 'email',
        status_after: 'contacted',
        note: 'Automated initial outreach via Dragun.'
      });
    }

    // Promise to pay folks get a phone call log
    if (d.status === 'promise_to_pay') {
      actions.push({
        merchant_id: merchantId,
        debtor_id: d.id,
        action_type: 'call',
        status_after: 'promise_to_pay',
        note: 'Debtor answered interactive voice drop. Committed to paying full sum.'
      });
    }

    // Paid folks get a payment log
    if (d.status === 'paid') {
      actions.push({
        merchant_id: merchantId,
        debtor_id: d.id,
        action_type: 'status_update',
        status_after: 'paid',
        note: 'Stripe checkout complete. Funds secured.'
      });

      payments.push({
        debtor_id: d.id,
        amount: d.total_debt,
        status: 'success',
        stripe_session_id: 'cs_test_mock_seeder'
      });
    }
  }

  // Push actions history
  if (actions.length > 0) {
    const { error: actErr } = await supabase.from('recovery_actions').insert(actions);
    if (actErr) console.error('⚠️ Could not seed actions:', actErr.message);
    else console.log(`✅ Seeded ${actions.length} action log events.`);
  }

  // Push mock payments
  if (payments.length > 0) {
    const { error: payErr } = await supabase.from('payments').insert(payments);
    if (payErr) console.error('⚠️ Could not seed payments:', payErr.message);
    else console.log(`✅ Seeded ${payments.length} successful payment records.`);
  }

  console.log('🚀 Pilot Seed complete.');
}

runPilotSeed().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});

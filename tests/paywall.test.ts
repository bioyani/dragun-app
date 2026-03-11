import { getEffectivePlan } from '../lib/paywall';

console.log('🧪 Testing getEffectivePlan...');

// Test 1: No plan specified -> free
let plan = getEffectivePlan({});
if (plan === 'free') {
  console.log('✅ No plan specified passed');
} else {
  console.error('❌ No plan specified failed');
  process.exit(1);
}

// Test 2: Free plan specified -> free
plan = getEffectivePlan({ plan: 'free' });
if (plan === 'free') {
  console.log('✅ Free plan specified passed');
} else {
  console.error('❌ Free plan specified failed');
  process.exit(1);
}

// Test 3: Active premium plan -> premium plan
const futureDate = new Date();
futureDate.setFullYear(futureDate.getFullYear() + 1);
plan = getEffectivePlan({ plan: 'starter', plan_active_until: futureDate.toISOString() });
if (plan === 'starter') {
  console.log('✅ Active premium plan passed');
} else {
  console.error('❌ Active premium plan failed');
  process.exit(1);
}

// Test 4: Expired premium plan -> free
const pastDate = new Date();
pastDate.setFullYear(pastDate.getFullYear() - 1);
plan = getEffectivePlan({ plan: 'starter', plan_active_until: pastDate.toISOString() });
if (plan === 'free') {
  console.log('✅ Expired premium plan passed');
} else {
  console.error('❌ Expired premium plan failed');
  process.exit(1);
}

// Test 5: Premium plan without plan_active_until -> free
plan = getEffectivePlan({ plan: 'starter' });
if (plan === 'free') {
  console.log('✅ Premium plan without active date passed');
} else {
  console.error('❌ Premium plan without active date failed');
  process.exit(1);
}

console.log('🎉 All paywall tests passed!');

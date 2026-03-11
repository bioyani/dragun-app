import { getEffectivePlan } from '../lib/paywall';

console.log('🧪 Testing getEffectivePlan...');

let failed = false;

function assertEqual(actual: unknown, expected: unknown, testName: string) {
  if (actual === expected) {
    console.log(`✅ ${testName} passed`);
  } else {
    console.error(`❌ ${testName} failed. Expected '${expected}', got '${actual}'`);
    failed = true;
  }
}

// Test 1: No plan specified (defaults to free)
assertEqual(
  getEffectivePlan({}),
  'free',
  'No plan defaults to free'
);

// Test 2: Explicit 'free' plan ignores active_until
assertEqual(
  getEffectivePlan({ plan: 'free', plan_active_until: '2099-01-01T00:00:00Z' }),
  'free',
  'Explicit free plan returns free despite future date'
);

// Test 3: Valid paid plan in the future
assertEqual(
  getEffectivePlan({ plan: 'starter', plan_active_until: new Date(Date.now() + 86400000).toISOString() }),
  'starter',
  'Paid plan with future active date returns plan'
);

// Test 4: Expired paid plan
assertEqual(
  getEffectivePlan({ plan: 'growth', plan_active_until: new Date(Date.now() - 86400000).toISOString() }),
  'free',
  'Expired paid plan downgrades to free'
);

// Test 5: Missing active_until for paid plan
assertEqual(
  getEffectivePlan({ plan: 'scale' }),
  'free',
  'Paid plan missing active date downgrades to free'
);

// Test 6: Null active_until for paid plan
assertEqual(
  getEffectivePlan({ plan: 'starter', plan_active_until: null }),
  'free',
  'Paid plan with null active date downgrades to free'
);

if (failed) {
  console.error('💥 Some getEffectivePlan tests failed!');
  process.exit(1);
} else {
  console.log('🎉 All getEffectivePlan tests passed!');
}

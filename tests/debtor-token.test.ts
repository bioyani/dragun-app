import { createDebtorToken, verifyDebtorToken, hasDebtorPortalSecret } from '../lib/debtor-token';

async function test() {
  console.log('🧪 Testing debtor-token...');

  // Save current secret to restore it later
  const originalSecret = process.env.DEBTOR_PORTAL_SECRET;

  // Test 1: No secret set
  console.log('Test 1: No secret set');
  delete process.env.DEBTOR_PORTAL_SECRET;
  try {
    console.log('hasDebtorPortalSecret:', hasDebtorPortalSecret());
    createDebtorToken('debtor-1');
    console.error('❌ Expected createDebtorToken to throw when no secret is set');
    process.exit(1);
  } catch (e: any) {
    console.log('✅ Caught expected error:', e.message);
  }

  const nullToken = verifyDebtorToken('any-token');
  if (nullToken === null) {
    console.log('✅ verifyDebtorToken returns null when no secret is set');
  } else {
    console.error('❌ Expected verifyDebtorToken to return null when no secret is set');
    process.exit(1);
  }

  // Test 2: Short secret set
  console.log('Test 2: Short secret set');
  process.env.DEBTOR_PORTAL_SECRET = 'too-short';
  try {
    createDebtorToken('debtor-2');
    console.error('❌ Expected createDebtorToken to throw with short secret');
    process.exit(1);
  } catch (e: any) {
    console.log('✅ Caught expected error for short secret:', e.message);
  }

  // Test 3: Valid secret set
  console.log('Test 3: Valid secret set');
  process.env.DEBTOR_PORTAL_SECRET = 'a'.repeat(32);
  const token = createDebtorToken('debtor-3');
  const verified = verifyDebtorToken(token);
  if (verified && verified.debtorId === 'debtor-3') {
    console.log('✅ Valid secret works');
  } else {
    console.error('❌ Valid secret failed');
    process.exit(1);
  }

  // Restore original secret
  process.env.DEBTOR_PORTAL_SECRET = originalSecret;

  console.log('🎉 All debtor-token tests passed!');
}

test();

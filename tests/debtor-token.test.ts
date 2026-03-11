import { createDebtorToken, verifyDebtorToken, buildDebtorPortalUrl, hasDebtorPortalSecret } from '../lib/debtor-token';
import crypto from 'crypto';

console.log('🧪 Testing debtor-token...');

let allPassed = true;
function assert(condition: any, message: string) {
  if (condition) {
    console.log(`✅ ${message} passed`);
  } else {
    console.error(`❌ ${message} failed`);
    allPassed = false;
  }
}

// Ensure the secret is present
const secret = process.env.DEBTOR_PORTAL_SECRET;
if (!secret || secret.length < 32) {
  console.error('❌ DEBTOR_PORTAL_SECRET must be set (min 32 chars) for tests to run');
  process.exit(1);
}

// Test 0: hasDebtorPortalSecret works
assert(hasDebtorPortalSecret() === true, 'hasDebtorPortalSecret identifies valid secret');

const debtorId = 'debtor-123';
const token = createDebtorToken(debtorId);

// Test 1: Create and verify a valid token
const result = verifyDebtorToken(token);
assert(result !== null && result.debtorId === debtorId, 'Valid token verification');

// Test 2: Tamper with token (change payload)
const decoded = Buffer.from(token, 'base64url').toString('utf-8');
const parts = decoded.split(':');
const tamperedPayload = `debtor-999:${parts[1]}`;
const tamperedToken = Buffer.from(`${tamperedPayload}:${parts[2]}`).toString('base64url');
const result2 = verifyDebtorToken(tamperedToken);
assert(result2 === null, 'Tampered payload token verification');

// Test 3: Tamper with token (change signature)
const tamperedSigToken = Buffer.from(`${parts[0]}:${parts[1]}:badsignatureofsimilarlength00000000000000000000000000000000`).toString('base64url');
const result3 = verifyDebtorToken(tamperedSigToken);
assert(result3 === null, 'Tampered signature token verification');

// Test 4: Invalid format token
const invalidToken = Buffer.from('just:some:string').toString('base64url');
const result4 = verifyDebtorToken(invalidToken);
assert(result4 === null, 'Invalid format token verification');

// Test 5: Invalid format token (missing parts)
const invalidToken2 = Buffer.from('just:some').toString('base64url');
const result5 = verifyDebtorToken(invalidToken2);
assert(result5 === null, 'Invalid format token verification (missing parts)');

// Test 6: Invalid format token (not base64)
const invalidToken3 = 'not-base64-url-encoded-at-all!!%%%';
const result6 = verifyDebtorToken(invalidToken3);
assert(result6 === null, 'Invalid format token verification (not base64)');

// Test 7: Test expired token
const expiredPayload = `${debtorId}:${Date.now() - 1000}`; // expired 1 second ago
const sig = crypto.createHmac('sha256', secret).update(expiredPayload).digest('hex');
const expiredToken = Buffer.from(`${expiredPayload}:${sig}`).toString('base64url');
const result7 = verifyDebtorToken(expiredToken);
assert(result7 === null, 'Expired token verification');

// Test 8: Test token with non-numeric expiration
const badExpirePayload = `${debtorId}:not-a-number`;
const sig2 = crypto.createHmac('sha256', secret).update(badExpirePayload).digest('hex');
const badExpireToken = Buffer.from(`${badExpirePayload}:${sig2}`).toString('base64url');
const result8 = verifyDebtorToken(badExpireToken);
assert(result8 === null, 'Non-numeric expiration token verification');

// Test 9: Test buildDebtorPortalUrl
const url = buildDebtorPortalUrl('https://example.com', 'debtor-456', 'chat', 'fr');
assert(url.startsWith('https://example.com/fr/chat/debtor-456?token='), 'buildDebtorPortalUrl structure');

if (!allPassed) {
  process.exit(1);
}

console.log('🎉 All debtor-token tests passed!');

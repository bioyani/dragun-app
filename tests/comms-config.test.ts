import { isCommsTestTokenValid } from '../lib/comms/config';

console.log('🧪 Testing isCommsTestTokenValid...');

// Helper to keep tests clean
function assert(condition: boolean, message: string) {
  if (condition) {
    console.log(`✅ ${message}`);
  } else {
    console.error(`❌ ${message}`);
    process.exit(1);
  }
}

// Store the original so we can restore it
const originalToken = process.env.COMMS_TEST_TOKEN;

try {
  // Test 1: Missing environment variable
  delete process.env.COMMS_TEST_TOKEN;
  assert(
    isCommsTestTokenValid('any-token') === false,
    'Rejects when COMMS_TEST_TOKEN is missing'
  );

  // Set up a valid environment token for remaining tests
  process.env.COMMS_TEST_TOKEN = 'my-secret-token-123';

  // Test 2: Null request token
  assert(
    isCommsTestTokenValid(null) === false,
    'Rejects null request token'
  );

  // Test 3: Empty request token
  assert(
    isCommsTestTokenValid('') === false,
    'Rejects empty request token'
  );

  // Test 4: Mismatching request token (same length)
  assert(
    isCommsTestTokenValid('my-secret-token-999') === false,
    'Rejects mismatching token of same length'
  );

  // Test 5: Mismatching request token (different length)
  assert(
    isCommsTestTokenValid('my-secret-token') === false,
    'Rejects mismatching token of different length'
  );

  // Test 6: Valid matching token
  assert(
    isCommsTestTokenValid('my-secret-token-123') === true,
    'Accepts valid matching token'
  );

  // Test 7: Valid matching token with whitespace (should still fail if exactly matched, since config trims whitespace but timingSafeEqual checks buffer exactly)
  process.env.COMMS_TEST_TOKEN = '  my-secret-token-123  ';
  assert(
    isCommsTestTokenValid('my-secret-token-123') === true,
    'Accepts valid matching token when env var has surrounding whitespace'
  );

  // Test 8: White space in request token that doesn't match clean env token
  assert(
    isCommsTestTokenValid('  my-secret-token-123  ') === false,
    'Rejects request token with whitespace when env token is clean'
  );

  console.log('🎉 All tests passed!');
} finally {
  // Restore original token
  if (originalToken !== undefined) {
    process.env.COMMS_TEST_TOKEN = originalToken;
  } else {
    delete process.env.COMMS_TEST_TOKEN;
  }
}

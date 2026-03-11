import { normalizePhoneToE164 } from '../lib/phone';

const green = '\x1b[32m';
const reset = '\x1b[0m';
const red = '\x1b[31m';

console.log('🧪 Testing normalizePhoneToE164...');

function assertEqual(actual: string, expected: string, testName: string) {
  if (actual === expected) {
    console.log(`${green}✅ ${testName} passed${reset}`);
  } else {
    console.error(`${red}❌ ${testName} failed: expected "${expected}" but got "${actual}"${reset}`);
    process.exit(1);
  }
}

try {
  // 10-digit US number
  assertEqual(normalizePhoneToE164('1234567890'), '+11234567890', '10-digit US number');
  assertEqual(normalizePhoneToE164('(123) 456-7890'), '+11234567890', 'Formatted 10-digit US number');

  // 11-digit US number with leading 1
  assertEqual(normalizePhoneToE164('11234567890'), '+11234567890', '11-digit US number with leading 1');
  assertEqual(normalizePhoneToE164('1 (123) 456-7890'), '+11234567890', 'Formatted 11-digit US number with leading 1');

  // Other lengths
  assertEqual(normalizePhoneToE164('441234567890'), '+441234567890', '12-digit number (e.g. UK)');
  assertEqual(normalizePhoneToE164('123456789012345'), '+123456789012345', '15-digit boundary E.164 number');

  // Too short / Too long (falls back to returning original string trimmed, according to code)
  assertEqual(normalizePhoneToE164('12345'), '12345', 'Too short');
  assertEqual(normalizePhoneToE164('1234567890123456'), '1234567890123456', 'Too long');

  // Edge cases
  assertEqual(normalizePhoneToE164('  12345  '), '12345', 'Trimmed edge case');

  console.log(`${green}🎉 All tests passed!${reset}`);
} catch (error) {
  console.error(`${red}❌ Unexpected error during tests:${reset}`, error);
  process.exit(1);
}

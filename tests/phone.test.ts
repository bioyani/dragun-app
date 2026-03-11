import { test, expect } from 'bun:test';
import { normalizePhoneToE164 } from '../lib/phone';

test('normalizePhoneToE164 correctly normalizes phones', () => {
  // 10-digit US number
  expect(normalizePhoneToE164('1234567890')).toBe('+11234567890');
  expect(normalizePhoneToE164('(123) 456-7890')).toBe('+11234567890');

  // 11-digit US number with leading 1
  expect(normalizePhoneToE164('11234567890')).toBe('+11234567890');
  expect(normalizePhoneToE164('1 (123) 456-7890')).toBe('+11234567890');

  // Other lengths
  expect(normalizePhoneToE164('441234567890')).toBe('+441234567890');
  expect(normalizePhoneToE164('123456789012345')).toBe('+123456789012345');

  // Too short / Too long (falls back to returning original string trimmed, according to code)
  expect(normalizePhoneToE164('12345')).toBe('12345');
  expect(normalizePhoneToE164('1234567890123456')).toBe('1234567890123456');

  // Edge cases
  expect(normalizePhoneToE164('  12345  ')).toBe('12345');
});

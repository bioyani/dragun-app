const US_PHONE_LENGTH = 10;
const US_PHONE_WITH_COUNTRY_CODE_LENGTH = 11;
const MIN_E164_LENGTH = 10;
const MAX_E164_LENGTH = 15;
const US_COUNTRY_CODE = '1';

/**
 * Normalize phone to E.164-like form for Twilio.
 * Strips non-digits; if 10 digits assumes US (+1); if 11 digits and leading 1, keeps as +1XXXXXXXXXX.
 */
export function normalizePhoneToE164(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.length === US_PHONE_LENGTH) {
    return `+${US_COUNTRY_CODE}${digits}`;
  }
  if (digits.length === US_PHONE_WITH_COUNTRY_CODE_LENGTH && digits.startsWith(US_COUNTRY_CODE)) {
    return `+${digits}`;
  }
  if (digits.length >= MIN_E164_LENGTH && digits.length <= MAX_E164_LENGTH) {
    return `+${digits}`;
  }
  return raw.trim();
}

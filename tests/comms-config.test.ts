import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getResendConfig,
  getTwilioConfig,
  getTelnyxConfig,
  getConfiguredEmailProvider,
  getConfiguredSmsProvider,
} from '../lib/comms/config';

describe('comms/config.ts', () => {
  beforeEach(() => {
    // Keep a clean slate for each test using vitest's stubEnv
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('getResendConfig', () => {
    it('should return disabled when keys are missing', () => {
      vi.stubEnv('RESEND_API_KEY', '');
      vi.stubEnv('RESEND_FROM', '');
      expect(getResendConfig()).toEqual({ apiKey: undefined, from: undefined, enabled: false });
    });

    it('should return enabled when keys are provided', () => {
      vi.stubEnv('RESEND_API_KEY', 're_123');
      vi.stubEnv('RESEND_FROM', 'test@example.com');
      expect(getResendConfig()).toEqual({ apiKey: 're_123', from: 'test@example.com', enabled: true });
    });
  });

  describe('getTwilioConfig', () => {
    it('should return disabled when keys are missing', () => {
      vi.stubEnv('TWILIO_ACCOUNT_SID', '');
      vi.stubEnv('TWILIO_AUTH_TOKEN', '');
      vi.stubEnv('TWILIO_FROM', '');
      expect(getTwilioConfig()).toEqual({
        accountSid: undefined,
        authToken: undefined,
        from: undefined,
        statusCallbackUrl: undefined,
        enabled: false
      });
    });

    it('should return enabled with callback url when keys are provided', () => {
      vi.stubEnv('TWILIO_ACCOUNT_SID', 'AC123');
      vi.stubEnv('TWILIO_AUTH_TOKEN', 'token123');
      vi.stubEnv('TWILIO_FROM', '+1234567890');
      vi.stubEnv('NEXT_PUBLIC_URL', 'https://example.com');
      expect(getTwilioConfig()).toEqual({
        accountSid: 'AC123',
        authToken: 'token123',
        from: '+1234567890',
        statusCallbackUrl: 'https://example.com/api/webhooks/twilio/status',
        enabled: true
      });
    });

    it('should use custom callback url if provided', () => {
      vi.stubEnv('TWILIO_ACCOUNT_SID', 'AC123');
      vi.stubEnv('TWILIO_AUTH_TOKEN', 'token123');
      vi.stubEnv('TWILIO_FROM', '+1234567890');
      vi.stubEnv('TWILIO_STATUS_CALLBACK_URL', 'https://custom.com/webhook');
      expect(getTwilioConfig()).toEqual({
        accountSid: 'AC123',
        authToken: 'token123',
        from: '+1234567890',
        statusCallbackUrl: 'https://custom.com/webhook',
        enabled: true
      });
    });
  });

  describe('getTelnyxConfig', () => {
    it('should return disabled when keys are missing', () => {
      vi.stubEnv('TELNYX_API_KEY', '');
      vi.stubEnv('TELNYX_FROM', '');
      expect(getTelnyxConfig()).toEqual({
        apiKey: undefined,
        from: undefined,
        statusCallbackUrl: undefined,
        enabled: false
      });
    });

    it('should return enabled with callback url when keys are provided (trailing slash stripped)', () => {
      vi.stubEnv('TELNYX_API_KEY', 'KEY123');
      vi.stubEnv('TELNYX_FROM', '+1234567890');
      vi.stubEnv('NEXT_PUBLIC_URL', 'https://example.com/');
      expect(getTelnyxConfig()).toEqual({
        apiKey: 'KEY123',
        from: '+1234567890',
        statusCallbackUrl: 'https://example.com/api/webhooks/telnyx/status',
        enabled: true
      });
    });
  });

  describe('getConfiguredEmailProvider', () => {
    it('should fallback to resend when not provided', () => {
      vi.stubEnv('EMAIL_PROVIDER', '');
      expect(getConfiguredEmailProvider()).toBe('resend');
    });

    it('should respect valid provider', () => {
      vi.stubEnv('EMAIL_PROVIDER', 'noop');
      expect(getConfiguredEmailProvider()).toBe('noop');
    });

    it('should fallback to resend if provider is invalid', () => {
      vi.stubEnv('EMAIL_PROVIDER', 'invalid-provider-xyz');
      expect(getConfiguredEmailProvider()).toBe('resend');
    });
  });

  describe('getConfiguredSmsProvider', () => {
    it('should fallback to noop when not provided', () => {
      vi.stubEnv('SMS_PROVIDER', '');
      expect(getConfiguredSmsProvider()).toBe('noop');
    });

    it('should respect valid provider', () => {
      vi.stubEnv('SMS_PROVIDER', 'twilio');
      expect(getConfiguredSmsProvider()).toBe('twilio');
    });
  });
});

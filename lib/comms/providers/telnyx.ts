import { buildNoopResultMeta, getTelnyxConfig } from '@/lib/comms/config';
import { CommsFailure, CommsResult, SmsMessage, SmsProvider } from '@/lib/comms/types';

function fail(code: string, message: string, status?: number): CommsFailure {
  return {
    ok: false,
    channel: 'sms',
    provider: 'telnyx',
    error: {
      provider: 'telnyx',
      code,
      message,
      status,
    },
  };
}

export function createTelnyxSmsProvider(): SmsProvider {
  return {
    name: 'telnyx',
    async send(message: SmsMessage): Promise<CommsResult> {
      if (!message.body?.trim()) {
        return fail('SMS_BODY_REQUIRED', 'SMS body is required.');
      }

      const config = getTelnyxConfig();
      if (!config.enabled) {
        const noop = buildNoopResultMeta('sms');
        return {
          ok: true,
          channel: 'sms',
          provider: noop.provider,
          id: noop.id,
        };
      }

      try {
        const response = await fetch('https://api.telnyx.com/v2/messages', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            from: message.from ?? config.from,
            to: message.to,
            text: message.body,
            webhook_url: message.statusCallbackUrl ?? config.statusCallbackUrl
          })
        });

        const data = await response.json();

        if (!response.ok) {
           const errCode = data.errors?.[0]?.code || 'TELNYX_REQUEST_FAILED';
           const errMsg = data.errors?.[0]?.detail || 'Unknown Telnyx error';
           return fail(errCode, errMsg, response.status);
        }

        return {
          ok: true,
          channel: 'sms',
          provider: 'telnyx',
          id: data.data.id,
          raw: data.data,
        };
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown Telnyx error';
        return fail('TELNYX_REQUEST_FAILED', errorMessage);
      }
    },
  };
}

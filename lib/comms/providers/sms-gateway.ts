import { createTwilioSmsProvider } from '@/lib/comms/providers/twilio';
import { createTelnyxSmsProvider } from '@/lib/comms/providers/telnyx';
import { CommsFailure, CommsResult, SmsMessage, SmsProvider } from '@/lib/comms/types';

// Simple in-memory counter for round-robin switching across free plans.
let requestCount = 0;

function fail(code: string, message: string, status?: number): CommsFailure {
  return {
    ok: false,
    channel: 'sms',
    provider: 'sms-gateway',
    error: {
      provider: 'sms-gateway',
      code,
      message,
      status,
    },
  };
}

export function createSmsGatewayProvider(): SmsProvider {
  return {
    name: 'sms-gateway',
    async send(message: SmsMessage): Promise<CommsResult> {
      requestCount++;
      const isEven = requestCount % 2 === 0;

      // Primary switches back and forth between quotas based on request count
      const primaryProvider = isEven ? createTwilioSmsProvider() : createTelnyxSmsProvider();
      const fallbackProvider = isEven ? createTelnyxSmsProvider() : createTwilioSmsProvider();

      try {
        const result = await primaryProvider.send(message);

        // If the primary provider succeeds, or if it errors out for an irrecoverable user fault (e.g. body missing), we return it.
        if (result.ok || ['SMS_BODY_REQUIRED'].includes(result.error?.code)) {
          return result;
        }

        // If primary provider errored on delivery or rate-limits, we automatically fallback to the other free quota.
        console.warn(`[sms-gateway] Primary provider ${primaryProvider.name} failed (${result.error?.code || 'unknown'}). Falling back to ${fallbackProvider.name}...`);
        
        const fallbackResult = await fallbackProvider.send(message);

        return fallbackResult;
        
      } catch (error: unknown) {
        // If there was an unexpected gateway wrapper error
        const errorMessage = error instanceof Error ? error.message : 'Unknown gateway error';
        return fail('SMS_GATEWAY_CRITICAL_ERROR', errorMessage);
      }
    },
  };
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getTelnyxConfig } from '@/lib/comms/config';
import { supabaseAdmin } from '@/lib/supabase-admin';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'nodejs';

/** Telnyx sends status webhooks as JSON POST with HMAC-SHA256 signature. */
export async function POST(request: Request) {
  try {
    const config = getTelnyxConfig();
    if (!config.enabled) {
      return NextResponse.json({ error: 'Telnyx not configured' }, { status: 503 });
    }

    const rawBody = await request.text();

    // Verify Telnyx webhook signature if public key is configured
    const telnyxPublicKey = process.env.TELNYX_PUBLIC_KEY;
    if (telnyxPublicKey) {
      const signature = request.headers.get('telnyx-signature-ed25519');
      const timestamp = request.headers.get('telnyx-timestamp');
      if (!signature || !timestamp) {
        return NextResponse.json({ error: 'Missing Telnyx signature headers' }, { status: 401 });
      }
      // Telnyx uses Ed25519: signed_payload = timestamp|webhook_body
      const signedPayload = `${timestamp}|${rawBody}`;
      try {
        const keyBuffer = Buffer.from(telnyxPublicKey, 'base64');
        const sigBuffer = Buffer.from(signature, 'base64');
        const valid = crypto.verify(
          null,
          Buffer.from(signedPayload),
          { key: keyBuffer, format: 'der', type: 'spki' },
          sigBuffer,
        );
        if (!valid) {
          return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }
      } catch {
        return NextResponse.json({ error: 'Signature verification failed' }, { status: 401 });
      }
    }

    const body = JSON.parse(rawBody);
    const event = body?.data;
    const payload = event?.payload;

    if (!event || !payload) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const messageId = payload.id as string | undefined;
    const messageStatus = (payload.to?.[0]?.status ?? payload.type ?? event.event_type) as string | undefined;
    const to = payload.to?.[0]?.phone_number as string | undefined;

    if (!messageId) {
      return NextResponse.json({ error: 'Missing message id' }, { status: 400 });
    }

    let debtorId: string | null = null;
    let merchantId: string | null = null;
    if (to) {
      const { data: debtor } = await supabaseAdmin
        .from('debtors')
        .select('id, merchant_id')
        .eq('phone', to)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (debtor) {
        debtorId = debtor.id;
        merchantId = debtor.merchant_id;
      }
    }

    await supabaseAdmin.from('recovery_actions').insert({
      debtor_id: debtorId,
      merchant_id: merchantId,
      action_type: 'sms_status',
      status_after: messageStatus ?? 'unknown',
      note: `SMS ${messageId} → ${messageStatus ?? 'unknown'}${to ? ` to ${to}` : ''}`,
    });

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[webhook] Telnyx status error:', error);
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}

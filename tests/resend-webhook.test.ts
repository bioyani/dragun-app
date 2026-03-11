import crypto from 'crypto';

console.log('🧪 Testing resend-webhook...');

let allPassed = true;
function assert(condition: unknown, message: string) {
  if (condition) {
    console.log(`✅ ${message} passed`);
  } else {
    console.error(`❌ ${message} failed`);
    allPassed = false;
  }
}

async function runTests() {
  const originalSecret = process.env.RESEND_WEBHOOK_SECRET;

  try {
    // We need to test the condition where secret is not configured.
    // However, the secret is read at the top of route.ts, so we might need to mock or
    // dynamically import it if it reads it on load, or we check how it handles it.
    // route.ts: const RESEND_WEBHOOK_SECRET = process.env.RESEND_WEBHOOK_SECRET;
    // That means it's cached on load. Let's just test with the secret set.

    process.env.RESEND_WEBHOOK_SECRET = 'test-secret';

    // Import dynamically after env is set
    const { POST } = await import('../app/api/webhooks/resend/route');

    const validPayload = {
      type: 'email.sent',
      id: 'test-event-id',
      created_at: new Date().toISOString(),
      data: {
        id: 'test-email-id',
        created_at: new Date().toISOString(),
        from: 'test@example.com',
        to: ['user@example.com']
      }
    };
    const validBody = JSON.stringify(validPayload);

    const validSignature = crypto
      .createHmac('sha256', 'test-secret')
      .update(validBody)
      .digest('hex');

    // Test 1: Missing signature
    const reqMissing = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: validBody,
      headers: {}
    });
    const resMissing = await POST(reqMissing);
    const bodyMissing = await resMissing.json();
    assert(resMissing.status === 401 && bodyMissing.error === 'Missing resend-signature header', 'Missing signature header');

    // Test 2: Invalid signature (wrong length)
    const reqInvalidLength = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: validBody,
      headers: {
        'resend-signature': 'invalid-short'
      }
    });
    const resInvalidLength = await POST(reqInvalidLength);
    const bodyInvalidLength = await resInvalidLength.json();
    assert(resInvalidLength.status === 401 && bodyInvalidLength.error === 'Invalid signature', 'Invalid signature length');

    // Test 3: Invalid signature (correct length but wrong content)
    const wrongSignature = crypto
      .createHmac('sha256', 'wrong-secret')
      .update(validBody)
      .digest('hex');
    const reqInvalidContent = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: validBody,
      headers: {
        'resend-signature': wrongSignature
      }
    });
    const resInvalidContent = await POST(reqInvalidContent);
    const bodyInvalidContent = await resInvalidContent.json();
    assert(resInvalidContent.status === 401 && bodyInvalidContent.error === 'Invalid signature', 'Invalid signature content');

    // Test 4: Valid signature
    const reqValid = new Request('http://localhost:3000/api/webhooks/resend', {
      method: 'POST',
      body: validBody,
      headers: {
        'resend-signature': validSignature
      }
    });
    const resValid = await POST(reqValid);
    const bodyValid = await resValid.json();
    assert(resValid.status === 200 && bodyValid.received === true, 'Valid signature');

  } catch (error) {
    console.error('Test execution failed:', error);
    allPassed = false;
  } finally {
    // Restore env var
    process.env.RESEND_WEBHOOK_SECRET = originalSecret;
  }

  if (!allPassed) {
    process.exit(1);
  } else {
    console.log('🎉 All resend-webhook tests passed!');
  }
}

runTests();

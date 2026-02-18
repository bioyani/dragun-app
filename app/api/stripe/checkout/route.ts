import Stripe from 'stripe';
import { supabaseAdmin } from '@/lib/supabase-admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
});

export async function POST(req: Request) {
  const { debtorId, amount, currency = 'usd' } = await req.json();

  // Validate inputs
  if (!debtorId || typeof debtorId !== 'string') {
    return new Response('Invalid request', { status: 400 });
  }
  if (typeof amount !== 'number' || amount <= 0 || !isFinite(amount)) {
    return new Response('Invalid amount', { status: 400 });
  }

  const { data: debtor } = await supabaseAdmin
    .from('debtors')
    .select('*, merchant:merchants(name, settlement_floor)')
    .eq('id', debtorId)
    .single();

  if (!debtor) {
    return new Response('Debtor not found', { status: 404 });
  }

  // Server-side validation: amount must not be less than the settlement floor
  const settlementFloor = debtor.total_debt * Math.max(0.7, debtor.merchant.settlement_floor);
  if (amount < settlementFloor * 0.99) {
    // 1% tolerance for floating point rounding
    return new Response('Amount below settlement floor', { status: 400 });
  }
  if (amount > debtor.total_debt * 1.01) {
    return new Response('Amount exceeds debt', { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: `Debt Settlement - ${debtor.merchant.name}`,
          },
          unit_amount: Math.round(amount * 100),
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_URL}/pay/${debtorId}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_URL}/chat/${debtorId}`,
    metadata: {
      debtor_id: debtorId,
      merchant_id: debtor.merchant_id,
    },
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' },
  });
}

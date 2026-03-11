import { createRouteClient } from '@/lib/supabase/route';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const DEFAULT_DASHBOARD = `/${routing.defaultLocale}/dashboard`;

function isOwnerEmail(email?: string | null) {
  const ownerEmail = process.env.OWNER_EMAIL?.trim().toLowerCase();
  return !!ownerEmail && !!email && email.trim().toLowerCase() === ownerEmail;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL after confirmation
  const next = searchParams.get('next') ?? DEFAULT_DASHBOARD;
  // Prevent open redirect: must be a relative path with no protocol-relative tricks
  const safeNext = /^\/(?!\/)/.test(next) ? next : DEFAULT_DASHBOARD;

  if (code) {
    const { supabase, finalizeResponse } = createRouteClient(request);
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Check if merchant record exists by ID
      let { data: merchant } = await supabase
        .from('merchants')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!merchant) {
        // Fallback: Check if merchant record exists by email
        const { data: existingByEmail } = await supabase
          .from('merchants')
          .select('id')
          .eq('email', user.email!)
          .single();

        if (existingByEmail) {
          // Update the ID to match the new auth ID
          await supabase
            .from('merchants')
            .update({ id: user.id })
            .eq('email', user.email!);
          merchant = { id: user.id };
        } else {
          // Create new record
          const { error: merchantError } = await supabase
            .from('merchants')
            .insert({
              id: user.id,
              email: user.email!,
              name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Merchant',
            });
          
          if (!merchantError) {
            merchant = { id: user.id };
            // Seed a sample debtor for the new merchant
            await supabase
              .from('debtors')
              .insert({
                merchant_id: user.id,
                name: 'John Sample',
                email: 'john@example.com',
                total_debt: 1250.00,
                currency: 'USD',
                status: 'pending'
              });
          } else {
            console.error('Error creating merchant record:', merchantError);
          }
        }
      }

      const { data: merchantData } = await supabase
        .from('merchants')
        .select('onboarding_complete, onboarding_completed')
        .eq('id', user.id)
        .single();

      const onboardingCompleted = merchantData?.onboarding_completed ?? merchantData?.onboarding_complete ?? false;
      const defaultPostLogin = isOwnerEmail(user.email)
        ? DEFAULT_DASHBOARD
        : onboardingCompleted
          ? DEFAULT_DASHBOARD
          : `/${routing.defaultLocale}/onboarding/profile`;
      const redirectPath = safeNext !== DEFAULT_DASHBOARD ? safeNext : defaultPostLogin;

      return finalizeResponse(`${origin}${redirectPath}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

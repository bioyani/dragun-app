import { createClient } from '@/lib/supabase/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in search params, use it as the redirection URL after confirmation
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && user) {
      // Check if merchant record exists, if not create it
      const { data: merchant } = await supabaseAdmin
        .from('merchants')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!merchant) {
        const { error: merchantError } = await supabaseAdmin
          .from('merchants')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Merchant',
          });
        
        if (!merchantError) {
          // Seed a sample debtor for the new merchant
          await supabaseAdmin
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

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

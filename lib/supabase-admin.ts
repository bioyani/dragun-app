import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

// During build time (static generation), these might be missing.
// We don't want to crash the build if they are.
const isBuild = process.env.NEXT_PHASE === 'phase-production-build';

// In non-build runtimes, fail *softly* instead of throwing so the app
// can render a graceful "closed / misconfigured" state instead of 500.
const hasAdminConfig = !!supabaseUrl && !!supabaseServiceRole;

if (!isBuild && !hasAdminConfig) {
  console.warn(
    '[supabase-admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Admin client will use a placeholder backend; dashboard features may be unavailable.',
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRole || 'service-role-placeholder',
);

export const hasSupabaseAdminConfig = hasAdminConfig;

export function validateEnv() {
  const required = [
    'NEXT_PUBLIC_URL',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'GOOGLE_GENERATIVE_AI_API_KEY',
    'STRIPE_SECRET_KEY',
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:
${missing.map((m) => ` - ${m}`).join('
')}`
    );
  }

  // specific checks
  if (!process.env.SUPABASE_URL?.startsWith('https://')) {
     console.warn('⚠️ SUPABASE_URL should start with https://');
  }
}

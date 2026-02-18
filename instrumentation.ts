export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { validateEnv } = await import('./lib/env');
    try {
      validateEnv();
    } catch (error) {
      console.error(error);
      // In production, we might want to exit, but in dev/build, just log
      if (process.env.NODE_ENV === 'production') {
         // process.exit(1); // Don't crash the build step on Vercel if envs are missing there (e.g. during build)
      }
    }
    await import('./sentry.server.config');
  }
  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('./sentry.edge.config');
  }
}

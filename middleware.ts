import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextMiddleware } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import arcjet, { detectBot, shield } from '@arcjet/next';

const intlMiddleware = createMiddleware(routing);

const arcjetKey = process.env.ARCJET_KEY;
const aj = arcjetKey
  ? arcjet({
      key: arcjetKey,
      rules: [
        shield({ mode: 'LIVE' }),
        detectBot({ mode: 'LIVE', allow: ['CATEGORY:SEARCH_ENGINE'] }),
      ],
    })
  : null;

const PROTECTED_PREFIXES = ['/dashboard', '/chat', '/pay', '/onboarding'];

function normalizePath(pathname: string) {
  return pathname.replace(/^\/(en|fr)(?=\/|$)/, '') || '/';
}

function isProtectedPath(pathname: string) {
  const normalized = normalizePath(pathname);
  return PROTECTED_PREFIXES.some((prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`));
}

function applySecurityHeaders(response: Response) {
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  return response;
}

const middleware: NextMiddleware = async (request) => {
  if (aj && isProtectedPath(request.nextUrl.pathname)) {
    const decision = await aj.protect(request);
    if (decision.isDenied()) {
      console.warn('[arcjet] denied request on protected page, allowing to fail open', {
        path: request.nextUrl.pathname,
        reason: decision.reason,
      });
    }
  }

  const supabaseResponse = await updateSession(request);
  if (supabaseResponse.status === 307 || supabaseResponse.status === 302) {
    return supabaseResponse;
  }

  const normalizedPath = normalizePath(request.nextUrl.pathname);
  if (normalizedPath.startsWith('/auth/')) {
    if (request.nextUrl.pathname !== normalizedPath) {
      const url = request.nextUrl.clone();
      url.pathname = normalizedPath;
      const response = NextResponse.redirect(url);
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        response.cookies.set(cookie.name, cookie.value, {
          ...cookie,
        });
      });
      return applySecurityHeaders(response);
    }

    return applySecurityHeaders(supabaseResponse);
  }

  const response = await intlMiddleware(request);

  supabaseResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie.name, cookie.value, {
      ...cookie,
    });
  });

  return applySecurityHeaders(response);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

export default middleware;

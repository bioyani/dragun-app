'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/auth';
import type { User } from '@supabase/supabase-js';
import { Globe } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    getUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => data.subscription.unsubscribe();
  }, [supabase.auth]);

  const switchLocale = (target: 'en' | 'fr') => {
    router.replace(pathname, { locale: target });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="section-shell">
        <nav className="flex h-20 items-center justify-between">
          <Link href="/" className="focus-ring rounded-md">
            <Logo className="h-8 w-auto" />
          </Link>

          <div className="hidden items-center gap-7 lg:flex">
            {[
              { label: t('features'), href: '/features' },
              { label: t('pricing'), href: '/pricing' },
              { label: t('faq'), href: '/faq' },
              { label: t('security'), href: '/legal' },
              { label: t('contact'), href: '/contact' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring rounded-md text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-2 rounded-md border border-border bg-card px-2 py-1.5 sm:flex">
              <Globe className="h-3.5 w-3.5 text-muted-foreground" />
              <button
                onClick={() => switchLocale('en')}
                className={cn(
                  'focus-ring rounded px-1.5 text-[10px] font-bold uppercase tracking-widest',
                  locale === 'en' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                EN
              </button>
              <span className="text-muted-foreground">/</span>
              <button
                onClick={() => switchLocale('fr')}
                className={cn(
                  'focus-ring rounded px-1.5 text-[10px] font-bold uppercase tracking-widest',
                  locale === 'fr' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                FR
              </button>
            </div>

            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'h-10' })}>
                  {t('dashboard')}
                </Link>
                <Button
                  onClick={async () => {
                    await signOut();
                    window.location.href = '/';
                  }}
                  size="sm"
                  className="h-10"
                >
                  {t('signOut')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/#demo"
                  className={buttonVariants({ variant: 'secondary', size: 'sm', className: 'hidden h-10 sm:inline-flex' })}
                >
                  {t('watchDemo')}
                </Link>
                <Link href="/login" className={buttonVariants({ size: 'sm', className: 'h-10' })}>
                  {t('startPilot')}
                </Link>
              </div>
            )}

            <Badge variant="outline" className="hidden lg:inline-flex">v1 pilot</Badge>
          </div>
        </nav>
      </div>
    </header>
  );
}

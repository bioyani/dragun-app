'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Settings, FileText, LogOut, ChevronDown, ShieldCheck, Wallet } from 'lucide-react';
import { createStripeConnectAccount, createStripeLoginLink } from '@/app/actions/stripe-connect';
import { signOut } from '@/app/actions/auth';

interface Props {
  merchantName: string;
  hasStripeAccount: boolean;
  isOnboardingComplete: boolean;
  locale: string;
}

export default function DashboardTopNav({ merchantName, hasStripeAccount, isOnboardingComplete, locale }: Props) {
  const t = useTranslations('Dashboard');
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const initials = merchantName.substring(0, 2).toUpperCase();

  return (
    <div className="flex items-center gap-3">
      <div className="hidden items-center rounded-full border border-border bg-card px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:flex">
        <div className="mr-2 h-1.5 w-1.5 rounded-full bg-foreground" />
        {merchantName}
      </div>

      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="group flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 outline-none transition-colors hover:bg-accent"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background text-[10px] font-black tracking-tight text-foreground">
            {initials}
          </div>
          <ChevronDown className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-popover py-1 shadow-elev-2">
            <div className="border-b border-border px-4 py-3">
              <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">{merchantName}</p>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{t('merchant')}</p>
              </div>
            </div>

            <div className="space-y-1 p-1.5">
              <a
                href="#settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <Settings className="h-4 w-4" />
                <span>{t('agentParams')}</span>
              </a>

              <a
                href="#knowledge"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <FileText className="h-4 w-4" />
                <span>{t('ragContext')}</span>
              </a>

              {isOnboardingComplete ? (
                <form action={createStripeLoginLink}>
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>Stripe Dashboard</span>
                  </button>
                </form>
              ) : hasStripeAccount ? (
                <form action={createStripeConnectAccount}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                    <Wallet className="h-4 w-4" />
                    <span>Resume Setup</span>
                  </button>
                </form>
              ) : (
                <form action={createStripeConnectAccount}>
                  <input type="hidden" name="locale" value={locale} />
                  <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-accent">
                    <Wallet className="h-4 w-4" />
                    <span>Connect Stripe</span>
                  </button>
                </form>
              )}

              <div className="my-1 h-px bg-border" />

              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/';
                }}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span>{t('backToSite')}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

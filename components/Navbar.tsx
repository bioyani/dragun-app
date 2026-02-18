'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import ThemeToggle from '@/components/ThemeToggle';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const isFrench = locale.startsWith('fr');

  const switchLocale = (target: 'en' | 'fr-CA') => {
    router.replace(pathname, { locale: target });
  };

  return (
    <div className="sticky top-0 z-50 px-6 py-4">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3 rounded-2xl border border-base-content/5 bg-base-100/50 backdrop-blur-xl shadow-2xl">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-bold text-base-content shadow-[0_0_20px_rgba(59,130,246,0.5)] group-hover:scale-110 transition-transform">
            🐲
          </div>
          <span className="text-xl font-bold tracking-tighter text-base-content">Dragun<span className="text-primary">.app</span></span>
        </Link>
        <div className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-widest text-base-content/60">
          <Link href="/features" className="hover:text-base-content transition-colors">{t('features')}</Link>
          <Link href="/pricing" className="hover:text-base-content transition-colors">{t('pricing')}</Link>
          <Link href="/faq" className="hover:text-base-content transition-colors">{t('faq')}</Link>
          <Link href="/contact" className="hover:text-base-content transition-colors">{t('contact')}</Link>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest">
            <button
              onClick={() => switchLocale('en')}
              className={`transition-colors ${!isFrench ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/80'}`}
            >
              EN
            </button>
            <span className="text-base-content/30">|</span>
            <button
              onClick={() => switchLocale('fr-CA')}
              className={`transition-colors ${isFrench ? 'text-base-content' : 'text-base-content/50 hover:text-base-content/80'}`}
            >
              FR
            </button>
          </div>
          <Link href="/dashboard" className="btn btn-primary btn-sm rounded-xl px-6 h-10 min-h-0 shadow-[0_0_15px_rgba(59,130,246,0.3)] border-none text-[11px] font-bold uppercase tracking-widest">
            {t('dashboard')}
          </Link>
        </div>
      </nav>
    </div>
  );
}

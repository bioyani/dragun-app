'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link, useRouter, usePathname } from '@/i18n/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/app/actions/auth';
import { User } from '@supabase/supabase-js';
import { Globe } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const isFrench = locale.startsWith('fr');

  const switchLocale = (target: 'en' | 'fr-CA') => {
    router.replace(pathname, { locale: target });
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-6 py-8 pointer-events-none pt-[env(safe-area-inset-top,2rem)] pl-[env(safe-area-inset-left,1.5rem)] pr-[env(safe-area-inset-right,1.5rem)]">
      <nav className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-xl flex items-center justify-center font-bold text-[#D4AF37] shadow-2xl relative transition-all group-hover:scale-110 group-hover:border-[#D4AF37]/30">
            <div className="absolute inset-0 bg-[#D4AF37]/10 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 text-[10px] font-black uppercase tracking-tighter">DRGN</span>
          </div>
          <span className="text-xl font-black tracking-[0.2em] text-white uppercase hidden sm:block">
            DRAGUN<span className="text-[#D4AF37]">.</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { label: t('features'), href: '/features' },
            { label: t('pricing'), href: '/pricing' },
            { label: t('faq'), href: '/faq' },
            { label: t('contact'), href: '/contact' },
          ].map((link) => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-[#D4AF37] transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-4 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5">
             <Globe className="w-3.5 h-3.5 text-white/20" />
             <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest">
                <button
                  onClick={() => switchLocale('en')}
                  className={`transition-colors ${!isFrench ? 'text-[#D4AF37]' : 'text-white/20 hover:text-white/40'}`}
                >
                  EN
                </button>
                <span className="text-white/10">|</span>
                <button
                  onClick={() => switchLocale('fr-CA')}
                  className={`transition-colors ${isFrench ? 'text-[#D4AF37]' : 'text-white/20 hover:text-white/40'}`}
                >
                  FR
                </button>
             </div>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link 
                href="/dashboard" 
                className="h-10 px-6 rounded-xl bg-white/[0.05] border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all flex items-center"
              >
                {t('dashboard')}
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  window.location.href = '/';
                }}
                className="h-10 px-6 rounded-xl bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl shadow-[#D4AF37]/10"
              >
                {t('signOut')}
              </button>
            </div>
          ) : (
            <Link 
              href="/login" 
              className="h-10 px-8 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-2xl flex items-center"
            >
              {t('signIn')}
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

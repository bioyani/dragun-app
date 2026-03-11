'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Logo from '@/components/Logo';
import { LayoutDashboard, ArrowRight, Activity, Receipt } from 'lucide-react';

export default function PortalPage() {
  const t = useTranslations('Portal');

  const apps = [
    {
      id: 'dragun',
      title: t('dragunTitle'),
      description: t('dragunDesc'),
      icon: <LayoutDashboard className="w-8 h-8" />,
      href: '/dashboard',
      status: 'active',
      badge: 'Live',
    },
    {
      id: 'flow',
      title: t('flowTitle'),
      description: t('flowDesc'),
      icon: <Activity className="w-8 h-8" />,
      href: '#',
      status: 'coming_soon',
      badge: t('comingSoon'),
    },
    {
      id: 'taxes',
      title: t('taxesTitle'),
      description: t('taxesDesc'),
      icon: <Receipt className="w-8 h-8" />,
      href: '#',
      status: 'coming_soon',
      badge: t('comingSoon'),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-base-100 relative">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full" />
      </div>

      <header className="p-6 flex items-center justify-between border-b border-base-300/50 bg-base-100/80 backdrop-blur-md">
        <Link href="/" className="flex items-center">
          <Logo className="h-8 w-auto" />
        </Link>
        <div className="flex items-center gap-4">
           {/* Add user profile or settings dropdown if needed later */}
           <span className="text-sm text-base-content/60 font-medium tracking-wide uppercase">Meziani AI Labs Portal</span>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center p-6 sm:p-12">
        <div className="text-center mb-12 max-w-2xl mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-base-content mb-3">
            {t('welcome')}
          </h1>
          <p className="text-base-content/60 text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
          {apps.map((app) => (
            <div
              key={app.id}
              className={`card bg-base-200/50 border border-base-300/50 shadow-elevated transition-all duration-300 ${
                app.status === 'active' 
                  ? 'hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer' 
                  : 'opacity-70 grayscale-[0.5]'
              }`}
            >
              <div className="card-body p-6 sm:p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 rounded-2xl ${app.status === 'active' ? 'bg-primary/10 text-primary' : 'bg-base-300/50 text-base-content/50'}`}>
                    {app.icon}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    app.status === 'active' ? 'bg-success/10 text-success' : 'bg-base-300 text-base-content/50'
                  }`}>
                    {app.badge}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold mb-2">{app.title}</h2>
                <p className="text-base-content/60 text-sm flex-1 mb-8">
                  {app.description}
                </p>

                {app.status === 'active' ? (
                  <Link href={app.href} className="btn btn-primary w-full gap-2">
                    {t('launch')}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <button disabled className="btn btn-disabled w-full">
                    {t('launch')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

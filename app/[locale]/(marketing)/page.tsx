import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Bot, ShieldCheck, Zap, BarChart3, Globe } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Home');

  return (
    <div className="relative isolate overflow-hidden">
      {/* Mesh Gradient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-32 md:pb-32 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-base-300 bg-base-200/50 backdrop-blur-md text-base-content/80 text-[10px] font-bold tracking-widest uppercase mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          {t('badge')}
        </div>

        <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[0.9] mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500">
          {t('heroLine1')} <br />
          <span className="italic font-serif">{t('heroLine2')}</span>
        </h1>

        <p className="text-base md:text-xl text-base-content/60 max-w-xl mx-auto leading-relaxed mb-10">
          {t('heroParagraph')}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/dashboard" className="btn btn-primary h-14 px-8 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.3)] text-base group">
            {t('launchAgent')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="btn btn-ghost h-14 px-8 rounded-2xl border border-base-300 bg-base-200/30 backdrop-blur-sm text-base">
            {t('howItWorks')}
          </Link>
        </div>

        {/* Bento Grid Preview */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-12 gap-4 w-full max-w-6xl">
          {/* Main Agent Interface */}
          <div className="md:col-span-8 group relative rounded-3xl border border-base-300 bg-base-100/50 backdrop-blur-xl p-1 overflow-hidden transition-all hover:border-primary/50">
            <div className="bg-base-200/50 rounded-[1.4rem] p-6 h-[400px] flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-bold text-base-content shadow-lg shadow-primary/20">🐲</div>
                  <div>
                    <div className="text-sm font-bold text-base-content uppercase tracking-tighter">{t('agentName')}</div>
                    <div className="text-[10px] text-success font-medium flex items-center gap-1">
                      <div className="w-1 h-1 bg-success rounded-full"></div> {t('agentStatus')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-base-300"></div>
                  <div className="w-2 h-2 rounded-full bg-base-300"></div>
                </div>
              </div>

              <div className="space-y-4 flex-1 overflow-hidden">
                <div className="chat chat-start">
                  <div className="chat-bubble bg-base-300/50 border border-base-300 text-xs">{t('chatBubble1')}</div>
                </div>
                <div className="chat chat-end animate-pulse">
                  <div className="chat-bubble bg-primary text-xs shadow-lg shadow-primary/20">{t('chatBubble2')}</div>
                </div>
                <div className="chat chat-start">
                  <div className="chat-bubble bg-base-300/50 border border-base-300 text-xs">{t('chatBubble3')}</div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <div className="h-8 flex-1 bg-base-300/50 rounded-lg border border-base-300"></div>
                <div className="h-8 w-8 bg-primary rounded-lg"></div>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="md:col-span-4 grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-base-300 bg-base-200/40 p-6 flex flex-col justify-between group hover:bg-base-200/60 transition-colors">
              <Zap className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-3xl font-black text-base-content">82%</div>
                <div className="text-xs text-base-content/50 font-bold uppercase tracking-widest">{t('recoveryRateLabel')}</div>
              </div>
            </div>
            <div className="rounded-3xl border border-base-300 bg-base-200/40 p-6 flex flex-col justify-between group hover:bg-base-200/60 transition-colors">
              <Bot className="w-8 h-8 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
              <div>
                <div className="text-3xl font-black text-base-content">2.1s</div>
                <div className="text-xs text-base-content/50 font-bold uppercase tracking-widest">{t('latencyLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 border-t border-base-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-base-content">{t('legalTitle')}</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">{t('legalDesc')}</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-base-content">{t('stripeTitle')}</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">{t('stripeDesc')}</p>
            </div>
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-base-content">{t('knowledgeTitle')}</h3>
              <p className="text-base-content/60 text-sm leading-relaxed">{t('knowledgeDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-b from-primary to-blue-700 p-12 md:p-24 text-center space-y-8 relative overflow-hidden shadow-2xl shadow-primary/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-[100px] rounded-full"></div>
          <h2 className="text-4xl md:text-6xl font-black text-base-content tracking-tight leading-none">
            {t('ctaTitle1')} <br /> {t('ctaTitle2')}
          </h2>
          <p className="text-primary-content/80 text-lg max-w-xl mx-auto">
            {t('ctaSubtitle')}
          </p>
          <div className="pt-4">
            <Link href="/dashboard" className="btn bg-white text-primary border-none hover:bg-base-200 h-16 px-12 rounded-2xl text-lg font-bold">
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

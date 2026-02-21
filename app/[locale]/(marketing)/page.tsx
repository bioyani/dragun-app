import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Bot, ShieldCheck, Zap, BarChart3, Globe, Sparkles, ChevronRight } from 'lucide-react';

export default function LandingPage() {
  const t = useTranslations('Home');

  return (
    <div className="relative isolate bg-[#050505]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#6419E6]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_70%)]"></div>
      </div>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-20 md:pt-40 md:pb-40 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          {t('badge')}
        </div>

        <h1 className="text-6xl md:text-[120px] font-black tracking-[-0.04em] leading-[0.85] mb-12 text-white uppercase group">
          <span className="block">{t('heroLine1')}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-white to-[#D4AF37] bg-[length:200%_auto] animate-gradient-x italic font-serif tracking-tight lowercase mt-2">
            {t('heroLine2')}
          </span>
        </h1>

        <p className="text-base md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed mb-16 font-medium tracking-tight">
          {t('heroParagraph')}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
          <Link href="/dashboard" className="h-16 px-12 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#D4AF37] transition-all active:scale-95 shadow-[0_20px_40px_rgba(0,0,0,0.5)] group">
            {t('launchAgent')}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/about" className="h-16 px-12 rounded-2xl bg-white/[0.03] border border-white/10 text-white font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center hover:bg-white/[0.08] transition-all active:scale-95">
            {t('howItWorks')}
          </Link>
        </div>

        {/* Bento Grid Preview */}
        <div className="mt-40 grid grid-cols-1 md:grid-cols-12 gap-8 w-full max-w-6xl relative">
          <div className="absolute -inset-4 bg-[#D4AF37]/5 blur-[100px] rounded-full pointer-events-none opacity-50"></div>
          
          {/* Main Agent Interface */}
          <div className="md:col-span-8 group relative rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-[#D4AF37]/30 shadow-2xl">
            <div className="bg-white/[0.02] rounded-[2.8rem] p-8 md:p-10 h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-12">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl flex items-center justify-center text-[#D4AF37] shadow-2xl relative">
                    <div className="absolute inset-0 bg-[#D4AF37]/10 blur-lg" />
                    <span className="relative z-10 text-[10px] font-black">DRGN</span>
                  </div>
                  <div>
                    <div className="text-xs font-black text-white uppercase tracking-[0.2em]">{t('agentName')}</div>
                    <div className="text-[9px] text-[#10b981] font-black flex items-center gap-1.5 uppercase tracking-widest mt-1">
                      <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse"></div> {t('agentStatus')}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                   <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-black text-white/20 uppercase tracking-widest">ENCRYPTED</div>
                </div>
              </div>

              <div className="space-y-6 flex-1 overflow-hidden">
                <div className="flex justify-start">
                   <div className="max-w-[80%] bg-white/[0.05] border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-white/60 leading-relaxed font-medium">
                     {t('chatBubble1')}
                   </div>
                </div>
                <div className="flex justify-end">
                   <div className="max-w-[80%] bg-white text-black p-4 rounded-2xl rounded-tr-none text-xs font-bold shadow-2xl">
                     {t('chatBubble2')}
                   </div>
                </div>
                <div className="flex justify-start">
                   <div className="max-w-[80%] bg-white/[0.05] border border-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-white/60 leading-relaxed font-medium">
                     {t('chatBubble3')}
                   </div>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <div className="h-12 flex-1 bg-white/[0.03] rounded-xl border border-white/5 px-4 flex items-center text-white/10 text-xs font-bold uppercase tracking-widest">
                  Secure messaging protocol...
                </div>
                <div className="h-12 w-12 bg-[#D4AF37] rounded-xl flex items-center justify-center text-black">
                   <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>

          {/* Side Stats */}
          <div className="md:col-span-4 grid grid-cols-1 gap-8">
            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 flex flex-col justify-between group hover:bg-white/[0.05] transition-all hover:border-[#D4AF37]/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-20 h-20 text-[#D4AF37]" />
              </div>
              <Zap className="w-10 h-10 text-[#D4AF37] mb-6 relative z-10" />
              <div className="relative z-10">
                <div className="text-5xl font-black text-white tracking-tighter mb-1">82%</div>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{t('recoveryRateLabel')}</div>
              </div>
            </div>
            <div className="rounded-[3rem] border border-white/5 bg-white/[0.02] p-10 flex flex-col justify-between group hover:bg-white/[0.05] transition-all hover:border-[#6419E6]/20 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Bot className="w-20 h-20 text-[#6419E6]" />
              </div>
              <Bot className="w-10 h-10 text-[#6419E6] mb-6 relative z-10" />
              <div className="relative z-10">
                <div className="text-5xl font-black text-white tracking-tighter mb-1">2.1s</div>
                <div className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em]">{t('latencyLabel')}</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-40 border-t border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-24">
            {[
              { icon: ShieldCheck, title: t('legalTitle'), desc: t('legalDesc'), color: '#D4AF37' },
              { icon: Globe, title: t('stripeTitle'), desc: t('stripeDesc'), color: '#6419E6' },
              { icon: BarChart3, title: t('knowledgeTitle'), desc: t('knowledgeDesc'), color: '#3abff8' }
            ].map((feature, i) => (
              <div key={i} className="space-y-8 group">
                <div className="w-16 h-16 rounded-[2rem] bg-white/[0.03] border border-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-white/20">
                  <feature.icon className="w-7 h-7" style={{ color: feature.color }} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 px-6 relative">
        <div className="max-w-6xl mx-auto rounded-[4rem] bg-gradient-to-br from-[#1a1a1a] to-[#050505] border border-white/5 p-16 md:p-32 text-center space-y-12 relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
          <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D4AF37]/10 blur-[120px] rounded-full"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#6419E6]/10 blur-[120px] rounded-full"></div>
          
          <div className="space-y-6 relative z-10">
            <h2 className="text-5xl md:text-8xl font-black text-white tracking-tight uppercase leading-none">
              {t('ctaTitle1')} <br /> <span className="text-[#D4AF37]">{t('ctaTitle2')}</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl max-w-2xl mx-auto font-medium tracking-tight">
              {t('ctaSubtitle')}
            </p>
          </div>
          
          <div className="pt-8 relative z-10">
            <Link href="/dashboard" className="h-20 px-16 rounded-2xl bg-white text-black hover:bg-[#D4AF37] hover:text-black transition-all active:scale-95 text-sm font-black uppercase tracking-[0.3em] inline-flex items-center shadow-2xl">
              {t('ctaButton')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Decoration */}
      <div className="py-20 text-center opacity-10">
         <p className="text-[10px] font-black uppercase tracking-[1em] text-white">WORLD CLASS INFRASTRUCTURE • DRAGUN TECHNOLOGIES</p>
      </div>
    </div>
  );
}

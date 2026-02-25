import { useTranslations } from 'next-intl';
import { Sparkles, Check } from 'lucide-react';

export default function PricingPage() {
  const t = useTranslations('Pricing');

  return (
    <main className="relative isolate bg-[#0b1b2b] min-h-screen text-white overflow-hidden">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2fbf9a]/10 blur-[120px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_70%)]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-12">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          {t('titleHighlight')} PLANS
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none mb-8 text-white uppercase text-center">
          {t('title')} <span className="italic font-serif tracking-tight lowercase text-[#D4AF37]">{t('titleHighlight')}</span>
        </h1>
        
        <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-24 font-medium tracking-tight text-center">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {/* Starter */}
          <div className="group relative rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-white/10 shadow-2xl flex flex-col">
            <div className="bg-white/[0.02] rounded-[2.8rem] p-10 h-full flex flex-col space-y-10">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{t('starter.name')}</div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-widest">{t('starter.description')}</div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">{t('starter.price')}</span>
                <span className="text-xs font-bold text-white/20 uppercase tracking-widest">{t('perMonth')}</span>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <ul className="space-y-5 flex-1">
                {[t('starter.feature1'), t('starter.feature2'), t('starter.feature3')].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-bold text-white/60 tracking-tight uppercase">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                       <Check className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="h-16 w-full rounded-2xl bg-white/[0.05] border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
                {t('starter.cta')}
              </button>
            </div>
          </div>

          {/* Pro - Recommended */}
          <div className="group relative rounded-[3rem] border border-[#D4AF37]/30 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-[#D4AF37]/50 shadow-[0_0_50px_rgba(212,175,55,0.1)] flex flex-col scale-105 z-10">
            <div className="absolute top-0 right-0 px-6 py-2 bg-[#D4AF37] text-black text-[10px] font-black uppercase tracking-widest rounded-bl-[2rem]">{t('popular')}</div>
            <div className="bg-white/[0.03] rounded-[2.8rem] p-10 h-full flex flex-col space-y-10">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{t('pro.name')}</div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-widest">{t('pro.description')}</div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-white">{t('pro.price')}</span>
                <span className="text-xs font-bold text-white/20 uppercase tracking-widest">{t('perMonth')}</span>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <ul className="space-y-5 flex-1">
                {[t('pro.feature1'), t('pro.feature2'), t('pro.feature3'), t('pro.feature4')].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-bold text-white uppercase tracking-tight">
                    <div className="w-5 h-5 rounded-full bg-[#D4AF37]/20 flex items-center justify-center border border-[#D4AF37]/30">
                       <Check className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="h-16 w-full rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center hover:bg-[#D4AF37] transition-all active:scale-95 shadow-2xl">
                {t('pro.cta')}
              </button>
            </div>
          </div>

          {/* Enterprise */}
          <div className="group relative rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-white/10 shadow-2xl flex flex-col">
            <div className="bg-white/[0.02] rounded-[2.8rem] p-10 h-full flex flex-col space-y-10">
              <div className="space-y-2">
                <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.3em]">{t('enterprise.name')}</div>
                <div className="text-xs text-white/40 font-medium uppercase tracking-widest">{t('enterprise.description')}</div>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white uppercase">{t('enterprise.price')}</span>
              </div>

              <div className="h-px bg-white/5 w-full" />

              <ul className="space-y-5 flex-1">
                {[t('enterprise.feature1'), t('enterprise.feature2'), t('enterprise.feature3'), t('enterprise.feature4')].map((f, i) => (
                  <li key={i} className="flex items-center gap-4 text-xs font-bold text-white/60 tracking-tight uppercase">
                    <div className="w-5 h-5 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                       <Check className="w-3 h-3 text-[#D4AF37]" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <button className="h-16 w-full rounded-2xl bg-white/[0.05] border border-white/10 text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
                {t('enterprise.cta')}
              </button>
            </div>
          </div>
        </div>

        {/* Global Fee Notice */}
        <div className="mt-32 p-12 rounded-[3rem] border border-white/5 bg-white/[0.02] max-w-4xl w-full text-center space-y-4">
           <div className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.4em]">Global Platform Protocol</div>
           <p className="text-white/40 text-sm font-medium tracking-tight leading-relaxed max-w-2xl mx-auto">
             Dragun operates on a performance-based resolution model. A <span className="text-white font-bold tracking-widest">5% PLATFORM FEE</span> applies only to successfully recovered funds. No recovery, no fee. Secure gateway payments processed via Stripe Connect.
           </p>
        </div>
      </div>
    </main>
  );
}

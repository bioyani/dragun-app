import { useTranslations } from 'next-intl';
import { Bot, FileText, BadgeDollarSign, Sparkles } from 'lucide-react';

export default function FeaturesPage() {
  const t = useTranslations('Features');

  return (
    <main className="relative isolate min-h-screen text-white overflow-hidden bg-[#0b1b2b]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2fbf9a]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-12">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          Platform Capabilities
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none mb-8 text-white uppercase text-center">
          {t('title')} <span className="italic font-serif tracking-tight lowercase text-[#D4AF37]">{t('titleHighlight')}</span>
        </h1>
        
        <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-24 font-medium tracking-tight text-center">
          {t('subtitle')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {[
            { icon: Bot, title: t('geminiTitle'), desc: t('geminiDesc'), color: '#D4AF37' },
            { icon: FileText, title: t('contractTitle'), desc: t('contractDesc'), color: '#6419E6' },
            { icon: BadgeDollarSign, title: t('stripeTitle'), desc: t('stripeDesc'), color: '#3abff8' }
          ].map((feature, i) => (
            <div key={i} className="group relative rounded-[3rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl p-1 overflow-hidden transition-all hover:border-white/10 shadow-2xl flex flex-col">
              <div className="bg-white/[0.02] rounded-[2.8rem] p-10 h-full flex flex-col space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all group-hover:scale-110 group-hover:border-white/20">
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest">{feature.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed font-medium">{feature.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

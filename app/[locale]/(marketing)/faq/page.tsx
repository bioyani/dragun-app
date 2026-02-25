import { useTranslations } from 'next-intl';
import { Sparkles, HelpCircle, ChevronRight } from 'lucide-react';

export default function FAQPage() {
  const t = useTranslations('FAQ');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <main className="relative isolate min-h-screen text-white overflow-hidden selection:bg-[#D4AF37] selection:text-black bg-[#0b1b2b]">
      {/* Premium Ambient Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#D4AF37]/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#2fbf9a]/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-40 flex flex-col items-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] backdrop-blur-xl text-white/40 text-[10px] font-black tracking-[0.3em] uppercase mb-12">
          <Sparkles className="w-3 h-3 text-[#D4AF37]" />
          Knowledge Base
        </div>

        <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] leading-none mb-8 text-white uppercase text-center">
          {t('title')} <span className="italic font-serif tracking-tight lowercase text-[#D4AF37]">{t('titleHighlight')}</span>
        </h1>
        
        <p className="text-base md:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed mb-24 font-medium tracking-tight text-center">
          {t('subtitle')}
        </p>

        <div className="w-full max-w-4xl space-y-6">
          {faqs.map((faq, i) => (
            <div key={i} className="group relative rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-3xl overflow-hidden transition-all hover:border-white/10 shadow-2xl">
               <details className="group/details cursor-pointer">
                  <summary className="list-none p-10 flex items-center justify-between">
                     <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#D4AF37]">
                           <HelpCircle className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none">{faq.q}</h3>
                     </div>
                     <ChevronRight className="w-5 h-5 text-white/20 transition-transform group-open/details:rotate-90 group-hover:text-white" />
                  </summary>
                  <div className="px-10 pb-10 pt-2 border-t border-white/5">
                     <p className="text-white/40 text-sm leading-relaxed font-medium max-w-2xl">{faq.a}</p>
                  </div>
               </details>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

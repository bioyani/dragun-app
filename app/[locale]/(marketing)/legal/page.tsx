import { useTranslations } from 'next-intl';

export default function LegalPage() {
  const t = useTranslations('Legal');

  const sections = [
    { title: t('privacyTitle'), content: t('privacyContent') },
    { title: t('tosTitle'), content: t('tosContent') },
    { title: t('complianceTitle'), content: t('complianceContent') },
  ];

  return (
    <main className="relative isolate min-h-screen bg-[#0b1b2b] text-white overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[60%] h-[60%] bg-[#d4af37]/10 blur-[140px] rounded-full"></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[55%] h-[55%] bg-[#2fbf9a]/10 blur-[140px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05)_0%,transparent_60%)]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-32 pb-36 space-y-12 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-xl text-white/60 text-[10px] font-black tracking-[0.3em] uppercase mx-auto">
            {t('badge')}
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-[-0.04em] leading-none text-white uppercase">
            {t('title')} <span className="italic font-serif tracking-tight lowercase text-[#d4af37]">{t('titleHighlight')}</span>
          </h1>
          <p className="text-base md:text-lg text-white/60 max-w-3xl mx-auto leading-relaxed font-medium tracking-tight">
            {t('subtitle')}
          </p>
        </div>

        <div className="space-y-8 pt-12">
          {sections.map((section, i) => (
            <div key={i} className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 space-y-4 shadow-xl">
              <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-widest">{section.title}</h2>
              <p className="text-white/60 leading-relaxed text-sm font-medium">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

import { useTranslations } from 'next-intl';

export default function LegalPage() {
  const t = useTranslations('Legal');

  const sections = [
    { title: t('privacyTitle'), content: t('privacyContent') },
    { title: t('tosTitle'), content: t('tosContent') },
    { title: t('complianceTitle'), content: t('complianceContent') },
  ];

  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
        </h1>
        <p className="text-lg text-base-content/60">
          {t('subtitle')}
        </p>
      </div>

      <div className="space-y-8 pt-12">
        {sections.map((section, i) => (
          <div key={i} className="card bg-base-200/50 border border-base-300 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-base-content">{section.title}</h2>
            <p className="text-base-content/60 leading-relaxed text-sm">{section.content}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

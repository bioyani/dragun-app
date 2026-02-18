import { useTranslations } from 'next-intl';

export default function FAQPage() {
  const t = useTranslations('FAQ');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
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

      <div className="space-y-4 pt-12">
        {faqs.map((faq, i) => (
          <div key={i} className="collapse collapse-plus bg-base-200/50 border border-base-300">
            <input type="radio" name="my-accordion-3" defaultChecked={i === 0} />
            <div className="collapse-title text-xl font-medium text-base-content">
              {faq.q}
            </div>
            <div className="collapse-content text-base-content/60">
              <p>{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

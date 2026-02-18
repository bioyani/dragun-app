import { useTranslations } from 'next-intl';

export default function PricingPage() {
  const t = useTranslations('Pricing');

  return (
    <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')} <span className="text-primary">{t('titleHighlight')}</span> {t('titleEnd')}
        </h1>
        <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-12">
        {/* Starter */}
        <div className="card bg-base-200/50 border border-base-300 p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold">{t('starter.name')}</h3>
            <p className="text-base-content/60 text-sm">{t('starter.description')}</p>
          </div>
          <div className="text-4xl font-extrabold">{t('starter.price')}<span className="text-lg font-normal text-base-content/50">{t('perMonth')}</span></div>
          <ul className="space-y-3 text-sm text-base-content/60">
            <li className="flex items-center gap-2">✅ {t('starter.feature1')}</li>
            <li className="flex items-center gap-2">✅ {t('starter.feature2')}</li>
            <li className="flex items-center gap-2">✅ {t('starter.feature3')}</li>
          </ul>
          <button className="btn btn-outline btn-block rounded-xl">{t('starter.cta')}</button>
        </div>

        {/* Pro */}
        <div className="card bg-primary/10 border border-primary/50 p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-primary text-base-content text-[10px] px-3 py-1 font-bold uppercase tracking-widest rounded-bl-lg">{t('popular')}</div>
          <div>
            <h3 className="text-xl font-bold">{t('pro.name')}</h3>
            <p className="text-base-content/60 text-sm">{t('pro.description')}</p>
          </div>
          <div className="text-4xl font-extrabold">{t('pro.price')}<span className="text-lg font-normal text-base-content/50">{t('perMonth')}</span></div>
          <ul className="space-y-3 text-sm text-base-content/80">
            <li className="flex items-center gap-2">✅ {t('pro.feature1')}</li>
            <li className="flex items-center gap-2">✅ {t('pro.feature2')}</li>
            <li className="flex items-center gap-2">✅ {t('pro.feature3')}</li>
            <li className="flex items-center gap-2">✅ {t('pro.feature4')}</li>
          </ul>
          <button className="btn btn-primary btn-block rounded-xl shadow-lg shadow-primary/20">{t('pro.cta')}</button>
        </div>

        {/* Enterprise */}
        <div className="card bg-base-200/50 border border-base-300 p-8 space-y-6">
          <div>
            <h3 className="text-xl font-bold">{t('enterprise.name')}</h3>
            <p className="text-base-content/60 text-sm">{t('enterprise.description')}</p>
          </div>
          <div className="text-4xl font-extrabold">{t('enterprise.price')}</div>
          <ul className="space-y-3 text-sm text-base-content/60">
            <li className="flex items-center gap-2">✅ {t('enterprise.feature1')}</li>
            <li className="flex items-center gap-2">✅ {t('enterprise.feature2')}</li>
            <li className="flex items-center gap-2">✅ {t('enterprise.feature3')}</li>
            <li className="flex items-center gap-2">✅ {t('enterprise.feature4')}</li>
          </ul>
          <button className="btn btn-outline btn-block rounded-xl">{t('enterprise.cta')}</button>
        </div>
      </div>
    </main>
  );
}

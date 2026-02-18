import { useTranslations } from 'next-intl';

export default function FeaturesPage() {
  const t = useTranslations('Features');

  return (
    <main className="max-w-5xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
          {t('title')} <span className="text-primary">{t('titleHighlight')}</span>
        </h1>
        <p className="text-lg text-base-content/60 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 pt-12">
        <div className="card bg-base-200/50 border border-base-300 p-6 space-y-4">
          <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">🤖</div>
          <h3 className="text-xl font-bold">{t('geminiTitle')}</h3>
          <p className="text-base-content/60 text-sm">{t('geminiDesc')}</p>
        </div>
        <div className="card bg-base-200/50 border border-base-300 p-6 space-y-4">
          <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center text-2xl">📄</div>
          <h3 className="text-xl font-bold">{t('contractTitle')}</h3>
          <p className="text-base-content/60 text-sm">{t('contractDesc')}</p>
        </div>
        <div className="card bg-base-200/50 border border-base-300 p-6 space-y-4">
          <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center text-2xl">💰</div>
          <h3 className="text-xl font-bold">{t('stripeTitle')}</h3>
          <p className="text-base-content/60 text-sm">{t('stripeDesc')}</p>
        </div>
      </div>
    </main>
  );
}

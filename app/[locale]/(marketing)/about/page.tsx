import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <main className="max-w-3xl mx-auto px-6 pt-20 pb-32 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-base-content">
          {t('title')} <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{t('titleHighlight')}</span>
        </h1>
        <p className="text-lg text-base-content/60 leading-relaxed">
          {t('paragraph')}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 pt-12">
        <div className="card bg-base-200/50 border border-base-300 p-8 space-y-4">
          <h3 className="text-xl font-bold text-base-content">{t('speedTitle')}</h3>
          <p className="text-base-content/60 text-sm">{t('speedDesc')}</p>
        </div>
        <div className="card bg-base-200/50 border border-base-300 p-8 space-y-4">
          <h3 className="text-xl font-bold text-base-content">{t('foundedTitle')}</h3>
          <p className="text-base-content/60 text-sm">{t('foundedDesc')}</p>
        </div>
      </div>
    </main>
  );
}

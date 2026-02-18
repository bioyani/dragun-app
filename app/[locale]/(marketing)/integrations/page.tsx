import { useTranslations } from 'next-intl';

export default function IntegrationsPage() {
  const t = useTranslations('Integrations');

  const integrations = [
    { name: 'Stripe', description: t('stripeDesc'), status: 'Active', icon: '💳' },
    { name: 'Supabase', description: t('supabaseDesc'), status: 'Active', icon: '⚡' },
    { name: 'Gemini 2.0 Flash', description: t('geminiDesc'), status: 'Active', icon: '🐉' },
    { name: t('mindbodyName'), description: t('mindbodyDesc'), status: 'Upcoming', icon: '🧘' },
  ];

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

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 pt-12">
        {integrations.map((integration, i) => (
          <div key={i} className="card bg-base-200/50 border border-base-300 p-6 space-y-4 relative overflow-hidden">
            {integration.status === 'Upcoming' && (
              <div className="absolute top-0 right-0 bg-accent/20 text-accent text-[8px] px-2 py-1 font-bold uppercase tracking-widest rounded-bl-lg">
                {t('upcoming')}
              </div>
            )}
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center text-2xl">{integration.icon}</div>
            <h3 className="text-xl font-bold text-base-content">{integration.name}</h3>
            <p className="text-base-content/60 text-xs leading-relaxed">{integration.description}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

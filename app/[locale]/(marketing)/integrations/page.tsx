import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function IntegrationsPage() {
  const t = useTranslations('Integrations');

  const integrations = [
    { name: 'Stripe', description: t('stripeDesc'), status: 'active', icon: '💳' },
    { name: 'Supabase', description: t('supabaseDesc'), status: 'active', icon: '⚡' },
    { name: 'Gemini 2.0 Flash', description: t('geminiDesc'), status: 'active', icon: '🐉' },
    { name: t('mindbodyName'), description: t('mindbodyDesc'), status: 'upcoming', icon: '🧘' },
  ];

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge>{t('subtitle')}</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('supporting')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {integrations.map((integration) => (
              <Card key={integration.name} className="card-pep">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl" aria-hidden>{integration.icon}</span>
                    <Badge variant={integration.status === 'upcoming' ? 'outline' : 'secondary'}>
                      {integration.status === 'upcoming' ? t('upcoming') : 'Active'}
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold">{integration.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{integration.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

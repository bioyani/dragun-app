import { useTranslations } from 'next-intl';
import { Sparkles, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PricingPage() {
  const t = useTranslations('Pricing');

  const plans = [
    {
      key: 'starter',
      highlight: false,
      features: [t('starter.feature1'), t('starter.feature2'), t('starter.feature3')],
      cta: t('starter.cta'),
    },
    {
      key: 'pro',
      highlight: true,
      features: [t('pro.feature1'), t('pro.feature2'), t('pro.feature3'), t('pro.feature4')],
      cta: t('pro.cta'),
    },
    {
      key: 'enterprise',
      highlight: false,
      features: [t('enterprise.feature1'), t('enterprise.feature2'), t('enterprise.feature3'), t('enterprise.feature4')],
      cta: t('enterprise.cta'),
    },
  ];

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge><Sparkles className="h-3.5 w-3.5" /> {t('titleHighlight')} plans</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {plans.map((plan) => {
              const isStarter = plan.key === 'starter';
              const isPro = plan.key === 'pro';
              const isEnterprise = plan.key === 'enterprise';
              const name = isStarter ? t('starter.name') : isPro ? t('pro.name') : t('enterprise.name');
              const description = isStarter ? t('starter.description') : isPro ? t('pro.description') : t('enterprise.description');
              const price = isStarter ? t('starter.price') : isPro ? t('pro.price') : t('enterprise.price');

              return (
                <Card key={plan.key} className={plan.highlight ? 'border-ring shadow-md' : 'card-pep'}>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{name}</p>
                      {plan.highlight && <Badge>{t('popular')}</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
                    <div className="mt-6 flex items-baseline gap-2">
                      <span className="text-4xl font-semibold tabular">{price}</span>
                      {!isEnterprise && <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{t('perMonth')}</span>}
                    </div>

                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-border bg-background">
                            <Check className="h-3 w-3 text-foreground" />
                          </span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Button variant={plan.highlight ? 'primary' : 'outline'} fullWidth className="mt-8 uppercase tracking-[0.14em]">
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <Card>
            <CardContent className="p-8 text-center sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Global Platform Protocol</p>
              <p className="mx-auto mt-4 max-w-3xl text-sm text-muted-foreground">
                Dragun operates on a performance-based resolution model. A <span className="font-semibold text-foreground">5% platform fee</span> applies only to successfully recovered funds.
                No recovery, no fee. Secure gateway payments processed via Stripe Connect.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

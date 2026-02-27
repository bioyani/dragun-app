import { useTranslations } from 'next-intl';
import { Bot, FileText, BadgeDollarSign, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function FeaturesPage() {
  const t = useTranslations('Features');

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge><Sparkles className="h-3.5 w-3.5" /> Platform capabilities</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: Bot, title: t('geminiTitle'), desc: t('geminiDesc') },
              { icon: FileText, title: t('contractTitle'), desc: t('contractDesc') },
              { icon: BadgeDollarSign, title: t('stripeTitle'), desc: t('stripeDesc') },
            ].map((feature) => (
              <Card key={feature.title} className="card-pep">
                <CardContent className="p-8">
                  <feature.icon className="h-6 w-6 text-foreground" />
                  <h2 className="mt-4 text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  const t = useTranslations('About');

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge>{t('badge')}</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('paragraph')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
            <Card className="card-pep md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-lg font-semibold">{t('speedTitle')}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{t('speedDesc')}</p>
              </CardContent>
            </Card>
            <Card className="card-pep md:col-span-6">
              <CardContent className="p-8">
                <h2 className="text-lg font-semibold">{t('foundedTitle')}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{t('foundedDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

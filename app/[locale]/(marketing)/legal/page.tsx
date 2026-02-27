import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function LegalPage() {
  const t = useTranslations('Legal');

  const sections = [
    { title: t('privacyTitle'), content: t('privacyContent') },
    { title: t('tosTitle'), content: t('tosContent') },
    { title: t('complianceTitle'), content: t('complianceContent') },
  ];

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge>{t('badge')}</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <div className="space-y-5">
            {sections.map((section) => (
              <Card key={section.title} className="card-pep">
                <CardContent className="p-7 sm:p-8">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{section.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

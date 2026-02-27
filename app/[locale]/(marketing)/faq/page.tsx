import { useTranslations } from 'next-intl';
import { Sparkles, HelpCircle, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export default function FAQPage() {
  const t = useTranslations('FAQ');

  const faqs = [
    { q: t('q1'), a: t('a1') },
    { q: t('q2'), a: t('a2') },
    { q: t('q3'), a: t('a3') },
    { q: t('q4'), a: t('a4') },
  ];

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="max-w-5xl space-y-7">
            <Badge><Sparkles className="h-3.5 w-3.5" /> Knowledge base</Badge>
            <h1 className="text-4xl font-semibold tracking-tightest sm:text-6xl">
              {t('title')} <span className="text-muted-foreground">{t('titleHighlight')}</span>
            </h1>
            <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('subtitle')}</p>
          </div>
        </div>
      </section>

      <section>
        <div className="section-shell section-gap">
          <div className="mx-auto max-w-4xl space-y-4">
            {faqs.map((faq) => (
              <Card key={faq.q} className="card-pep overflow-hidden">
                <details className="group">
                  <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 sm:px-8">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background">
                        <HelpCircle className="h-4 w-4 text-foreground" />
                      </span>
                      <h2 className="text-base font-semibold sm:text-lg">{faq.q}</h2>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90" />
                  </summary>
                  <div className="border-t border-border px-6 pb-6 pt-4 sm:px-8">
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                  </div>
                </details>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

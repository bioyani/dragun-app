import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, CheckCircle2, ShieldCheck, Gauge, Wallet } from 'lucide-react';
import InteractiveRecoveryDemo from '@/components/InteractiveRecoveryDemo';
import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  const t = useTranslations('Home');

  return (
    <main className="bg-background text-foreground">
      <section className="hero-glow border-b border-border">
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
            <div className="space-y-7 lg:col-span-8">
              <Badge>{t('badge')}</Badge>
              <h1 className="max-w-5xl text-4xl font-semibold tracking-tightest sm:text-6xl">
                {t('heroLine1')}
              </h1>
              <p className="max-w-3xl text-base text-muted-foreground sm:text-lg">{t('heroParagraph')}</p>
              <p className="text-sm text-muted-foreground">{t('trustLine')}</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className={buttonVariants({ size: 'lg', className: 'uppercase tracking-[0.14em]' })}>
                  {t('startPilot')}
                </Link>
                <Link
                  href="#demo"
                  className={buttonVariants({ variant: 'secondary', size: 'lg', className: 'uppercase tracking-[0.14em]' })}
                >
                  {t('watchDemo')}
                </Link>
              </div>
            </div>

            <Card className="lg:col-span-4">
              <CardContent className="p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Launch Checklist</p>
                <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground" />Stripe connect configured</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground" />Contract clauses indexed</li>
                  <li className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground" />Escalation policy defined</li>
                </ul>
                <Separator className="my-5" />
                <p className="text-xs text-muted-foreground">{t('metricsFootnote')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="demo" className="border-b border-border bg-grid-soft">
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <InteractiveRecoveryDemo />

            <div className="grid grid-cols-1 gap-4 lg:col-span-4">
              <Card className="card-pep">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t('recoveryRateLabel')}</p>
                  <p className="mt-2 text-4xl font-semibold tabular">82%</p>
                  <p className="mt-2 text-xs text-muted-foreground">Pilot median across accounts aged 30-90 days.</p>
                </CardContent>
              </Card>
              <Card className="card-pep">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">{t('latencyLabel')}</p>
                  <p className="mt-2 text-4xl font-semibold tabular">2.1s</p>
                  <p className="mt-2 text-xs text-muted-foreground">Measured at p50 in active pilot environments.</p>
                </CardContent>
              </Card>
              <p className="text-xs text-muted-foreground">{t('metricsFootnote')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <p className="text-sm text-muted-foreground">{t('socialProof')}</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {['NORTH POINT FITNESS', 'LUMEN DENTAL', 'ATLAS SERVICES', 'WELLSPRING CLINIC'].map((name) => (
              <Card key={name} className="card-pep rounded-md">
                <CardContent className="px-4 py-4 text-center text-xs font-medium tracking-[0.12em] text-muted-foreground">
                  {name}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, title: t('legalTitle'), desc: t('legalDesc') },
              { icon: Wallet, title: t('stripeTitle'), desc: t('stripeDesc') },
              { icon: Gauge, title: t('knowledgeTitle'), desc: t('knowledgeDesc') },
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

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('howTitle')}</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[1, 2, 3].map((index) => (
              <Card key={index} className="card-pep">
                <CardContent className="p-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">0{index}</p>
                  <h3 className="mt-3 text-lg font-semibold">{t(`howStep${index}`)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(`howStep${index}Desc`)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{t('securityTitle')}</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[t('securityPoint1'), t('securityPoint2'), t('securityPoint3'), t('securityPoint4')].map((point) => (
              <Card key={point} className="card-pep rounded-md">
                <CardContent className="flex items-start gap-3 p-5 text-sm text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-foreground" />
                  <span>{point}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="section-shell section-gap">
          <Card className="shadow-md">
            <CardContent className="p-8 sm:p-12">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{t('ctaTitle1')}</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">{t('ctaTitle2')}</h2>
              <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">{t('ctaSubtitle')}</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/login" className={buttonVariants({ size: 'lg', className: 'uppercase tracking-[0.14em]' })}>
                  {t('ctaButton')}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/pricing"
                  className={buttonVariants({ variant: 'outline', size: 'lg', className: 'uppercase tracking-[0.14em]' })}
                >
                  {t('seePricing')}
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}

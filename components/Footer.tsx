import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Logo from '@/components/Logo';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-border bg-background">
      <div className="section-shell section-gap">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-6">
            <Logo className="h-8 w-auto" />
            <p className="max-w-xl text-sm text-muted-foreground">{t('tagline')}</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>{t('trustLine')}</p>
              <p>{t('disclaimer')}</p>
            </div>
            <p className="text-[11px] text-muted-foreground">{t('copyright')}</p>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">{t('platform')}</h2>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/features" className="focus-ring rounded py-0.5 hover:text-foreground">{t('features')}</Link>
              <Link href="/pricing" className="focus-ring rounded py-0.5 hover:text-foreground">{t('pricing')}</Link>
              <Link href="/integrations" className="focus-ring rounded py-0.5 hover:text-foreground">{t('integrations')}</Link>
              <Link href="/faq" className="focus-ring rounded py-0.5 hover:text-foreground">{t('faq')}</Link>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-3">
            <h2 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground">{t('company')}</h2>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="/about" className="focus-ring rounded py-0.5 hover:text-foreground">{t('about')}</Link>
              <Link href="/contact" className="focus-ring rounded py-0.5 hover:text-foreground">{t('contact')}</Link>
              <Link href="/legal" className="focus-ring rounded py-0.5 hover:text-foreground">{t('legal')}</Link>
              <Link href="/legal" className="focus-ring rounded py-0.5 hover:text-foreground">{t('security')}</Link>
            </div>
          </div>
        </div>
        <Separator className="mt-12" />
      </div>
    </footer>
  );
}

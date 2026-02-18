import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="px-6 py-20 bg-base-100 border-t border-base-200">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center font-bold text-base-content shadow-lg">🐲</div>
            <span className="text-xl font-bold tracking-tighter text-base-content">Dragun<span className="text-primary">.app</span></span>
          </div>
          <p className="text-sm text-base-content/50 max-w-xs leading-relaxed">
            {t('tagline')}
          </p>
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-base-content/40">
            {t('copyright')}
          </div>
        </div>
        <div className="space-y-4">
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content">{t('platform')}</h6>
          <div className="flex flex-col gap-3 text-sm text-base-content/50 font-medium">
            <Link href="/features" className="hover:text-primary transition-colors">{t('features')}</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors">{t('pricing')}</Link>
            <Link href="/integrations" className="hover:text-primary transition-colors">{t('integrations')}</Link>
          </div>
        </div>
        <div className="space-y-4">
          <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content">{t('company')}</h6>
          <div className="flex flex-col gap-3 text-sm text-base-content/50 font-medium">
            <Link href="/about" className="hover:text-primary transition-colors">{t('about')}</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">{t('contact')}</Link>
            <Link href="/legal" className="hover:text-primary transition-colors">{t('legal')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

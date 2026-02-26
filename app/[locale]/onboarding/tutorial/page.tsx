import { getTranslations } from 'next-intl/server';
import { redirect } from '@/i18n/navigation';
import { getMerchantId } from '@/lib/auth';
import TutorialClient from './TutorialClient';

export default async function OnboardingTutorialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('OnboardingTutorial');
  const merchantId = await getMerchantId();

  if (!merchantId) {
    redirect({ href: '/login', locale });
  }

  return (
    <div className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 sm:py-14">
      <div className="mx-auto w-full max-w-4xl">
        <TutorialClient />
      </div>
      <p className="mt-8 text-center text-xs text-muted-foreground">{t('footer')}</p>
    </div>
  );
}

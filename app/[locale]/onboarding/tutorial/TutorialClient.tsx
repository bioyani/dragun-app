'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { completeOnboardingTutorial } from '@/app/actions/onboarding';

const steps = [
  {
    key: 'step1',
    title: 'step1Title',
    description: 'step1Desc',
  },
  {
    key: 'step2',
    title: 'step2Title',
    description: 'step2Desc',
  },
  {
    key: 'step3',
    title: 'step3Title',
    description: 'step3Desc',
  },
  {
    key: 'step4',
    title: 'step4Title',
    description: 'step4Desc',
  },
];

export default function TutorialClient() {
  const t = useTranslations('OnboardingTutorial');
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    const result = await completeOnboardingTutorial();
    if (result.success) {
      router.push('/dashboard');
    } else {
      setLoading(false);
    }
  }

  async function handleSkip() {
    await handleComplete();
  }

  const current = steps[activeStep];

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {t('eyebrow')}
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {t('title')}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {t('subtitle')}
          </p>
        </div>
        <button
          type="button"
          onClick={handleSkip}
          className="inline-flex h-10 items-center self-start rounded-xl border border-border px-4 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground hover:text-foreground"
        >
          {t('skip')}
        </button>
      </div>

      <div className="rounded-[2rem] border border-border bg-card p-6 shadow-elev-1 sm:p-8">
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-background">
          <div className="h-full bg-primary transition-all" style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {steps.map((step, index) => {
            const isActive = index === activeStep;
            const isComplete = index < activeStep;
            return (
              <div
                key={step.key}
                className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                  isActive
                    ? 'border-ring bg-popover text-foreground'
                    : isComplete
                    ? 'border-border bg-background text-foreground'
                    : 'border-border text-muted-foreground'
                }`}
              >
                <span>{t('stepLabel', { count: index + 1 })}</span>
              </div>
            );
          })}
        </div>

        <div className="space-y-4 py-2">
          <h2 className="text-2xl font-bold">{t(current.title)}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {t(current.description)}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={activeStep === 0}
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 0))}
            className="rounded-full border border-border px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground transition hover:text-foreground disabled:opacity-40"
          >
            {t('back')}
          </button>
          {activeStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setActiveStep((prev) => Math.min(prev + 1, steps.length - 1))}
              className="rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90"
            >
              {t('next')}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={loading}
              className="rounded-full bg-primary px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? t('finishing') : t('finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

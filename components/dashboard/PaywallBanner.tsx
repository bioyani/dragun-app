'use client';

import { Lock, Zap, ArrowRight } from 'lucide-react';
import type { PlanTier } from '@/lib/paywall';

interface Props {
  currentCount: number;
  limit: number;
  plan: PlanTier;
  subscribeAction: (formData: FormData) => Promise<void>;
}

export default function PaywallBanner({ currentCount, limit, plan, subscribeAction }: Props) {
  const isAtLimit = currentCount >= limit;
  const nearLimit = currentCount >= limit - 1;

  if (!nearLimit && plan !== 'free') return null;

  return (
    <div className={`card ${isAtLimit ? 'border-error/40 bg-error/5' : 'border-warning/40 bg-warning/5'} shadow-sm`}>
      <div className="card-body p-5 sm:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
              isAtLimit ? 'bg-error/10 text-error' : 'bg-warning/10 text-warning'
            }`}>
              {isAtLimit ? <Lock className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {isAtLimit ? 'Debtor Limit Reached' : 'Approaching Limit'}
              </h3>
              <p className="mt-1 text-sm text-base-content/70">
                {isAtLimit
                  ? `You've reached ${limit} active debtors on the ${plan} plan. Upgrade to add more and unlock full recovery automation.`
                  : `${currentCount} of ${limit} debtor slots used. Upgrade before you hit the limit.`
                }
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <form action={subscribeAction}>
              <input type="hidden" name="plan" value="starter" />
              <button className="btn btn-primary gap-2 h-11 px-5 text-sm font-semibold uppercase tracking-[0.14em]">
                Upgrade to Starter
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-3 flex gap-6 text-xs text-base-content/50">
          <span>50 debtors</span>
          <span>AI recovery agent</span>
          <span>$49/mo</span>
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}

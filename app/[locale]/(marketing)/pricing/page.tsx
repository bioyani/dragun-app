import { useTranslations } from 'next-intl';
import { Check } from 'lucide-react';
import { Section, SectionHeader } from '@/components/daisyui';

export default function PricingPage() {
  const t = useTranslations('Pricing');

  const plans = [
    {
      key: 'starter',
      name: t('starter.name'),
      description: t('starter.description'),
      price: t('starter.price'),
      period: t('perMonth'),
      features: [t('starter.feature1'), t('starter.feature2'), t('starter.feature3')],
      cta: t('starter.cta'),
      featured: false,
    },
    {
      key: 'pro',
      name: t('pro.name'),
      description: t('pro.description'),
      price: t('pro.price'),
      period: t('perMonth'),
      features: [t('pro.feature1'), t('pro.feature2'), t('pro.feature3'), t('pro.feature4')],
      cta: t('pro.cta'),
      featured: true,
    },
    {
      key: 'enterprise',
      name: t('enterprise.name'),
      description: t('enterprise.description'),
      price: t('enterprise.price'),
      period: '',
      features: [t('enterprise.feature1'), t('enterprise.feature2'), t('enterprise.feature3'), t('enterprise.feature4')],
      cta: t('enterprise.cta'),
      featured: false,
    },
  ];

  return (
    <main>
      {/* Header */}
      <Section padding="xl">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase text-base-content/50 mb-4">
            Pricing plans
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {t('title')} <span className="text-base-content/50">{t('titleHighlight')}</span>
          </h1>
          <p className="text-lg text-base-content/70">{t('subtitle')}</p>
        </div>
      </Section>

      {/* Pricing Cards */}
      <Section variant="muted" padding="xl">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <article
              key={plan.key}
              className={`border bg-base-100 px-6 py-8 ${
                plan.featured ? 'border-primary/30' : ''
              }`}
            >
              {plan.featured && (
                <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-4">
                  Popular choice
                </p>
              )}
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <p className="text-sm text-base-content/60 mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                {plan.period && <span className="text-base-content/60"> {plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-base-content/80">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className={`btn w-full ${plan.featured ? 'btn-primary' : 'btn-outline'}`}>
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </Section>

      {/* Pricing Note */}
      <Section>
        <div className="border border-base-200 bg-base-50 px-8 py-6 max-w-4xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase text-base-content/50 mb-4">
            Global Platform Protocol
          </p>
          <p className="text-base-content/70 leading-relaxed">
            Dragun operates on a performance-based resolution model. A{' '}
            <span className="font-semibold">5% platform fee</span> applies only to successfully recovered funds.
            No recovery, no fee. Secure gateway payments processed via Stripe Connect.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section variant="muted" padding="xl">
        <SectionHeader
          title="Frequently asked questions"
          description="Everything you need to know about our pricing"
        />
        <div className="max-w-3xl mx-auto space-y-4">
          {[
            {
              question: 'When is the platform fee charged?',
              answer: 'The 5% platform fee is only deducted when a debt is successfully recovered through our platform. There are no upfront costs or hidden fees.',
            },
            {
              question: 'Can I change my plan?',
              answer: 'Yes. You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we prorate billing adjustments.',
            },
            {
              question: 'What payment methods do you accept?',
              answer: 'We accept all major credit cards through our secure Stripe integration. Enterprise customers can also pay via invoice.',
            },
            {
              question: 'Is there a free trial?',
              answer: 'We offer a 14-day pilot program for qualifying businesses. Contact our sales team to check eligibility.',
            },
          ].map((faq, index) => (
            <details
              key={index}
              className="border border-base-200 bg-base-100 group"
              defaultOpen={index === 0}
            >
              <summary className="px-6 py-4 cursor-pointer font-medium hover:bg-base-50 focus:outline-none focus:bg-base-50">
                {faq.question}
              </summary>
              <div className="px-6 pb-4 pt-0 border-t border-base-100">
                <p className="text-base-content/70 leading-relaxed">{faq.answer}</p>
              </div>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section padding="xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">Ready to get started?</h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join the pilot program and start recovering more debt
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary btn-lg">Start Free Pilot</button>
            <button className="btn btn-outline btn-lg">Contact Sales</button>
          </div>
        </div>
      </Section>
    </main>
  );
}

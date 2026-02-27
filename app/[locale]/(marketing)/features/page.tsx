import { useTranslations } from 'next-intl';
import { Bot, FileText, BadgeDollarSign, ShieldCheck, Zap, Users, BarChart3, MessageSquare, Lock, Globe, CheckCircle2 } from 'lucide-react';
import { Section, SectionHeader, FeatureCard, Divider, Grid } from '@/components/daisyui';

export default function FeaturesPage() {
  const t = useTranslations('Features');

  const coreFeatures = [
    {
      icon: <Bot className="w-6 h-6" />,
      title: t('geminiTitle'),
      description: t('geminiDesc'),
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: t('contractTitle'),
      description: t('contractDesc'),
    },
    {
      icon: <BadgeDollarSign className="w-6 h-6" />,
      title: t('stripeTitle'),
      description: t('stripeDesc'),
    },
  ];

  const advancedFeatures = [
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Automated Compliance',
      description: 'Built-in regulatory compliance checks ensure all communications meet legal requirements automatically.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Smart Escalation',
      description: 'AI automatically escalates cases based on debtor response patterns and configurable business rules.',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Team Collaboration',
      description: 'Assign cases, track progress, add notes, and coordinate across your recovery team with role-based access.',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into recovery rates, response times, payment trends, and team performance.',
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: 'AI Chat Assistant',
      description: 'Get instant guidance on recovery strategy with AI that analyzes case details and suggests optimal approaches.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Smart Notifications',
      description: 'Real-time alerts for payments, responses, deadlines, and follow-ups.',
    },
  ];

  const securityFeatures = [
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'End-to-End Encryption',
      description: 'All data encrypted at rest and in transit using AES-256 encryption.',
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'GDPR Compliant',
      description: 'Full compliance with GDPR, CCPA, and international data protection regulations.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'SOC 2 Type II',
      description: 'Enterprise-grade security with annual SOC 2 Type II audits.',
    },
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: 'Audit Trails',
      description: 'Complete audit logging for all user actions, communications, and system events.',
    },
  ];

  return (
    <main>
      {/* Header */}
      <Section padding="xl">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-sm font-medium tracking-widest uppercase text-base-content/50 mb-4">
            Platform capabilities
          </p>
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            {t('title')} <span className="text-base-content/50">{t('titleHighlight')}</span>
          </h1>
          <p className="text-lg text-base-content/70">{t('subtitle')}</p>
        </div>
      </Section>

      {/* Core Features */}
      <Section variant="muted">
        <SectionHeader title="Core capabilities" />
        <Grid cols={3}>
          {coreFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Grid>
      </Section>

      <Divider text="Advanced Features" />

      {/* Advanced Features */}
      <Section>
        <SectionHeader
          title="Everything you need to recover debt efficiently"
          description="Professional-grade tools for modern recovery teams"
        />
        <Grid cols={2} gap="lg">
          {advancedFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Grid>
      </Section>

      <Divider text="Enterprise Security" />

      {/* Security */}
      <Section variant="muted">
        <SectionHeader title="Security & Compliance" />
        <Grid cols={2}>
          {securityFeatures.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </Grid>
      </Section>

      {/* Integrations */}
      <Section>
        <SectionHeader
          title="Integrations"
          description="Connect with your existing tools and workflows"
        />
        <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {[
            { name: 'Stripe' },
            { name: 'Supabase' },
            { name: 'QuickBooks' },
            { name: 'Xero' },
          ].map((integration) => (
            <div key={integration.name} className="text-center py-6 px-4 border border-base-200 hover:border-base-300 transition-colors">
              <p className="font-medium mb-2">{integration.name}</p>
              <span className="badge badge-ghost badge-sm">Connected</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted" padding="xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">
            Ready to transform your debt recovery?
          </h2>
          <p className="text-lg text-base-content/70 mb-8 max-w-2xl mx-auto">
            Join the pilot program and start recovering more debt with AI-powered automation
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="btn btn-primary btn-lg">Start Free Pilot</button>
            <button className="btn btn-outline btn-lg">Schedule Demo</button>
          </div>
        </div>
      </Section>
    </main>
  );
}

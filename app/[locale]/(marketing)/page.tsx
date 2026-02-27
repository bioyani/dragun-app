import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Heading, Text, Section, SectionHeader, Card, List, ListItem, Button, Divider, Grid } from '@/components/daisyui';
import InteractiveRecoveryDemo from '@/components/InteractiveRecoveryDemo';

export default function LandingPage() {
  const t = useTranslations('Home');

  return (
    <main>
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Hero */}
      <section className="min-h-[60vh] flex items-center py-20" id="main-content">
        <div className="app-shell max-w-3xl">
          <Heading size="xl" as="h1">
            {t('heroLine1')}
          </Heading>
          <Text size="lg" muted className="mt-6 mb-10 max-w-2xl">
            {t('heroParagraph')}
          </Text>
          <div className="flex flex-wrap gap-4">
            <Link href="/login">
              <Button icon={<ArrowRight size={20} />}>{t('startPilot')}</Button>
            </Link>
            <Button variant="secondary" href="#demo">{t('watchDemo')}</Button>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <Section variant="muted" padding="md">
        <Grid cols={3} gap="sm">
          <div>
            <Text muted className="text-sm mb-1">Recovery Rate</Text>
            <Heading size="lg">82%</Heading>
            <Text muted className="text-sm">Pilot median</Text>
          </div>
          <div>
            <Text muted className="text-sm mb-1">Response Time</Text>
            <Heading size="lg">2.1s</Heading>
            <Text muted className="text-sm">p50 latency</Text>
          </div>
          <div>
            <Text muted className="text-sm mb-1">Active Pilots</Text>
            <Heading size="lg">24+</Heading>
            <Text muted className="text-sm">Live deployments</Text>
          </div>
        </Grid>
      </Section>

      {/* Demo */}
      <Section>
        <SectionHeader
          title="See how it works"
          description="Experience our platform through an interactive demonstration"
        />
        <Grid cols={2}>
          <div className="border border-base-200 bg-base-50 p-6">
            <InteractiveRecoveryDemo />
          </div>
          <div className="space-y-8">
            <Text size="lg" className="text-base-content/80 leading-relaxed">
              Our platform combines intelligent automation with respectful, professional communication.
            </Text>
            <List>
              <ListItem>
                <Text>AI-powered analysis suggests optimal recovery strategies based on debtor behavior</Text>
              </ListItem>
              <ListItem>
                <Text>Multi-channel communication reaches debtors through their preferred method</Text>
              </ListItem>
              <ListItem>
                <Text>Enterprise-grade encryption ensures your data remains secure and compliant</Text>
              </ListItem>
            </List>
          </div>
        </Grid>
      </Section>

      <Divider text="Platform" />

      {/* Features */}
      <Section>
        <SectionHeader
          title="Built for professional recovery"
          description="Tools designed for efficiency while maintaining respect"
        />
        <Grid cols={2}>
          <Card>
            <Heading size="md">Contract Intelligence</Heading>
            <Text muted className="mt-4">Automatically parse and understand contract terms, payment schedules, and legal requirements.</Text>
          </Card>
          <Card>
            <Heading size="md">Compliance Automation</Heading>
            <Text muted className="mt-4">Built-in regulatory checks ensure all communications meet legal requirements automatically.</Text>
          </Card>
          <Card>
            <Heading size="md">Analytics</Heading>
            <Text muted className="mt-4">Real-time insights into recovery rates, team performance, and payment trends.</Text>
          </Card>
          <Card>
            <Heading size="md">Team Collaboration</Heading>
            <Text muted className="mt-4">Assign cases, track progress, and coordinate across your recovery team.</Text>
          </Card>
        </Grid>
      </Section>

      {/* Social Proof */}
      <Section variant="border">
        <div className="text-center mb-12">
          <Text muted className="text-sm tracking-widest uppercase">Trusted by professional services</Text>
        </div>
        <Grid cols={4}>
          {['North Point Fitness', 'Lumen Dental', 'Atlas Services', 'Wellspring Clinic', 'Urban Physio', 'Metro Legal', 'Apex Dental', 'City Fitness'].map((name) => (
            <div key={name} className="text-center py-6 border-b border-r border-base-100 last:border-r-0">
              <Text muted>{name}</Text>
            </div>
          ))}
        </Grid>
      </Section>

      <Divider text="How It Works" />

      {/* Steps */}
      <Section variant="muted">
        <SectionHeader title="Get started in three steps" />
        <div className="max-w-2xl mx-auto space-y-16">
          <div className="flex gap-8">
            <span className="text-5xl font-medium text-base-content/10 flex-shrink-0">01</span>
            <div>
              <Heading size="md">{t('howStep1')}</Heading>
              <Text muted className="mt-2">{t('howStep1Desc')}</Text>
            </div>
          </div>
          <div className="flex gap-8">
            <span className="text-5xl font-medium text-base-content/10 flex-shrink-0">02</span>
            <div>
              <Heading size="md">{t('howStep2')}</Heading>
              <Text muted className="mt-2">{t('howStep2Desc')}</Text>
            </div>
          </div>
          <div className="flex gap-8">
            <span className="text-5xl font-medium text-base-content/10 flex-shrink-0">03</span>
            <div>
              <Heading size="md">{t('howStep3')}</Heading>
              <Text muted className="mt-2">{t('howStep3Desc')}</Text>
            </div>
          </div>
        </div>
      </Section>

      {/* Security */}
      <Section>
        <SectionHeader
          title="Security & Compliance"
          description="Enterprise-grade protection for sensitive financial data"
        />
        <div className="max-w-2xl mx-auto">
          <List>
            <ListItem icon={<CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}>
              <Text>All data encrypted at rest and in transit using AES-256 encryption</Text>
            </ListItem>
            <ListItem icon={<CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}>
              <Text>Full compliance with GDPR, CCPA, and international data protection regulations</Text>
            </ListItem>
            <ListItem icon={<CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}>
              <Text>Enterprise-grade security with annual SOC 2 Type II audits</Text>
            </ListItem>
            <ListItem icon={<CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />}>
              <Text>Complete audit logging for all user actions and communications</Text>
            </ListItem>
          </List>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="muted" padding="lg">
        <div className="text-center max-w-2xl mx-auto">
          <Heading size="xl" as="h2">{t('ctaTitle2')}</Heading>
          <Text size="lg" muted className="mt-4 mb-8">{t('ctaSubtitle')}</Text>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" icon={<ArrowRight size={20} />}>{t('ctaButton')}</Button>
            </Link>
            <Button variant="secondary" size="lg" href="/pricing">{t('seePricing')}</Button>
          </div>
        </div>
      </Section>

      {/* Footer Note */}
      <Section padding="sm">
        <Text muted className="text-center text-sm">{t('metricsFootnote')}</Text>
      </Section>
    </main>
  );
}

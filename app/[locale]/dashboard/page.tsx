import { hasSupabaseAdminConfig, supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { addDebtor } from '../../actions/add-debtor';
import { revalidatePath } from 'next/cache';
import { Link, redirect } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { getMerchantId, isOwner } from '@/lib/auth';
import { createStripeConnectAccount } from '@/app/actions/stripe-connect';
import { createSubscriptionCheckout } from '@/app/actions/subscription';
import { checkPaywall, getDebtorLimit, getEffectivePlan } from '@/lib/paywall';
import { updateRecoveryStatus } from '@/app/actions/recovery-actions';
import {
  CheckCircle2,
  CreditCard,
  Users,
  ArrowRight,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

import Logo from '@/components/Logo';
import DashboardTopNav from '@/components/dashboard/DashboardTopNav';
import MobileBottomBar from '@/components/dashboard/MobileBottomBar';
import PaywallBanner from '@/components/dashboard/PaywallBanner';
import PendingSubscription from '@/components/dashboard/PendingSubscription';
import DashboardSummary from '@/components/dashboard/DashboardSummary';
import DashboardAlerts from '@/components/dashboard/DashboardAlerts';
import FocusStrip from '@/components/dashboard/FocusStrip';
import InsightsPanel from '@/components/dashboard/InsightsPanel';
import { getRecoveryScore } from '@/lib/recovery-score';
import { createDebtorToken, hasDebtorPortalSecret } from '@/lib/debtor-token';
import DebtorTableWithBulk from '@/components/dashboard/DebtorTableWithBulk';
import DebtorFilters from '@/components/dashboard/DebtorFilters';
import TopDebtors from '@/components/dashboard/TopDebtors';
import RecoveryAnalytics from '@/components/dashboard/RecoveryAnalytics';
import SuggestedCitations from '@/components/dashboard/SuggestedCitations';
import CommsChannelsAlert from '@/components/dashboard/CommsChannelsAlert';
import type { DebtorRow, RecoveryActionRow } from '@/components/dashboard/dashboard-types';
import { getRagContext, RAG_QUERIES } from '@/lib/rag';
import RootInspection from '@/components/dashboard/RootInspection';

type DashboardMerchant = {
  id: string;
  email?: string | null;
  name: string;
  onboarding_completed?: boolean | null;
  onboarding_complete?: boolean | null;
  stripe_account_id?: string | null;
  stripe_onboarding_complete?: boolean | null;
  strictness_level?: number | null;
  settlement_floor?: number | null;
  data_retention_days?: number | null;
  currency_preference?: string | null;
  phone?: string | null;
  plan?: string | null;
  plan_active_until?: string | null;
};

export default async function DashboardPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('Dashboard');
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const merchantId = (await getMerchantId()) ?? user?.id ?? null;
  const search = await searchParams;
  const { locale } = await params;
  const systemOwner = await isOwner();
  const stripeSuccess = search.stripe_success === 'true';

  const statusFilter = String(
    (Array.isArray(search.status) ? search.status[0] : search.status) || 'all',
  );
  const overdueFilter = String(
    (Array.isArray(search.overdue) ? search.overdue[0] : search.overdue) || 'all',
  );
  const amountFilter = String(
    (Array.isArray(search.amount) ? search.amount[0] : search.amount) || 'all',
  );
  const sortBy = String(
    (Array.isArray(search.sort) ? search.sort[0] : search.sort) || 'score_desc',
  );

  if (!merchantId) {
    redirect({ href: '/login', locale });
  }

  const resolvedMerchantId = merchantId as string;

  const dataClient = hasSupabaseAdminConfig ? supabaseAdmin : supabase;
  const safeSingle = async <T,>(runner: () => PromiseLike<{ data: T | null; error?: unknown }>) => {
    try {
      return await runner();
    } catch {
      return { data: null, error: { message: 'query failed' } };
    }
  };
  const safeMany = async <T,>(runner: () => PromiseLike<{ data: T[] | null; error?: unknown }>) => {
    try {
      return await runner();
    } catch {
      return { data: [] as T[], error: { message: 'query failed' } };
    }
  };

  // --- Merchant resolution ---
  const initialResponse = await safeSingle(() =>
    dataClient
      .from('merchants')
      .select('*')
      .eq('id', resolvedMerchantId)
      .single(),
  );

  let merchant: DashboardMerchant | null = initialResponse.data as DashboardMerchant | null;

  if ((initialResponse.error || !merchant) && hasSupabaseAdminConfig && user) {
    if (user) {
      const { data: existingByEmail } = await supabaseAdmin
        .from('merchants')
        .select('*')
        .eq('email', user.email!)
        .single();

      if (existingByEmail) {
        if (existingByEmail.id !== user.id) {
          const { data: updated } = await supabaseAdmin
            .from('merchants')
            .update({ id: user.id })
            .eq('email', user.email!)
            .select()
            .single();
          merchant = updated;
        } else {
          merchant = existingByEmail;
        }
      } else {
        const { data: newMerchant, error: createError } = await supabaseAdmin
          .from('merchants')
          .insert({
            id: user.id,
            email: user.email!,
            name:
              user.user_metadata?.full_name ||
              user.email?.split('@')[0] ||
              'New Merchant',
          })
          .select()
          .single();

        if (!createError && newMerchant) {
          merchant = newMerchant;
          await supabaseAdmin.from('debtors').insert({
            merchant_id: user.id,
            name: 'John Sample',
            email: 'john@example.com',
            total_debt: 1250.0,
            currency: 'USD',
            status: 'pending',
          });
        }
      }
    }
  }

  if (!merchant && user) {
    merchant = {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Merchant',
      onboarding_completed: true,
      onboarding_complete: true,
      stripe_account_id: null,
      stripe_onboarding_complete: false,
      strictness_level: 5,
      settlement_floor: 0.8,
      data_retention_days: 0,
      currency_preference: 'USD',
      phone: null,
      plan: 'free',
      plan_active_until: null,
    };
  }

  if (!merchant) {
    return (
      <div className="min-h-screen bg-base-100 flex items-center justify-center p-6">
        <div className="card bg-base-200/50 border border-base-300/50 shadow-elevated max-w-md w-full">
          <div className="card-body items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-base-300/50 mb-2">
              <ShieldCheck className="h-7 w-7 text-base-content/40" />
            </div>
            <h1 className="card-title">{t('notFound')}</h1>
            <p className="text-sm text-base-content/50">{t('notFoundHint')}</p>
          </div>
        </div>
      </div>
    );
  }

  const onboardingDone = merchant.onboarding_completed ?? merchant.onboarding_complete;
  if (!onboardingDone && !systemOwner) {
    redirect({ href: '/onboarding/profile', locale });
  }

  const hasStripeAccount = !!merchant.stripe_account_id;
  const isOnboardingComplete = !!merchant.stripe_onboarding_complete;
  const subscriptionSuccess = search.subscription_success === 'true';

  // --- Data fetching in parallel ---
  const [paywallResult, contractResponse, debtorsResponse, recoveryActionsResponse, { chunks: suggestedCitations }] = await Promise.all([
    hasSupabaseAdminConfig
      ? checkPaywall(resolvedMerchantId).catch(() => null)
      : Promise.resolve(null),
    safeSingle(() =>
      dataClient
        .from('contracts')
        .select('*')
        .eq('merchant_id', resolvedMerchantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
    ),
    safeMany(() =>
      dataClient
        .from('debtors')
        .select('*')
        .eq('merchant_id', resolvedMerchantId),
    ),
    safeMany(() =>
      dataClient
        .from('recovery_actions')
        .select('*')
        .eq('merchant_id', resolvedMerchantId)
        .order('created_at', { ascending: false })
        .limit(250),
    ),
    getRagContext(resolvedMerchantId, RAG_QUERIES.dashboardSuggest, {
      matchCount: 3,
      matchThreshold: 0.45,
    }),
  ]);

  const contract = contractResponse.data;
  const debtorsData = debtorsResponse.data ?? [];
  const recoveryActionsData = recoveryActionsResponse.data ?? [];
  const fallbackPlan = getEffectivePlan({
    plan: merchant?.plan ?? undefined,
    plan_active_until: merchant?.plan_active_until ?? null,
  });
  const paywall = paywallResult ?? {
    allowed: (debtorsData?.filter((d) => d.status !== 'paid').length ?? 0) < getDebtorLimit(fallbackPlan),
    currentCount: debtorsData?.filter((d) => d.status !== 'paid').length ?? 0,
    limit: getDebtorLimit(fallbackPlan),
    plan: fallbackPlan,
  };

  const debtors: DebtorRow[] = (debtorsData ?? []) as DebtorRow[];
  const recoveryActions: RecoveryActionRow[] = (recoveryActionsData ?? []) as RecoveryActionRow[];

  // --- Server actions ---
  async function handleAddDebtor(formData: FormData) {
    'use server';
    const mid = await getMerchantId();
    if (mid) {
      const pw = await checkPaywall(mid);
      if (!pw.allowed)
        throw new Error(`Debtor limit reached (${pw.limit}). Upgrade your plan.`);
    }
    await addDebtor(formData);
    revalidatePath('/[locale]/dashboard', 'page');
  }

  async function handleSubscribe(formData: FormData) {
    'use server';
    await createSubscriptionCheckout(formData);
  }

  async function handleRecoveryAction(formData: FormData) {
    'use server';
    await updateRecoveryStatus(formData);
    revalidatePath('/[locale]/dashboard', 'page');
  }

  // --- Derived data ---
  const actionableDebtors = debtors.filter((d) => d.status !== 'paid');

  const filteredDebtors = actionableDebtors.filter((d) => {
    if (statusFilter !== 'all' && d.status !== statusFilter) return false;
    const overdue = d.days_overdue ?? 0;
    if (overdueFilter === '0_30' && (overdue < 0 || overdue > 30)) return false;
    if (overdueFilter === '31_60' && (overdue < 31 || overdue > 60)) return false;
    if (overdueFilter === '61_plus' && overdue < 61) return false;
    const amount = d.total_debt;
    if (amountFilter === 'lt_200' && amount >= 200) return false;
    if (amountFilter === '200_999' && (amount < 200 || amount > 999)) return false;
    if (amountFilter === '1000_plus' && amount < 1000) return false;
    return true;
  });

  const prioritizedDebtors = [...filteredDebtors].sort((a, b) => {
    if (sortBy === 'amount_desc') return b.total_debt - a.total_debt;
    if (sortBy === 'overdue_desc')
      return (b.days_overdue ?? 0) - (a.days_overdue ?? 0);
    if (sortBy === 'created_desc')
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return getRecoveryScore(b) - getRecoveryScore(a);
  });

  const canCreateDebtorPortalLinks = hasDebtorPortalSecret();
  const prioritizedDebtorsWithPortal: DebtorRow[] = prioritizedDebtors.map((d) => ({
    ...d,
    portalChatUrl: canCreateDebtorPortalLinks
      ? `/chat/${d.id}?token=${createDebtorToken(d.id)}`
      : undefined,
  }));

  const actionTimelineByDebtor = recoveryActions.reduce<
    Record<string, RecoveryActionRow[]>
  >((acc, action) => {
    acc[action.debtor_id] = acc[action.debtor_id] || [];
    if (acc[action.debtor_id].length < 3) acc[action.debtor_id].push(action);
    return acc;
  }, {});

  const totalOutstanding = debtors.reduce(
    (acc, d) => acc + (d.status !== 'paid' ? d.total_debt : 0),
    0,
  );
  const totalRecovered = debtors.reduce(
    (acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0),
    0,
  );
  const totalPortfolio = totalOutstanding + totalRecovered;
  const recoveryRate = totalPortfolio > 0
    ? Math.round((totalRecovered / totalPortfolio) * 100)
    : 0;

  const today = new Date();
  const isToday = (d: Date) =>
    d.getUTCFullYear() === today.getUTCFullYear() &&
    d.getUTCMonth() === today.getUTCMonth() &&
    d.getUTCDate() === today.getUTCDate();

  const contactedToday = debtors.filter((d) => {
    if (!d.last_contacted) return false;
    return isToday(new Date(d.last_contacted));
  }).length;
  const promises = debtors.filter((d) => d.status === 'promise_to_pay').length;

  const paidToday = recoveryActions.filter(
    (a) => a.status_after === 'paid' && isToday(new Date(a.created_at)),
  ).length;

  const statusCounts: Record<string, number> = {};
  for (const d of debtors) {
    statusCounts[d.status] = (statusCounts[d.status] || 0) + 1;
  }

  const recentActions = recoveryActions.slice(0, 10);



  const summaryPrimary = [
    {
      label: t('outstanding'),
      value: `$${totalOutstanding.toLocaleString()}`,
      sub: `${actionableDebtors.length} ${t('debtors').toLowerCase()}`,
      icon: 'outstanding' as const,
    },
    {
      label: t('recovered'),
      value: `$${totalRecovered.toLocaleString()}`,
      sub: `${recoveryRate}% ${t('vsAvg')}`,
      icon: 'recovered' as const,
    },
    {
      label: t('focusToday'),
      value: actionableDebtors.length > 0 ? String(contactedToday) : '—',
      sub: paidToday > 0 ? `${paidToday} ${t('resolvedToday')}` : t('queueTouched'),
      icon: 'today' as const,
    },
  ];
  const summarySecondary = [
    { label: t('promises'), value: String(promises) },
    { label: t('paidToday'), value: String(paidToday) },
    { label: t('planLabel'), value: `${paywall.plan} · ${paywall.currentCount}/${paywall.limit}` },
  ];
  const nextDebtor = prioritizedDebtorsWithPortal[0] ?? null;

  return (
    <div id="dashboard-top" className="min-h-screen bg-base-100 pb-28 md:pb-8 scroll-mt-0">
      {/* Navigation */}
      <nav className="sticky top-0 z-30 border-b border-base-300/50 bg-base-100/90 backdrop-blur-xl">
        <div className="app-shell flex h-14 sm:h-16 items-center justify-between gap-2 min-h-0">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
          <DashboardTopNav
            merchantName={merchant.name}
            hasStripeAccount={hasStripeAccount}
            isOnboardingComplete={isOnboardingComplete}
            locale={locale}
            merchant={{
              name: merchant.name,
              strictness_level: merchant.strictness_level ?? 5,
              settlement_floor: merchant.settlement_floor ?? 0.8,
              data_retention_days: merchant.data_retention_days,
              currency_preference: merchant.currency_preference,
              phone: merchant.phone,
            }}
            contract={contract}
          />
        </div>
      </nav>

      <main className="app-shell space-y-4 sm:space-y-6 py-4 sm:py-6">
        {/* Page header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl md:text-3xl">
            {t('title')}
          </h1>
          <p className="text-sm text-base-content/50">{t('subtitle')}</p>
        </div>

        {/* Alerts: max 2 visible (Progressive disclosure) */}
        <DashboardAlerts>
          {stripeSuccess && isOnboardingComplete && (
            <div className="alert alert-success shadow-warm flex-col sm:flex-row items-stretch sm:items-center gap-3 text-left">
              <div className="flex gap-3 flex-1 min-w-0">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">{t('gatewayActivated')}</p>
                  <p className="text-sm opacity-80">{t('gatewayActivatedDesc')}</p>
                </div>
              </div>
              <Link href="/dashboard" className="btn btn-ghost min-h-10 min-w-[44px] sm:shrink-0">{t('dismiss')}</Link>
            </div>
          )}
          {subscriptionSuccess && (
            <div className="alert alert-success shadow-warm flex-col sm:flex-row items-stretch sm:items-center gap-3 text-left">
              <div className="flex gap-3 flex-1 min-w-0">
                <CreditCard className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">{t('subscriptionActivated')}</p>
                  <p className="text-sm opacity-80">
                    {t('subscriptionActivatedDesc', { plan: paywall.plan, limit: String(paywall.limit) })}
                  </p>
                </div>
              </div>
              <Link href="/dashboard" className="btn btn-ghost min-h-10 min-w-[44px] sm:shrink-0">{t('dismiss')}</Link>
            </div>
          )}
          {!isOnboardingComplete && (
            <div className="alert shadow-warm flex-col sm:flex-row items-stretch sm:items-center gap-3 text-left">
              <div className="flex gap-3 flex-1 min-w-0">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold">
                    {hasStripeAccount ? t('completeGatewaySetup') : t('activateGateway')}
                  </p>
                  <p className="text-sm opacity-70">
                    {hasStripeAccount ? t('finishOnboardingDesc') : t('connectStripeDesc')}
                  </p>
                </div>
              </div>
              <form action={createStripeConnectAccount} className="w-full sm:w-auto">
                <input type="hidden" name="locale" value={locale} />
                <button className="btn btn-primary gap-1 min-h-11 w-full sm:w-auto min-w-[44px] touch-manipulation">
                  {hasStripeAccount ? t('resume') : t('setupStripe')}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}
          <CommsChannelsAlert locale={locale} />
          <PaywallBanner
            currentCount={paywall.currentCount}
            limit={paywall.limit}
            plan={paywall.plan}
            subscribeAction={handleSubscribe}
          />
          <PendingSubscription subscribeAction={handleSubscribe} />
        </DashboardAlerts>

        {/* Summary: 3 primary metrics (Miller's Law, Hick's Law) */}
        <DashboardSummary primary={summaryPrimary} secondary={summarySecondary} />

        {/* Next best action (Goal-Gradient Effect) */}
        <FocusStrip nextDebtor={nextDebtor} actionableCount={actionableDebtors.length} />

        {systemOwner && <RootInspection />}

        {/* Main content: table + sidebar */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Debtor list */}
          <section id="dashboard-debtors" className="lg:col-span-8 scroll-mt-24 min-w-0">
            <div className="card bg-base-200/50 border border-base-300/50 shadow-warm overflow-hidden">
              <div className="flex flex-col gap-3 border-b border-base-300/50 p-3 sm:p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-base-300/50">
                    <Users className="h-4 w-4 text-base-content/60" />
                  </div>
                  <div>
                    <h2 className="font-bold">{t('activeRecoveries')}</h2>
                    <p className="text-[11px] text-base-content/40">
                      {t('activeCount', { count: prioritizedDebtors.length })} ·{' '}
                      {t('resolvedCount', { count: debtors.filter((d) => d.status === 'paid').length })}
                    </p>
                  </div>
                </div>
                <DebtorFilters
                  statusFilter={statusFilter}
                  overdueFilter={overdueFilter}
                  amountFilter={amountFilter}
                  sortBy={sortBy}
                />
              </div>

              <DebtorTableWithBulk
                debtors={prioritizedDebtorsWithPortal}
                actionTimeline={actionTimelineByDebtor}
                handleRecoveryAction={handleRecoveryAction}
              />
            </div>
          </section>

          {/* Sidebar: one compartment (Law of Common Region, Chunking) */}
          <aside className="lg:col-span-4 min-w-0">
            <InsightsPanel>
              <SuggestedCitations chunks={suggestedCitations} />
              <RecoveryAnalytics
                recoveryRate={recoveryRate}
                totalPortfolio={totalPortfolio}
                totalRecovered={totalRecovered}
                statusCounts={statusCounts}
                recentActions={recentActions}
                debtorNames={Object.fromEntries(debtors.map((d) => [d.id, d.name]))}
              />
              <TopDebtors debtors={prioritizedDebtors} />
            </InsightsPanel>
          </aside>
        </div>
      </main>

      <MobileBottomBar addDebtorAction={handleAddDebtor} />
    </div>
  );
}

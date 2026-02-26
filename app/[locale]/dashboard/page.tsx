import { supabaseAdmin } from '@/lib/supabase-admin';
import { createClient } from '@/lib/supabase/server';
import { uploadContract } from '../../actions/upload-contract';
import { updateMerchantSettings } from '../../actions/merchant-settings';
import { addDebtor } from '../../actions/add-debtor';
import { revalidatePath } from 'next/cache';
import { Link, redirect } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import MobileBottomBar from '@/components/dashboard/MobileBottomBar';
import DashboardTopNav from '@/components/dashboard/DashboardTopNav';
import Logo from '@/components/Logo';
import { getMerchantId } from '@/lib/auth';
import { createStripeConnectAccount } from '@/app/actions/stripe-connect';
import { COLLECTION_STATUSES, updateRecoveryStatus } from '@/app/actions/recovery-actions';
import {
  Settings,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Users,
  BadgeDollarSign,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Download,
} from 'lucide-react';

type RecoveryActionRow = {
  debtor_id: string;
  action_type: string;
  status_after: string;
  note: string | null;
  created_at: string;
};

const OPERATOR_ACTION_TYPES = ['status_update', 'call', 'sms', 'follow_up_scheduled'] as const;

type DebtorRow = {
  id: string;
  name: string;
  email: string;
  currency: string;
  total_debt: number;
  status: string;
  last_contacted: string | null;
  days_overdue?: number | null;
  created_at: string;
};

function getStatusBadgeClass(status: string): string {
  if (status === 'paid') return 'border-success/30 bg-success/10 text-success';
  if (status === 'escalated') return 'border-warning/30 bg-warning/10 text-warning';
  if (status === 'promise_to_pay') return 'border-info/30 bg-info/10 text-info';
  return 'border-border bg-background text-foreground';
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'contacted':
      return 'Contacted';
    case 'promise_to_pay':
      return 'Promise';
    case 'no_answer':
      return 'No Answer';
    case 'escalated':
      return 'Escalated';
    case 'paid':
      return 'Paid';
    default:
      return 'Pending';
  }
}

function getRecoveryScore(d: DebtorRow): number {
  const amountScore = Math.min(60, d.total_debt / 50);
  const overdueDays = Math.max(0, d.days_overdue ?? 0);
  const overdueScore = Math.min(30, overdueDays * 0.75);
  const contactPenalty = d.last_contacted ? 10 : 0;
  const statusBoost = d.status === 'promise_to_pay' ? 8 : d.status === 'escalated' ? 12 : 0;
  return Math.max(0, Math.round(amountScore + overdueScore + statusBoost - contactPenalty));
}

export default async function DashboardPage({
  searchParams,
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ locale: string }>;
}) {
  const t = await getTranslations('Dashboard');
  const merchantId = await getMerchantId();
  const search = await searchParams;
  const { locale } = await params;
  const stripeSuccess = search.stripe_success === 'true';
  const forceDashboard = search.force_dashboard === 'true';

  const statusFilter = String((Array.isArray(search.status) ? search.status[0] : search.status) || 'all');
  const overdueFilter = String((Array.isArray(search.overdue) ? search.overdue[0] : search.overdue) || 'all');
  const amountFilter = String((Array.isArray(search.amount) ? search.amount[0] : search.amount) || 'all');
  const sortBy = String((Array.isArray(search.sort) ? search.sort[0] : search.sort) || 'score_desc');

  if (!merchantId) {
    redirect({ href: '/login', locale });
  }

  const initialResponse = await supabaseAdmin.from('merchants').select('*').eq('id', merchantId).single();

  let merchant = initialResponse.data;
  const merchantError = initialResponse.error;

  if (merchantError || !merchant) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: existingByEmail } = await supabaseAdmin.from('merchants').select('*').eq('email', user.email!).single();

      if (existingByEmail) {
        if (existingByEmail.id !== user.id) {
          const { data: updatedMerchant } = await supabaseAdmin
            .from('merchants')
            .update({ id: user.id })
            .eq('email', user.email!)
            .select()
            .single();
          merchant = updatedMerchant;
        } else {
          merchant = existingByEmail;
        }
      } else {
        const { data: newMerchant, error: createError } = await supabaseAdmin
          .from('merchants')
          .insert({
            id: user.id,
            email: user.email!,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'New Merchant',
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

  if (!merchant) {
    return (
      <div className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-elev-1">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-semibold">{t('notFound')}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('notFoundHint')} <code className="rounded bg-accent px-2 py-0.5 text-foreground">seed.sql</code>
          </p>
        </div>
      </div>
    );
  }

  const onboardingDone = merchant.onboarding_completed ?? merchant.onboarding_complete;
  if (!onboardingDone && !forceDashboard) {
    redirect({ href: '/onboarding/profile', locale });
  }

  const hasStripeAccount = !!merchant.stripe_account_id;
  const isOnboardingComplete = !!merchant.stripe_onboarding_complete;

  const { data: contract } = await supabaseAdmin
    .from('contracts')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  const { data: debtorsData } = await supabaseAdmin.from('debtors').select('*').eq('merchant_id', merchantId);
  const debtors: DebtorRow[] = (debtorsData ?? []) as DebtorRow[];
  const { data: recoveryActionsData } = await supabaseAdmin
    .from('recovery_actions')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false })
    .limit(250);
  const recoveryActions: RecoveryActionRow[] = (recoveryActionsData ?? []) as RecoveryActionRow[];

  async function handleUpload(formData: FormData) {
    'use server';
    await uploadContract(formData);
    revalidatePath('/dashboard');
  }

  async function handleAddDebtor(formData: FormData) {
    'use server';
    await addDebtor(formData);
    revalidatePath('/[locale]/dashboard', 'page');
  }

  async function handleUpdateSettings(formData: FormData) {
    'use server';
    const name = formData.get('name') as string;
    const strictness = parseInt(formData.get('strictness') as string);
    const settlement = parseFloat(formData.get('settlement') as string) / 100;
    await updateMerchantSettings({
      name,
      strictness_level: strictness,
      settlement_floor: settlement,
    });
    revalidatePath('/dashboard');
  }

  async function handleRecoveryAction(formData: FormData) {
    'use server';
    await updateRecoveryStatus(formData);
    revalidatePath('/[locale]/dashboard', 'page');
  }

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
    if (sortBy === 'overdue_desc') return (b.days_overdue ?? 0) - (a.days_overdue ?? 0);
    if (sortBy === 'created_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return getRecoveryScore(b) - getRecoveryScore(a);
  });

  const top20Debtors = prioritizedDebtors.slice(0, 20);

  const actionTimelineByDebtor = recoveryActions.reduce<Record<string, RecoveryActionRow[]>>((acc, action) => {
    acc[action.debtor_id] = acc[action.debtor_id] || [];
    if (acc[action.debtor_id].length < 3) acc[action.debtor_id].push(action);
    return acc;
  }, {});

  const totalOutstanding = debtors.reduce((acc, d) => acc + (d.status !== 'paid' ? d.total_debt : 0), 0);
  const totalRecovered = debtors.reduce((acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0), 0);
  const contactedToday = debtors.filter((d) => {
    if (!d.last_contacted) return false;
    const lc = new Date(d.last_contacted);
    const now = new Date();
    return lc.getUTCFullYear() === now.getUTCFullYear() && lc.getUTCMonth() === now.getUTCMonth() && lc.getUTCDate() === now.getUTCDate();
  }).length;
  const promises = debtors.filter((d) => d.status === 'promise_to_pay').length;

  const stats = [
    {
      label: t('outstanding'),
      value: `$${totalOutstanding.toLocaleString()}`,
      icon: BadgeDollarSign,
      trend: '+4.5%',
      sub: t('momChange'),
    },
    {
      label: t('recovered'),
      value: `$${totalRecovered.toLocaleString()}`,
      icon: TrendingUp,
      trend: '+12%',
      sub: t('vsAvg'),
    },
    {
      label: 'Contacted Today',
      value: String(contactedToday),
      icon: MessageSquare,
      trend: `${Math.round((contactedToday / Math.max(1, actionableDebtors.length)) * 100)}%`,
      sub: 'QUEUE TOUCHED',
    },
    {
      label: 'Promises',
      value: String(promises),
      icon: CheckCircle2,
      trend: `MIN ${Math.round(merchant.settlement_floor * 100)}%`,
      sub: 'PROMISE TO PAY',
    },
  ];

  return (
    <div id="top" className="min-h-screen bg-background pb-24 text-foreground md:pb-10">
      <nav className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <Logo className="h-8 w-auto" />
          </Link>
          <DashboardTopNav
            merchantName={merchant.name}
            hasStripeAccount={hasStripeAccount}
            isOnboardingComplete={isOnboardingComplete}
            locale={locale}
          />
        </div>
      </nav>

      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-2xl border border-border bg-card p-6 shadow-elev-1 sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{t('overview')}</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{t('title')}</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">{t('subtitle')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="#debtors" className="inline-flex h-10 items-center rounded-xl border border-border bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-accent">
                {t('debtors')}
              </a>
              <a href="#settings" className="inline-flex h-10 items-center rounded-xl border border-border bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-accent">
                {t('settings')}
              </a>
              <a href="#knowledge" className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
                {t('ragContext')}
              </a>
            </div>
          </div>
        </header>

        {stripeSuccess && isOnboardingComplete && (
          <div className="rounded-2xl border border-success/30 bg-success/10 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-success/30 bg-success/10 text-success">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Gateway Activated</p>
                  <p className="text-sm text-muted-foreground">Your Stripe Connect account is ready to receive payments.</p>
                </div>
              </div>
              <Link href="/dashboard" className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                Dismiss
              </Link>
            </div>
          </div>
        )}

        {!isOnboardingComplete && (
          <section className="rounded-2xl border border-border bg-card p-5 shadow-elev-1 sm:p-7">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{hasStripeAccount ? 'Complete Gateway Setup' : 'Activate Gateway'}</h2>
                  <p className="mt-1 max-w-xl text-sm text-muted-foreground">
                    {hasStripeAccount
                      ? 'You already started setup. Finish onboarding to start receiving recovered funds.'
                      : 'Connect Stripe to collect debtor payments directly and track resolution in one flow.'}
                  </p>
                </div>
              </div>
              <form action={createStripeConnectAccount} className="w-full md:w-auto">
                <input type="hidden" name="locale" value={locale} />
                <button className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 md:w-auto">
                  {hasStripeAccount ? 'Resume Onboarding' : 'Setup Stripe Connect'}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {stats.map((stat) => (
            <article key={stat.label} className="rounded-2xl border border-border bg-card p-4 shadow-elev-1 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">{stat.value}</p>
                </div>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-foreground">
                  {stat.trend}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{stat.sub}</span>
              </div>
            </article>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div id="debtors" className="order-1 lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-elev-1">
              <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight">{t('activeRecoveries')}</h2>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Secure protocol active</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <form method="get" className="flex flex-wrap items-center gap-2">
                    <input type="hidden" name="force_dashboard" value="true" />
                    <select name="status" defaultValue={statusFilter} className="h-10 rounded-xl border border-border bg-background px-2 text-[11px]">
                      <option value="all">all status</option>
                      {COLLECTION_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                    <select name="overdue" defaultValue={overdueFilter} className="h-10 rounded-xl border border-border bg-background px-2 text-[11px]">
                      <option value="all">all overdue</option>
                      <option value="0_30">0-30d</option>
                      <option value="31_60">31-60d</option>
                      <option value="61_plus">61+d</option>
                    </select>
                    <select name="amount" defaultValue={amountFilter} className="h-10 rounded-xl border border-border bg-background px-2 text-[11px]">
                      <option value="all">all amount</option>
                      <option value="lt_200">&lt;200</option>
                      <option value="200_999">200-999</option>
                      <option value="1000_plus">1000+</option>
                    </select>
                    <select name="sort" defaultValue={sortBy} className="h-10 rounded-xl border border-border bg-background px-2 text-[11px]">
                      <option value="score_desc">score</option>
                      <option value="amount_desc">amount</option>
                      <option value="overdue_desc">overdue</option>
                      <option value="created_desc">newest</option>
                    </select>
                    <button className="inline-flex h-10 items-center rounded-xl border border-border bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
                      apply
                    </button>
                  </form>
                  <Link
                    href="/api/recovery/export"
                    prefetch={false}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Export CSV
                  </Link>
                  <Link
                    href="/api/recovery/audit-export"
                    prefetch={false}
                    className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-background px-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Audit CSV
                  </Link>
                </div>
              </div>

              {prioritizedDebtors.length ? (
                <>
                  <div className="space-y-3 p-4 md:hidden">
                    {prioritizedDebtors.map((d) => (
                      <article key={d.id} className="rounded-xl border border-border bg-background p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold">{d.name}</p>
                            <p className="text-xs text-muted-foreground">{d.email}</p>
                            <p className="mt-2 text-sm font-semibold">
                              {d.currency} {d.total_debt.toLocaleString()}
                            </p>
                          </div>
                          <span className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusBadgeClass(d.status)}`}>
                            {getStatusLabel(d.status)}
                          </span>
                        </div>
                        {actionTimelineByDebtor[d.id]?.length ? (
                          <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                            {actionTimelineByDebtor[d.id].map((a, idx) => (
                              <li key={`${d.id}-${idx}`}>
                                {new Date(a.created_at).toLocaleDateString()} · operator · {a.action_type} → {a.status_after}{a.note ? ` · ${a.note}` : ''}
                              </li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-4 space-y-2">
                          <form action={handleRecoveryAction} className="space-y-2">
                            <input type="hidden" name="debtor_id" value={d.id} />
                            <div className="flex items-center gap-2">
                              <select name="action_type" defaultValue="status_update" className="h-9 rounded-lg border border-input bg-card px-2 text-xs">
                                {OPERATOR_ACTION_TYPES.map((actionType) => (
                                  <option key={actionType} value={actionType}>{actionType}</option>
                                ))}
                              </select>
                              <select name="status" defaultValue={d.status} className="h-9 flex-1 rounded-lg border border-input bg-card px-2 text-xs">
                                {COLLECTION_STATUSES.map((status) => (
                                  <option key={status} value={status}>{status}</option>
                                ))}
                              </select>
                              <button className="h-9 rounded-lg border border-border px-3 text-[10px] font-semibold uppercase tracking-[0.12em]">Save</button>
                            </div>
                            <input name="note" placeholder="note (optional)" className="h-9 w-full rounded-lg border border-input bg-card px-2 text-xs" />
                            <label className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              <input type="checkbox" name="confirm_escalated" value="yes" className="checkbox checkbox-xs" />
                              confirm escalation
                            </label>
                          </form>
                          <div className="flex justify-end">
                            <Link
                              href={`/chat/${d.id}`}
                              className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-card px-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground"
                            >
                              {t('joinAI')}
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full text-left">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('debtorDetails')}</th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('exposure')}</th>
                          <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('agentStatus')}</th>
                          <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('protocol')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {prioritizedDebtors.map((d) => (
                          <tr key={d.id} className="hover:bg-background/60">
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.email}</p>
                              {actionTimelineByDebtor[d.id]?.[0] ? (
                                <p className="mt-1 text-[11px] text-muted-foreground">
                                  Last: {actionTimelineByDebtor[d.id][0].action_type} → {actionTimelineByDebtor[d.id][0].status_after}
                                </p>
                              ) : null}
                            </td>
                            <td className="px-6 py-4">
                              <p className="text-sm font-semibold">
                                {d.currency} {d.total_debt.toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">{d.days_overdue ?? 0} days overdue • score {getRecoveryScore(d)}</p>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusBadgeClass(d.status)}`}>
                                {getStatusLabel(d.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <form action={handleRecoveryAction} className="flex items-center gap-2">
                                  <input type="hidden" name="debtor_id" value={d.id} />
                                  <select name="action_type" defaultValue="status_update" className="h-9 rounded-lg border border-input bg-background px-2 text-xs">
                                    {OPERATOR_ACTION_TYPES.map((actionType) => (
                                      <option key={actionType} value={actionType}>{actionType}</option>
                                    ))}
                                  </select>
                                  <select name="status" defaultValue={d.status} className="h-9 rounded-lg border border-input bg-background px-2 text-xs">
                                    {COLLECTION_STATUSES.map((status) => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                  <input name="note" placeholder="note" className="h-9 w-32 rounded-lg border border-input bg-background px-2 text-xs" />
                                  <label className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <input type="checkbox" name="confirm_escalated" value="yes" className="checkbox checkbox-xs" />
                                    escalate
                                  </label>
                                  <button className="h-9 rounded-lg border border-border px-3 text-[10px] font-semibold uppercase tracking-[0.12em]">Save</button>
                                </form>
                                <Link
                                  href={`/chat/${d.id}`}
                                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-border bg-background px-3 text-xs font-semibold uppercase tracking-[0.12em] text-foreground"
                                >
                                  {t('joinAI')}
                                  <ArrowUpRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-dashed border-border bg-background text-muted-foreground">
                    <Plus className="h-5 w-5" />
                  </div>
                  <p className="font-semibold">{t('noRecoveries')}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t('noRecoveriesHint')}</p>
                </div>
              )}
            </div>
          </div>

          <aside className="order-2 space-y-6 lg:col-span-4">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-elev-1 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top 20 Today</h2>
                <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Pilot Board</span>
              </div>
              <div className="space-y-2">
                {top20Debtors.slice(0, 8).map((d, idx) => (
                  <div key={d.id} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2">
                    <div>
                      <p className="text-xs font-semibold">#{idx + 1} {d.name}</p>
                      <p className="text-[11px] text-muted-foreground">{d.currency} {d.total_debt.toLocaleString()} • {d.days_overdue ?? 0}d</p>
                    </div>
                    <span className="text-xs font-semibold">{getRecoveryScore(d)}</span>
                  </div>
                ))}
              </div>
            </section>

            <section id="settings" className="rounded-2xl border border-border bg-card p-5 shadow-elev-1 sm:p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-foreground">
                  <Settings className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold">{t('agentParams')}</h2>
              </div>

              <form action={handleUpdateSettings} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Business Name</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={merchant.name}
                    className="h-11 w-full rounded-xl border border-input bg-background px-4 text-sm text-foreground focus:border-ring focus:outline-none"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('strictnessLabel')}</label>
                    <span className="text-sm font-semibold">{merchant.strictness_level}/10</span>
                  </div>
                  <input
                    type="range"
                    name="strictness"
                    min="1"
                    max="10"
                    defaultValue={merchant.strictness_level}
                    className="range range-xs"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('settlementFloor')}</label>
                    <span className="text-sm font-semibold">{Math.round(merchant.settlement_floor * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    name="settlement"
                    min="50"
                    max="100"
                    defaultValue={merchant.settlement_floor * 100}
                    className="range range-xs"
                  />
                </div>

                <button className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary text-sm font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90">
                  {t('applyUpdates')}
                </button>
              </form>
            </section>

            <section id="knowledge" className="rounded-2xl border border-border bg-card p-5 shadow-elev-1 sm:p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-background text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                  <h2 className="text-lg font-semibold">{t('ragContext')}</h2>
                </div>
                {contract && (
                  <span className="rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-success">
                    {t('active')}
                  </span>
                )}
              </div>

              <form action={handleUpload} className="space-y-4">
                <input id="contract-upload" type="file" name="contract" accept=".pdf" className="hidden" />
                <label
                  htmlFor="contract-upload"
                  className="flex h-28 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background text-muted-foreground hover:border-ring hover:text-foreground"
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-xs font-semibold uppercase tracking-[0.14em]">{t('replacePDF')}</span>
                </label>
                <button className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background text-xs font-semibold uppercase tracking-[0.14em] text-foreground hover:bg-accent">
                  Execute Indexing
                </button>
              </form>

              {contract && (
                <div className="mt-4 rounded-xl border border-border bg-background p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('currentFile')}</p>
                  <p className="mt-1 truncate text-sm font-medium text-foreground">{contract.file_name}</p>
                </div>
              )}
            </section>
          </aside>
        </section>
      </main>

      <MobileBottomBar addDebtorAction={handleAddDebtor} />
    </div>
  );
}

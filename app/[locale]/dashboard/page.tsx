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
  ArrowRight
} from 'lucide-react';

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

  if (!merchantId) {
    redirect({ href: '/login', locale });
  }

  const initialResponse = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();
    
  let merchant = initialResponse.data;
  const merchantError = initialResponse.error;

  if (merchantError || !merchant) {
    // Self-healing: If merchant not found by ID, check by email
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Try finding by email first to avoid unique constraint errors
      const { data: existingByEmail } = await supabaseAdmin
        .from('merchants')
        .select('*')
        .eq('email', user.email!)
        .single();

      if (existingByEmail) {
        // Update the existing record to match the auth ID if they differ
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
        // Truly doesn't exist, create it
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
          // Also seed a sample debtor
          await supabaseAdmin.from('debtors').insert({
            merchant_id: user.id,
            name: 'John Sample',
            email: 'john@example.com',
            total_debt: 1250.00,
            currency: 'USD',
            status: 'pending'
          });
        }
      }
    }
  }

  if (!merchant) {
    return (
      <div className="min-h-screen space-y-6 bg-background p-10 text-foreground">
        <div className="mx-auto flex w-20 h-20 items-center justify-center rounded-2xl border border-border bg-card shadow-elev-1">
          <ShieldCheck className="h-10 w-10 text-foreground" />
        </div>
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-black uppercase tracking-widest">{t('notFound')}</h1>
          <p className="text-sm text-muted-foreground">
            {t('notFoundHint')} <code className="rounded bg-accent px-2 py-0.5 text-foreground">seed.sql</code>
          </p>
        </div>
      </div>
    );
  }

  // Onboarding Check
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

  const { data: debtors } = await supabaseAdmin
    .from('debtors')
    .select('*')
    .eq('merchant_id', merchantId);

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

  const totalOutstanding = debtors?.reduce((acc, d) => acc + (d.status === 'pending' ? d.total_debt : 0), 0) || 0;
  const totalRecovered = debtors?.reduce((acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0), 0) || 0;

  return (
    <div id="top" className="relative min-h-screen bg-background pb-24 text-foreground selection:bg-primary selection:text-primary-foreground md:pb-12">

      {/* Top Nav */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/90 pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] pt-[env(safe-area-inset-top)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex justify-between items-center">
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

      <main className="relative z-10 mx-auto w-full max-w-7xl space-y-16 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        {/* Stripe Success Alert */}
        {stripeSuccess && isOnboardingComplete && (
          <div className="bg-success/10 border border-success/30 rounded-2xl p-6 flex items-center justify-between group animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#10b981]/20 rounded-full flex items-center justify-center text-success">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black uppercase tracking-widest text-foreground">Gateway Activated</p>
                <p className="text-xs text-muted-foreground font-medium">Your Stripe Connect account is now fully verified and ready to receive payments.</p>
              </div>
            </div>
            <Link href="/dashboard" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">Dismiss</Link>
          </div>
        )}

        {/* Stripe Onboarding Alert */}
        {!isOnboardingComplete && (
          <div className="relative group p-[1px] rounded-[2rem] overflow-hidden bg-gradient-to-br from-amber-500/50 to-transparent">
             <div className="bg-card rounded-[2rem] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 animate-pulse border border-amber-500/20">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">
                    {hasStripeAccount ? 'Complete Gateway Setup' : 'Activate Gateway'}
                  </h3>
                  <p className="text-muted-foreground text-sm font-medium max-w-md leading-relaxed">
                    {hasStripeAccount 
                      ? 'You have started the setup. Please finish the Stripe onboarding to start receiving funds.'
                      : 'Connect your Stripe account to enable Meziani AI to recover funds directly into your balance. A 5% platform fee applies.'}
                  </p>
                </div>
              </div>
              <form action={createStripeConnectAccount}>
                <input type="hidden" name="locale" value={locale} />
                <button className="w-full md:w-auto bg-primary hover:bg-white text-primary-foreground font-black text-xs px-10 py-5 rounded-2xl transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center group/btn">
                  {hasStripeAccount ? 'Resume Onboarding' : 'Setup Stripe Connect'}
                  <ArrowRight className="w-4 h-4 ml-3 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-foreground mb-2">
             <div className="h-px w-8 bg-primary/50" />
             <span className="text-[10px] font-black uppercase tracking-[0.3em]">{t('overview')}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase leading-none">{t('title')}</h2>
          <p className="text-muted-foreground text-sm font-medium max-w-lg">{t('subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t('outstanding'), value: `$${totalOutstanding.toLocaleString()}`, icon: BadgeDollarSign, trend: '+4.5%', sub: t('momChange'), color: 'hsl(var(--foreground))' },
            { label: t('recovered'), value: `$${totalRecovered.toLocaleString()}`, icon: TrendingUp, trend: '+12%', sub: t('vsAvg'), color: 'hsl(var(--success))' },
            { label: t('activeChats'), value: debtors?.length || 0, icon: MessageSquare, trend: '87%', sub: t('replyRate'), color: 'hsl(var(--muted-foreground))' },
            { label: t('avgSettle'), value: '82%', icon: CheckCircle2, trend: `MIN ${Math.round(merchant.settlement_floor * 100)}%`, sub: 'EFFICIENCY', color: 'hsl(var(--foreground))' }
          ].map((stat, i) => (
            <div key={i} className="group relative bg-card border border-border/70 rounded-[2rem] p-8 shadow-2xl overflow-hidden hover:bg-white/[0.05] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <stat.icon className="w-16 h-16" style={{ color: stat.color }} />
              </div>
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
                <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/5 border border-border text-muted-foreground tracking-widest">{stat.trend}</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{stat.sub}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Config & Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-12">
            {/* Agent Control */}
            <div id="settings" className="bg-card border border-border/70 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <div className="p-8 space-y-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-foreground border border-border">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-foreground">{t('agentParams')}</h2>
                  </div>
                </div>

                <form action={handleUpdateSettings} className="space-y-10">
                  <div className="space-y-4">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">Business Name (Statement Descriptor)</label>
                    <input 
                      type="text" 
                      name="name" 
                      defaultValue={merchant.name} 
                      placeholder="e.g. Venice Gym"
                      className="w-full bg-card border border-border rounded-xl px-4 py-3 text-xs font-bold text-foreground focus:border-ring focus:outline-none transition-all"
                    />
                    <p className="text-[9px] text-muted-foreground font-medium">This name will appear on the debtor&apos;s bank statement.</p>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{t('strictnessLabel')}</label>
                      <span className="text-2xl font-black text-foreground">{merchant.strictness_level}<span className="text-xs opacity-20 ml-1">/10</span></span>
                    </div>
                    <input type="range" name="strictness" min="1" max="10" defaultValue={merchant.strictness_level} className="range range-xs appearance-none bg-white/5 h-1.5 rounded-full accent-white cursor-pointer" />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>{t('empathetic')}</span>
                      <span>{t('legalistic')}</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-end">
                      <label className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">{t('settlementFloor')}</label>
                      <span className="text-2xl font-black text-foreground">{Math.round(merchant.settlement_floor * 100)}<span className="text-xs opacity-20 ml-1">%</span></span>
                    </div>
                    <input type="range" name="settlement" min="50" max="100" defaultValue={merchant.settlement_floor * 100} className="range range-xs appearance-none bg-white/5 h-1.5 rounded-full accent-white cursor-pointer" />
                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                      <span>{t('flexible')}</span>
                      <span>{t('fixed')}</span>
                    </div>
                  </div>

                  <button className="w-full bg-white text-primary-foreground hover:bg-primary hover:text-primary-foreground font-black text-xs py-4 rounded-2xl transition-all active:scale-[0.98] shadow-xl uppercase tracking-[0.2em]">
                    {t('applyUpdates')}
                  </button>
                </form>
              </div>
            </div>

            {/* Knowledge Base */}
            <div id="knowledge" className="bg-card border border-border/70 rounded-[2.5rem] overflow-hidden shadow-2xl relative group">
              <div className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground border border-border">
                      <FileText className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black uppercase tracking-widest text-foreground">{t('ragContext')}</h2>
                  </div>
                  {contract && (
                    <div className="px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-[9px] font-black tracking-widest uppercase">
                      {t('active')}
                    </div>
                  )}
                </div>

                <form action={handleUpload} className="space-y-5">
                  <div className="relative group">
                    <input type="file" name="contract" accept=".pdf" className="hidden" id="contract-upload" />
                    <label htmlFor="contract-upload" className="w-full h-32 border-2 border-dashed border-border rounded-[1.5rem] flex flex-col items-center justify-center gap-3 hover:border-ring hover:bg-card transition-all cursor-pointer group/label">
                       <Plus className="w-6 h-6 text-muted-foreground group-hover/label:text-foreground transition-colors" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover/label:text-foreground transition-colors">{t('replacePDF')}</span>
                    </label>
                  </div>
                  <button className="w-full bg-transparent border border-border text-muted-foreground hover:text-foreground hover:border-white font-black text-[10px] py-4 rounded-2xl transition-all uppercase tracking-[0.2em]">
                    EXECUTE INDEXING
                  </button>
                </form>
                {contract && (
                  <div className="bg-card/70 rounded-2xl p-4 border border-border/70">
                    <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest mb-1">{t('currentFile')}</p>
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3 text-foreground" />
                      <p className="text-[11px] text-muted-foreground truncate font-bold font-mono uppercase tracking-tighter">{contract.file_name}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div id="debtors" className="lg:col-span-8">
            <div className="bg-card border border-border/70 rounded-[3rem] overflow-hidden shadow-2xl min-h-[600px] flex flex-col">
              <div className="p-8 md:p-10 border-b border-border/70 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-card/80">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground border border-border">
                      <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-2xl font-black text-foreground tracking-tight uppercase">{t('activeRecoveries')}</h2>
                  </div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">SECURE PROTOCOL ACTIVE</p>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-none px-6 py-3 rounded-full bg-white/5 border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-white/10 transition-all">{t('filter')}</button>
                </div>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/70">
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('debtorDetails')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hidden md:table-cell">{t('exposure')}</th>
                      <th className="px-6 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">{t('agentStatus')}</th>
                      <th className="px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-right">{t('protocol')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {debtors?.map(d => (
                      <tr key={d.id} className="group hover:bg-card transition-all">
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/10 blur-md rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="w-14 h-14 bg-card border border-border rounded-2xl flex items-center justify-center shadow-2xl relative z-10 overflow-hidden">
                                <span className="text-sm font-black text-foreground">{d.name[0].toUpperCase()}</span>
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-card rounded-full" />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="font-black text-foreground text-sm uppercase tracking-wider group-hover:text-foreground transition-colors">{d.name}</div>
                              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{d.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-8 hidden md:table-cell">
                          <div className="font-black text-base text-foreground tracking-tight">{d.currency} {d.total_debt.toLocaleString()}</div>
                          <div className="text-[9px] text-destructive font-black uppercase tracking-widest mt-1">{t('daysPastDue').toUpperCase()}</div>
                        </td>
                        <td className="px-6 py-8">
                          <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                            d.status === 'pending' 
                              ? 'bg-accent border-border text-foreground' 
                              : 'bg-success/10 border-success/30 text-success'
                          }`}>
                            <div className={`w-1 h-1 rounded-full mr-2 animate-pulse ${d.status === 'pending' ? 'bg-foreground' : 'bg-success'}`} />
                            {d.status === 'pending' ? t('negotiating') : t('settled')}
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <Link
                            href={`/chat/${d.id}`}
                            className="inline-flex items-center gap-2 group/btn"
                          >
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover/btn:text-foreground transition-colors">{t('joinAI')}</span>
                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-border flex items-center justify-center text-muted-foreground group-hover/btn:bg-primary group-hover/btn:text-primary-foreground transition-all">
                              <ArrowUpRight className="w-4 h-4" />
                            </div>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {debtors?.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-card border border-dashed border-border flex items-center justify-center text-foreground/10">
                    <Plus className="w-8 h-8" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-foreground font-black uppercase tracking-widest">{t('noRecoveries')}</p>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em] max-w-[240px] mx-auto">{t('noRecoveriesHint')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Action Bar */}
      <MobileBottomBar addDebtorAction={handleAddDebtor} />

      {/* Luxury Brand Decoration */}
      <div className="fixed bottom-8 right-8 pointer-events-none opacity-20 hidden lg:block">
         <p className="text-[10px] font-black uppercase tracking-[0.5em] vertical-text text-foreground">WORLD CLASS RECOVERY • EST 2026</p>
      </div>
    </div>
  );
}

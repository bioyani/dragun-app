import { supabaseAdmin } from '@/lib/supabase-admin';
import { uploadContract } from '../../actions/upload-contract';
import { updateMerchantSettings } from '../../actions/merchant-settings';
import { addDebtor } from '../../actions/add-debtor';
import { revalidatePath } from 'next/cache';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import MobileBottomBar from '@/components/dashboard/MobileBottomBar';
import DashboardTopNav from '@/components/dashboard/DashboardTopNav';
import { getMerchantId } from '@/lib/auth';
import {
  Settings,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Users,
  BadgeDollarSign,
  Plus
} from 'lucide-react';

export default async function DashboardPage() {
  const t = await getTranslations('Dashboard');
  const merchantId = await getMerchantId();

  if (!merchantId) {
     return <div>Unauthorized</div>;
  }

  const { data: merchant, error: merchantError } = await supabaseAdmin
    .from('merchants')
    .select('*')
    .eq('id', merchantId)
    .single();

  if (merchantError || !merchant) {
    return (
      <div className="p-10 bg-base-100 min-h-screen text-base-content flex flex-col items-center justify-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h1 className="text-xl font-bold text-center">{t('notFound')}</h1>
        <p className="text-base-content/50 text-sm max-w-xs text-center">
          {t('notFoundHint')} <code className="bg-base-300 px-1 rounded">seed.sql</code>
        </p>
      </div>
    );
  }

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
    const strictness = parseInt(formData.get('strictness') as string);
    const settlement = parseFloat(formData.get('settlement') as string) / 100;
    await updateMerchantSettings({
      strictness_level: strictness,
      settlement_floor: settlement,
    });
    revalidatePath('/dashboard');
  }

  const totalOutstanding = debtors?.reduce((acc, d) => acc + (d.status === 'pending' ? d.total_debt : 0), 0) || 0;
  const totalRecovered = debtors?.reduce((acc, d) => acc + (d.status === 'paid' ? d.total_debt : 0), 0) || 0;

  return (
    <div id="top" className="bg-base-100 min-h-screen text-base-content selection:bg-primary selection:text-primary-content pb-20 md:pb-10">
      {/* Top Nav */}
      <nav className="border-b border-base-300 bg-base-100/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-base-content shadow-[0_0_15px_rgba(59,130,246,0.5)] text-xs transition-transform group-hover:scale-110">🐲</div>
            <h1 className="text-lg md:text-xl font-bold tracking-tight">{t('dragun')}</h1>
          </Link>
          <DashboardTopNav merchantName={merchant.name} />
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10 space-y-8 md:space-y-10">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl md:text-3xl font-bold text-base-content tracking-tight">{t('title')}</h2>
          <p className="text-base-content/60 text-sm">{t('subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          <div className="card bg-base-200/40 border border-base-300/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary/60"></div>
            <div className="card-body p-4 md:p-6">
              <div className="flex items-center gap-2 text-base-content/50 mb-1">
                <BadgeDollarSign className="w-3 h-3" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('outstanding')}</p>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-base-content">${totalOutstanding.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-error mt-2">
                <span className="font-bold">↑ 4.5%</span>
                <span className="opacity-40">{t('momChange')}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-200/40 border border-base-300/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-success/60"></div>
            <div className="card-body p-4 md:p-6">
              <div className="flex items-center gap-2 text-base-content/50 mb-1">
                <TrendingUp className="w-3 h-3" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('recovered')}</p>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-base-content">${totalRecovered.toLocaleString()}</h3>
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-success mt-2">
                <span className="font-bold">↑ 12%</span>
                <span className="opacity-40">{t('vsAvg')}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-200/40 border border-base-300/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent/60"></div>
            <div className="card-body p-4 md:p-6">
              <div className="flex items-center gap-2 text-base-content/50 mb-1">
                <MessageSquare className="w-3 h-3" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('activeChats')}</p>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-base-content">{debtors?.length || 0}</h3>
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-base-content/60 mt-2">
                <span className="font-bold">87%</span>
                <span className="opacity-40">{t('replyRate')}</span>
              </div>
            </div>
          </div>

          <div className="card bg-base-200/40 border border-base-300/50 shadow-lg overflow-hidden relative">
            <div className="absolute top-0 left-0 w-1 h-full bg-purple-500/60"></div>
            <div className="card-body p-4 md:p-6">
              <div className="flex items-center gap-2 text-base-content/50 mb-1">
                <CheckCircle2 className="w-3 h-3" />
                <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">{t('avgSettle')}</p>
              </div>
              <h3 className="text-xl md:text-3xl font-bold text-base-content">82%</h3>
              <div className="flex items-center gap-1 text-[10px] md:text-xs text-base-content/60 mt-2">
                <span className="font-bold">{t('min')} {Math.round(merchant.settlement_floor * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Config & Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Agent Control */}
            <div id="settings" className="card bg-base-100 border border-base-300/60 shadow-xl">
              <div className="card-body p-5 md:p-7">
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-base-content">{t('agentParams')}</h2>
                </div>

                <form action={handleUpdateSettings} className="space-y-8">
                  <div className="form-control">
                    <div className="flex justify-between items-end mb-3">
                      <label className="text-sm text-base-content/60 font-medium">{t('strictnessLabel')}</label>
                      <span className="text-lg font-bold text-primary">{merchant.strictness_level}<span className="text-xs opacity-40 ml-0.5">/10</span></span>
                    </div>
                    <input type="range" name="strictness" min="1" max="10" defaultValue={merchant.strictness_level} className="range range-primary range-xs" />
                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold opacity-30 mt-3">
                      <span>{t('empathetic')}</span>
                      <span>{t('legalistic')}</span>
                    </div>
                  </div>

                  <div className="form-control">
                    <div className="flex justify-between items-end mb-3">
                      <label className="text-sm text-base-content/60 font-medium">{t('settlementFloor')}</label>
                      <span className="text-lg font-bold text-accent">{Math.round(merchant.settlement_floor * 100)}%</span>
                    </div>
                    <input type="range" name="settlement" min="50" max="100" defaultValue={merchant.settlement_floor * 100} className="range range-accent range-xs" />
                    <div className="flex justify-between text-[10px] uppercase tracking-wider font-bold opacity-30 mt-3">
                      <span>{t('flexible')}</span>
                      <span>{t('fixed')}</span>
                    </div>
                  </div>

                  <button className="btn btn-primary w-full shadow-lg shadow-primary/10 border-none h-11">
                    {t('applyUpdates')}
                  </button>
                </form>
              </div>
            </div>

            {/* Knowledge Base */}
            <div id="knowledge" className="card bg-base-100 border border-base-300/60 shadow-xl">
              <div className="card-body p-5 md:p-7">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
                      <FileText className="w-4 h-4" />
                    </div>
                    <h2 className="text-lg font-bold text-base-content">{t('ragContext')}</h2>
                  </div>
                  {contract && <div className="badge badge-success badge-xs py-2 px-2 font-bold opacity-80">{t('active')}</div>}
                </div>

                <form action={handleUpload} className="space-y-4">
                  <div className="relative group">
                    <input type="file" name="contract" accept=".pdf" className="file-input file-input-bordered file-input-sm w-full bg-base-200/50 border-base-300 focus:border-primary/50 text-xs" />
                  </div>
                  <button className="btn btn-outline btn-sm w-full border-base-300 hover:bg-base-300 hover:border-base-content/20 text-[11px] uppercase tracking-widest font-bold h-10">
                    {t('replacePDF')}
                  </button>
                </form>
                {contract && (
                  <div className="bg-base-200/80 rounded-lg p-3 mt-4 border border-base-300/50">
                    <p className="text-[10px] text-base-content/50 uppercase font-bold tracking-tighter mb-1">{t('currentFile')}</p>
                    <p className="text-[11px] text-base-content/80 truncate font-mono">{contract.file_name}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div id="debtors" className="lg:col-span-8 order-1 lg:order-2">
            <div className="card bg-base-100 border border-base-300/60 shadow-xl h-full overflow-hidden">
              <div className="card-body p-0">
                <div className="p-5 md:p-7 border-b border-base-300/60 flex justify-between items-center bg-base-200/20">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                      <Users className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg md:text-xl font-bold text-base-content tracking-tight">{t('activeRecoveries')}</h2>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-xs text-base-content/50 hover:text-base-content">{t('filter')}</button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full text-base-content/80 border-separate border-spacing-0">
                    <thead>
                      <tr className="bg-base-100">
                        <th className="bg-transparent text-base-content/50 uppercase text-[10px] tracking-widest py-4 pl-7 border-b border-base-300">{t('debtorDetails')}</th>
                        <th className="bg-transparent text-base-content/50 uppercase text-[10px] tracking-widest py-4 border-b border-base-300 hidden sm:table-cell">{t('exposure')}</th>
                        <th className="bg-transparent text-base-content/50 uppercase text-[10px] tracking-widest py-4 border-b border-base-300">{t('agentStatus')}</th>
                        <th className="bg-transparent text-base-content/50 uppercase text-[10px] tracking-widest py-4 pr-7 text-right border-b border-base-300">{t('protocol')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {debtors?.map(d => (
                        <tr key={d.id} className="group hover:bg-base-200/40 transition-all border-base-300/50">
                          <td className="py-4 pl-7 border-b border-base-300/40">
                            <div className="flex items-center gap-3 md:gap-4">
                              <div className="avatar placeholder ring-1 ring-base-300 rounded-lg p-0.5">
                                <div className="bg-base-200 text-base-content/50 rounded-lg w-10 md:w-12 h-10 md:h-12 shadow-inner">
                                  <span className="text-xs md:text-sm font-bold">{d.name[0]}</span>
                                </div>
                              </div>
                              <div className="space-y-0.5">
                                <div className="font-bold text-base-content text-xs md:text-sm tracking-tight">{d.name}</div>
                                <div className="text-[10px] md:text-xs text-base-content/50 font-medium">{d.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 border-b border-base-300/40 hidden sm:table-cell">
                            <div className="font-bold text-sm text-base-content">{d.currency} {d.total_debt.toLocaleString()}</div>
                            <div className="text-[10px] text-base-content/50 font-medium">{t('daysPastDue')}</div>
                          </td>
                          <td className="py-4 border-b border-base-300/40">
                            <div className={`badge badge-sm py-2.5 px-3 border-none text-[9px] md:text-[10px] font-black uppercase tracking-tighter ${
                              d.status === 'pending' ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20' : 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                            }`}>
                              {d.status === 'pending' ? t('negotiating') : t('settled')}
                            </div>
                          </td>
                          <td className="py-4 pr-7 text-right border-b border-base-300/40">
                            <Link
                              href={`/chat/${d.id}`}
                              className="btn btn-primary btn-outline btn-xs md:btn-sm h-8 md:h-9 rounded-lg px-3 md:px-5 hover:bg-primary hover:text-base-content transition-all text-[10px] md:text-xs font-bold uppercase tracking-widest border-base-300"
                            >
                              {t('joinAI')}
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {debtors?.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-4">
                    <div className="p-4 bg-base-200 rounded-full text-base-content/40">
                      <Plus className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base-content font-bold">{t('noRecoveries')}</p>
                      <p className="text-base-content/50 text-sm mt-1">{t('noRecoveriesHint')}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Action Bar */}
      <MobileBottomBar addDebtorAction={handleAddDebtor} />
    </div>
  );
}

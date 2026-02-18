'use client';

import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';

interface Debtor {
  id: string;
  merchant_id: string;
  name: string;
  currency: string;
  total_debt: number;
  merchant: {
    name: string;
    settlement_floor: number;
  };
}

export default function PaymentPage({ params }: { params: Promise<{ debtorId: string }> }) {
  const { debtorId } = use(params);
  const t = useTranslations('Pay');
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebtor() {
      const { data } = await supabase
        .from('debtors')
        .select('*, merchant:merchants(*)')
        .eq('id', debtorId)
        .single();
      setDebtor(data);
      setLoading(false);
    }
    fetchDebtor();
  }, [debtorId]);

  const handlePayment = async (amount: number, description: string) => {
    if (!debtor) return;
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        debtorId,
        merchantId: debtor.merchant_id,
        amount,
        currency: debtor.currency,
        description,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  if (loading) return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!debtor) return <div className="p-10 text-error bg-base-100 min-h-screen text-center">{t('notFound')}</div>;

  const fullDebt = debtor.total_debt;
  const settlementFloor = debtor.merchant.settlement_floor;
  const settlementAmount = fullDebt * Math.max(0.7, settlementFloor);
  const savingPercent = Math.round((1 - settlementAmount / fullDebt) * 100);

  return (
    <div className="min-h-screen bg-base-100 text-base-content py-16 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 blur-[120px] rounded-full -z-10"></div>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="flex justify-start">
          <Link href={`/chat/${debtorId}`} className="flex items-center gap-2 text-base-content/50 hover:text-base-content transition-colors group text-xs font-bold uppercase tracking-widest">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
            {t('returnToChat')}
          </Link>
        </div>

        <div className="text-center space-y-4">
          <div className="badge badge-outline border-primary/30 text-primary text-[10px] font-bold uppercase tracking-widest px-4 py-3">{t('portalBadge')}</div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-base-content tracking-tight">
            {t('title')} <span className="text-primary">{t('titleHighlight')}</span> {t('titleEnd')}
          </h1>
          <p className="text-base-content/60 max-w-xl mx-auto text-sm leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          {/* Pay in Full */}
          <div className="card bg-base-200/50 border border-base-300 shadow-xl hover:border-primary/50 transition-all duration-300 group">
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-base-content group-hover:text-primary transition-colors">{t('payInFull')}</h3>
                <p className="text-xs text-base-content/50 mt-1">{t('payInFullDesc')}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-base-content">{debtor.currency} {fullDebt.toLocaleString()}</span>
              </div>
              <ul className="space-y-3 text-xs text-base-content/60 flex-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit1Full')}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit2Full')}
                </li>
              </ul>
              <button onClick={() => handlePayment(fullDebt, 'Full Debt Payment')} className="btn btn-primary w-full rounded-xl border-none shadow-lg shadow-primary/20">
                {t('payFullButton')}
              </button>
            </div>
          </div>

          {/* Lump Sum Settlement */}
          <div className="card bg-base-200/80 border-2 border-primary shadow-[0_0_30px_rgba(59,130,246,0.15)] relative scale-105 z-10">
            <div className="absolute top-0 right-0 bg-primary text-base-content text-[9px] font-extrabold px-3 py-1 rounded-bl-xl uppercase tracking-tighter">{t('recommended')}</div>
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-base-content">{t('lumpSum')}</h3>
                <p className="text-xs text-base-content/60 mt-1">{t('lumpSumDesc')}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-base-content">{debtor.currency} {settlementAmount.toLocaleString()}</span>
                <span className="text-xs text-base-content/50 line-through opacity-50">{fullDebt}</span>
              </div>
              <ul className="space-y-3 text-xs text-base-content/80 flex-1">
                <li className="flex items-center gap-2 font-bold">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit1Lump', { percent: savingPercent })}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit2Lump')}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit3Lump')}
                </li>
              </ul>
              <button onClick={() => handlePayment(settlementAmount, 'One-time Settlement')} className="btn btn-primary w-full rounded-xl shadow-xl shadow-primary/30 border-none">
                {t('acceptSettlement')}
              </button>
            </div>
          </div>

          {/* Installment Plan */}
          <div className="card bg-base-200/50 border border-base-300 shadow-xl">
            <div className="card-body p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-base-content">{t('installments')}</h3>
                <p className="text-xs text-base-content/50 mt-1">{t('installmentsDesc')}</p>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-base-content">{debtor.currency} {(fullDebt / 3).toLocaleString()}</span>
                <span className="text-xs text-base-content/50">{t('perMonth')}</span>
              </div>
              <ul className="space-y-3 text-xs text-base-content/60 flex-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit1Install')}
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  {t('benefit2Install')}
                </li>
              </ul>
              <button onClick={() => handlePayment(fullDebt / 3, 'First Installment')} className="btn btn-accent btn-outline w-full rounded-xl">
                {t('startInstallments')}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-base-200/30 border border-base-300 rounded-2xl p-6 text-center">
          <p className="text-xs text-base-content/50">
            {t('disclaimer', { merchant: debtor.merchant.name })}
          </p>
        </div>
      </div>
    </div>
  );
}

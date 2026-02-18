'use client';

import { useChat } from '@ai-sdk/react';
import { use, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { supabase } from '@/lib/supabase';

interface Debtor {
  id: string;
  name: string;
  currency: string;
  total_debt: number;
  merchant: {
    name: string;
    strictness_level: number;
  };
}

export default function ChatPage({ params }: { params: Promise<{ debtorId: string }> }) {
  const { debtorId } = use(params);
  const t = useTranslations('Chat');
  const [debtor, setDebtor] = useState<Debtor | null>(null);
  const [loading, setLoading] = useState(true);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    body: { debtorId },
  });

  useEffect(() => {
    async function fetchDebtor() {
      const { data } = await supabase
        .from('debtors')
        .select('*, merchant:merchants(name, strictness_level)')
        .eq('id', debtorId)
        .single();
      setDebtor(data);
      setLoading(false);
    }
    fetchDebtor();
  }, [debtorId]);

  if (loading) return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center">
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );

  if (!debtor) return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center text-error">
      {t('notFound')}
    </div>
  );

  const actionChips = [
    t('chipPay'),
    t('chipFriday'),
    t('chipDispute'),
    t('chipSettlement'),
  ];

  return (
    <div className="flex flex-col h-screen bg-base-100 text-base-content max-w-md mx-auto border-x border-base-300 shadow-2xl relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[120px] rounded-full -z-10"></div>

      {/* Header */}
      <header className="p-4 border-b border-base-300 bg-base-100/80 backdrop-blur-md flex items-center gap-3 sticky top-0 z-10">
        <Link href="/dashboard" className="p-2 hover:bg-base-200 rounded-lg transition-colors text-base-content/50 hover:text-base-content group">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:-translate-x-1"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
        <div className="avatar placeholder">
          <div className="bg-primary text-base-content rounded-xl w-10 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
            <span className="font-bold text-sm">{debtor.merchant.name[0]}</span>
          </div>
        </div>
        <div className="flex-1">
          <h1 className="font-bold text-sm tracking-tight">{debtor.merchant.name} {t('support')}</h1>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse"></div>
            <span className="text-[10px] text-base-content/50 font-medium uppercase tracking-widest">{t('agentActive')}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-base-content/50 uppercase font-bold tracking-tighter">{t('balanceDue')}</div>
          <div className="text-sm font-bold text-base-content">{debtor.currency} {debtor.total_debt.toLocaleString()}</div>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
        {messages.length === 0 && (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 bg-base-200 border border-base-300 rounded-2xl flex items-center justify-center text-3xl mx-auto shadow-xl">🐲</div>
            <div className="space-y-1">
              <p className="font-bold text-base-content">{t('automatedAgent')}</p>
              <p className="text-xs text-base-content/50 max-w-[200px] mx-auto">{t('agentIntro', { merchant: debtor.merchant.name })}</p>
            </div>
            <div className="badge badge-outline border-base-300 text-[10px] text-base-content/50 py-3">{t('encrypted')}</div>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} className={`chat ${m.role === 'user' ? 'chat-end' : 'chat-start'}`}>
            <div className={`chat-bubble text-sm leading-relaxed ${
              m.role === 'user'
                ? 'bg-primary text-base-content shadow-lg shadow-primary/20'
                : 'bg-base-200 border border-base-300 text-base-content shadow-xl'
            }`}>
              {m.parts.map((part, i) => (
                part.type === 'text' ? <span key={i}>{part.text}</span> : null
              ))}
            </div>
            <div className="chat-footer opacity-30 text-[9px] mt-1 uppercase tracking-tighter">
              {m.role === 'user' ? t('sent') : t('dragunAI')}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-bubble bg-base-200 border border-base-300 py-3">
              <span className="loading loading-dots loading-xs opacity-50"></span>
            </div>
          </div>
        )}
      </main>

      {/* Action Chips */}
      <section className="px-4 py-3 flex gap-2 overflow-x-auto border-t border-base-200 bg-base-100/50 no-scrollbar">
        {actionChips.map(chip => (
          <button
            key={chip}
            className="btn btn-xs rounded-full bg-base-200 border-base-300 text-base-content/60 hover:border-primary hover:text-primary transition-all whitespace-nowrap font-medium px-4"
            onClick={() => {
              const e = { target: { value: chip } } as React.ChangeEvent<HTMLInputElement>;
              handleInputChange(e);
              setTimeout(() => {
                const form = document.querySelector('form') as HTMLFormElement;
                form?.requestSubmit();
              }, 50);
            }}
          >
            {chip}
          </button>
        ))}
      </section>

      {/* Input Area */}
      <footer className="p-4 bg-base-100 border-t border-base-200">
        <form onSubmit={handleSubmit} className="relative flex items-center">
          <input
            className="input w-full bg-base-200 border-base-300 focus:border-primary focus:outline-none text-sm h-12 pr-14 rounded-xl placeholder:text-base-content/40"
            value={input}
            placeholder={t('placeholder')}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="absolute right-2 btn btn-primary btn-sm h-8 min-h-0 w-10 rounded-lg p-0 shadow-lg shadow-primary/20 border-none"
            disabled={isLoading || !input.trim()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between px-2">
          <Link href={`/pay/${debtorId}`} className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline">
            {t('settlementPlans')}
          </Link>
          <div className="text-[9px] opacity-20 uppercase font-bold">{t('secureGateway')}</div>
        </div>
      </footer>
    </div>
  );
}

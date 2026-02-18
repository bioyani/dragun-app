'use client';

import { useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, Plus, Users } from 'lucide-react';

interface Props {
  addDebtorAction: (formData: FormData) => Promise<void>;
}

export default function MobileBottomBar({ addDebtorAction }: Props) {
  const t = useTranslations('Dashboard');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addDebtorAction(formData);
      dialogRef.current?.close();
      formRef.current?.reset();
    });
  }

  return (
    <>
      {/* Add Debtor Modal */}
      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-base-100 border border-base-300 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-lg text-base-content">{t('addDebtor')}</h3>
          </div>

          <form ref={formRef} action={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <label className="form-control">
                <span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                  {t('debtorName')}
                </span>
                <input
                  name="name"
                  required
                  type="text"
                  placeholder="Jane Smith"
                  className="input input-bordered input-sm w-full bg-base-200 border-base-300 focus:border-primary/50"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                  {t('debtorEmail')}
                </span>
                <input
                  name="email"
                  required
                  type="email"
                  placeholder="jane@example.com"
                  className="input input-bordered input-sm w-full bg-base-200 border-base-300 focus:border-primary/50"
                />
              </label>

              <label className="form-control">
                <span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                  {t('debtorPhone')}
                </span>
                <input
                  name="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="input input-bordered input-sm w-full bg-base-200 border-base-300 focus:border-primary/50"
                />
              </label>

              <div className="grid grid-cols-3 gap-3">
                <label className="form-control col-span-2">
                  <span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                    {t('debtorDebt')}
                  </span>
                  <input
                    name="total_debt"
                    required
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="1500.00"
                    className="input input-bordered input-sm w-full bg-base-200 border-base-300 focus:border-primary/50"
                  />
                </label>

                <label className="form-control">
                  <span className="label-text text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5 block">
                    {t('debtorCurrency')}
                  </span>
                  <select
                    name="currency"
                    className="select select-bordered select-sm w-full bg-base-200 border-base-300"
                  >
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                className="btn btn-ghost btn-sm flex-1 border border-base-300"
                onClick={() => dialogRef.current?.close()}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="btn btn-primary btn-sm flex-1"
              >
                {isPending ? <span className="loading loading-spinner loading-xs" /> : t('addDebtorSubmit')}
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button type="submit">close</button>
        </form>
      </dialog>

      {/* Bottom Nav Bar */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-base-100/80 backdrop-blur-xl border-t border-base-300 z-30 px-8 pb-safe flex justify-between items-end shadow-[0_-10px_30px_rgba(0,0,0,0.5)]" style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}>
        {/* Overview */}
        <a
          href="#top"
          className="flex flex-col items-center gap-1 py-3 text-primary"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">{t('overview')}</span>
        </a>

        {/* Add Debtor — floating center button */}
        <button
          onClick={() => dialogRef.current?.showModal()}
          className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] -translate-y-4 border-4 border-base-100 text-base-content transition-transform active:scale-95"
          aria-label={t('addDebtor')}
        >
          <Plus className="w-6 h-6" />
        </button>

        {/* Debtors */}
        <a
          href="#debtors"
          className="flex flex-col items-center gap-1 py-3 text-base-content/50 hover:text-base-content/80 transition-colors"
        >
          <Users className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">{t('debtors')}</span>
        </a>
      </div>
    </>
  );
}

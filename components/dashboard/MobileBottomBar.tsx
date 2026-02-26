'use client';

import { useRef, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { BarChart3, Plus, Users, X, DollarSign, Mail, User } from 'lucide-react';

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
      <dialog ref={dialogRef} className="modal modal-bottom sm:modal-middle text-foreground">
        <div className="modal-box overflow-hidden rounded-2xl border border-border bg-popover p-0 shadow-elev-2">
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-foreground">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-[0.12em] text-foreground">{t('addDebtor')}</h3>
                  <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Create recovery case</p>
                </div>
              </div>
              <button
                onClick={() => dialogRef.current?.close()}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form ref={formRef} action={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('debtorName')}</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="name"
                    required
                    type="text"
                    placeholder="Jane Smith"
                    className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('debtorEmail')}</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    name="email"
                    required
                    type="email"
                    placeholder="jane@example.com"
                    className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('debtorDebt')}</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      name="total_debt"
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="1500.00"
                      className="w-full rounded-xl border border-border bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('debtorCurrency')}</label>
                  <select
                    name="currency"
                    className="h-[50px] w-full cursor-pointer rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground outline-none focus:border-ring"
                  >
                    <option value="USD">USD</option>
                    <option value="CAD">CAD</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-primary text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {isPending ? <span className="loading loading-spinner loading-xs" /> : t('addDebtorSubmit')}
              </button>
            </form>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop bg-background/80 backdrop-blur-sm">
          <button type="submit">close</button>
        </form>
      </dialog>

      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-20 items-center justify-between border-t border-border bg-background px-6 pb-[env(safe-area-inset-bottom)] pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:hidden">
        <a href="#top" className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 text-foreground">
          <BarChart3 className="h-5 w-5" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">{t('overview')}</span>
        </a>

        <button
          onClick={() => dialogRef.current?.showModal()}
          className="-translate-y-7 flex h-14 w-14 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-elev-2 active:scale-95"
          aria-label={t('addDebtor')}
        >
          <Plus className="h-6 w-6" />
        </button>

        <a href="#debtors" className="flex min-h-11 min-w-11 flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground">
          <Users className="h-5 w-5" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.16em]">{t('debtors')}</span>
        </a>
      </div>
    </>
  );
}

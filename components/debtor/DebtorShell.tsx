'use client';

import { Lock } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  merchantName?: string;
}

export default function DebtorShell({ children, merchantName }: Props) {
  return (
    <div data-theme="cupcake" className="min-h-screen bg-[#faf9f7] font-[Inter,system-ui,sans-serif] text-[#2d2d2d]">
      {children}
      <footer className="border-t border-[#e8e4df] bg-[#f5f3f0] px-6 py-5">
        <div className="mx-auto flex max-w-lg flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2 text-[#999]">
            <Lock className="h-3 w-3" />
            <span className="text-[11px] font-medium">
              Secured by Stripe &middot; 256-bit encryption
            </span>
          </div>
          {merchantName && (
            <p className="text-[11px] text-[#b0a99f]">
              This communication is on behalf of {merchantName}.
              <br />
              Powered by Dragun.app
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

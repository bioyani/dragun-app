'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Logo from '@/components/Logo';

type Message = {
  role: 'agent' | 'user';
  text: string;
};

function buildReply(input: string) {
  const normalized = input.toLowerCase();

  if (normalized.includes('dispute') || normalized.includes('cancel')) {
    return 'I understand. In this demo account, clause 4.2 requires written notice 30 days in advance. We can open a dispute review while keeping a temporary payment plan active.';
  }

  if (normalized.includes('plan') || normalized.includes('installment') || normalized.includes('split')) {
    return 'Yes. For demo case DRG-2048, we can schedule two payments this week and auto-send receipts after each settlement.';
  }

  if (normalized.includes('pay') || normalized.includes('today')) {
    return 'Great. Demo secure link generated: pay.dragun.app/demo/DRG-2048. This is a sandbox link and no real charge is executed.';
  }

  return 'Understood. In demo mode, I can offer full payment, split settlement, or dispute review with contract citation. Which path do you prefer?';
}

export default function InteractiveRecoveryDemo() {
  const initialMessages = useMemo<Message[]>(
    () => [
      {
        role: 'agent',
        text: 'Hello. This is Dragun demo mode for case DRG-2048. Balance: 1,250 CAD. I can propose compliant options and cite contract terms.',
      },
    ],
    []
  );

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  const runAgentReply = (reply: string) => {
    setTyping(true);
    setMessages((prev) => [...prev, { role: 'agent', text: '' }]);

    let index = 0;
    const timer = setInterval(() => {
      index += 1;
      setMessages((prev) => {
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.role === 'agent') {
          last.text = reply.slice(0, index);
        }
        return copy;
      });

      if (index >= reply.length) {
        clearInterval(timer);
        setTyping(false);
      }
    }, 12);
  };

  const handleSend = (text: string) => {
    const clean = text.trim();
    if (!clean || typing) return;

    setMessages((prev) => [...prev, { role: 'user', text: clean }]);
    setInput('');
    runAgentReply(buildReply(clean));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSend(input);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-elev-1 lg:col-span-8">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto" />
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Recovery Agent Live Demo</p>
        </div>
        <span className="rounded-full border border-border px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          Sandbox
        </span>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-background p-3 text-xs text-muted-foreground">
        <div className="mb-1 flex items-center gap-2 text-foreground">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span className="font-semibold uppercase tracking-[0.14em]">Secure demo mode</span>
        </div>
        Synthetic debtor data. Local browser simulation only. No real records or payments.
      </div>

      <div className="max-h-80 space-y-3 overflow-y-auto rounded-xl border border-border bg-background p-4 text-sm">
        {messages.map((message, idx) => (
          <div
            key={`${message.role}-${idx}`}
            className={
              message.role === 'user'
                ? 'ml-auto max-w-[85%] rounded-xl bg-primary p-3 text-primary-foreground'
                : 'max-w-[85%] rounded-xl border border-border bg-card p-3 text-muted-foreground'
            }
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {['I can pay today', 'Can we split this amount?', 'I want to dispute this'].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleSend(preset)}
            disabled={typing}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            {preset}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={typing ? 'Agent is typing...' : 'Type a message to test the demo'}
          disabled={typing}
          className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

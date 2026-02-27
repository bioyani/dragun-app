'use client';

import { FormEvent, useMemo, useState } from 'react';
import { ShieldCheck, Activity, Lock } from 'lucide-react';
import Logo from '@/components/Logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

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
    <Card className="card-pep lg:col-span-8">
      <div className="flex items-center justify-between p-6 pb-4">
        <div className="flex items-center gap-3">
          <Logo className="h-7 w-auto" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Recovery Agent Live Demo</p>
            <p className="text-[11px] text-muted-foreground">Case DRG-2048 · Synthetic data</p>
          </div>
        </div>
        <Badge variant="secondary">Sandbox</Badge>
      </div>

      <div className="px-6 pb-6">
        <div className="rounded-lg border border-border bg-[hsl(var(--fg-0))] p-4 text-[11px] text-[hsl(var(--bg-2))] shadow-lg">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Badge className="border-white/20 bg-white/10 text-[hsl(var(--bg-0))]">Secure session</Badge>
            <Badge className="border-white/20 bg-white/10 text-[hsl(var(--bg-0))]">Policy cite enabled</Badge>
            <Badge className="border-white/20 bg-white/10 text-[hsl(var(--bg-0))]">Stripe sandbox</Badge>
          </div>

          <div className="mb-3 grid gap-2 rounded-md border border-white/15 bg-black/25 p-3 font-mono text-[11px] text-white/75 sm:grid-cols-3">
            <p>SESSION_ID: DRG-2048-DEV</p>
            <p>RISK_PROFILE: MEDIUM</p>
            <p>ESCALATION: LEGAL_REVIEW</p>
          </div>

          <div className="mb-3 flex items-center gap-2 font-mono text-[11px] text-white/80">
            <Activity className="h-3.5 w-3.5" />
            SYSTEM: Running compliant negotiation protocol v2.4
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto rounded-md border border-white/15 bg-black/25 p-4 text-sm">
            {messages.map((message, idx) => (
              <div
                key={`${message.role}-${idx}`}
                className={
                  message.role === 'user'
                    ? 'ml-auto max-w-[85%] rounded-md border border-cyan-300/40 bg-cyan-300/15 p-3 text-cyan-100'
                    : 'max-w-[85%] rounded-md border border-white/20 bg-white/10 p-3 text-white/85'
                }
              >
                {message.text}
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {['I can pay today', 'Can we split this amount?', 'I want to dispute this'].map((preset) => (
              <Button
                key={preset}
                onClick={() => handleSend(preset)}
                disabled={typing}
                variant="ghost"
                size="sm"
                className="rounded-full border-white/20 bg-white/5 text-[11px] text-white/80 hover:border-white/35 hover:bg-white/10 hover:text-white"
              >
                {preset}
              </Button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={typing ? 'Agent is typing...' : 'Type a message to test the demo'}
              disabled={typing}
              className="h-11 border-white/20 bg-black/25 text-white placeholder:text-white/50 focus-visible:ring-cyan-300"
            />
            <Button
              type="submit"
              disabled={typing || !input.trim()}
              size="default"
              className="h-11 whitespace-nowrap bg-cyan-300 text-slate-950 hover:bg-cyan-200"
            >
              Send
            </Button>
          </form>
        </div>

        <Separator className="my-4" />

        <div className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
          <p className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> Contract-aware replies</p>
          <p className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> Encrypted transit channel</p>
          <p className="inline-flex items-center gap-1.5"><Activity className="h-3.5 w-3.5" /> Full interaction audit trail</p>
        </div>
      </div>
    </Card>
  );
}

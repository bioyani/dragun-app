"use client";

import * as Sentry from "@sentry/nextjs";

export default function SentryExamplePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6 p-10">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black uppercase tracking-widest">Sentry Example</h1>
        <p className="text-white/60 text-sm">Trigger a test error or manual capture to verify monitoring.</p>
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest"
          onClick={() => {
            throw new Error("Sentry test error from /sentry-example-page");
          }}
        >
          Throw Error
        </button>
        <button
          className="px-6 py-3 rounded-xl border border-white/20 text-white/80 font-black text-xs uppercase tracking-widest"
          onClick={() => {
            Sentry.captureException(new Error("Sentry manual capture from /sentry-example-page"));
          }}
        >
          Capture Exception
        </button>
      </div>
    </main>
  );
}

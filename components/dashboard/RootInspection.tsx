'use client';

import { useState } from 'react';
import { getNetworkProcesses } from '@/app/actions/aura-sys';
import { Activity, RefreshCw, AlertCircle } from 'lucide-react';

export default function RootInspection() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProcesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getNetworkProcesses();
      if (result.error) {
        setError(result.error);
      } else {
        setData(result.network_processes);
      }
    } catch (_err) {
      setError('Unexpected client-side error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-200/50 border border-base-300/50 shadow-warm overflow-hidden mt-6">
      <div className="border-b border-base-300/50 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Activity className="h-4 w-4" />
          </div>
          <div>
            <h2 className="font-bold">Aura Root: Network Processes</h2>
            <p className="text-[11px] text-base-content/40 uppercase tracking-widest font-semibold">Live System Inspection</p>
          </div>
        </div>
        <button 
          onClick={fetchProcesses} 
          disabled={loading}
          className="btn btn-ghost btn-sm gap-2"
        >
          {loading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          Refresh
        </button>
      </div>

      <div className="p-4">
        {error ? (
          <div className="alert alert-error gap-2 text-sm py-3">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : data ? (
          <pre className="bg-black/40 p-4 rounded-xl text-[10px] font-mono overflow-auto max-h-[400px] leading-relaxed text-success/80 border border-success/10">
            {data}
          </pre>
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
            <Activity className="h-12 w-14 mb-4 stroke-[1]" />
            <p className="text-sm">Click refresh to inspect root network processes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

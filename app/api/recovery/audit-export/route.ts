import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMerchantId } from '@/lib/auth';
import * as Sentry from '@sentry/nextjs';

function toCsvRow(values: Array<string | number | null | undefined>): string {
  return values
    .map((value) => {
      const s = String(value ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    })
    .join(',');
}

export async function GET() {
  try {
    const merchantId = await getMerchantId();
    if (!merchantId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('recovery_actions')
      .select('id,debtor_id,action_type,status_after,note,created_at')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (error) {
      Sentry.captureException(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const header = ['id', 'debtor_id', 'action_type', 'status_after', 'note', 'created_at'];

    const rows = (data ?? []).map((a) => toCsvRow([a.id, a.debtor_id, a.action_type, a.status_after, a.note, a.created_at]));
    const csv = [toCsvRow(header), ...rows].join('\n');

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="dragun-recovery-audit-${new Date().toISOString().slice(0, 10)}.csv"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    Sentry.captureException(error);
    return NextResponse.json({ error: 'Audit export failed' }, { status: 500 });
  }
}

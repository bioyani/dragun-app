import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CRON_SECRET = process.env.CRON_SECRET;

function isAuthorized(req: Request): boolean {
  if (req.headers.get('x-vercel-cron') === '1') {
    return true;
  }

  const authHeader = req.headers.get('authorization');
  const bearer = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return Boolean(CRON_SECRET && bearer && bearer === CRON_SECRET);
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: merchants } = await supabaseAdmin
      .from('merchants')
      .select('id, data_retention_days')
      .gt('data_retention_days', 0);

    if (!merchants?.length) {
      return NextResponse.json({ processed: 0, message: 'No merchants with retention policy' });
    }

    const { data: totalDeleted, error } = await supabaseAdmin.rpc('delete_old_debtors');

    if (error) {
      console.error('[cron/data-retention] RPC error:', error);
      throw error;
    }

    return NextResponse.json({ processed: merchants.length, deleted: totalDeleted || 0 });
  } catch (error) {
    console.error('[cron/data-retention]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

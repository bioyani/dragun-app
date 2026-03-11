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
    const { data, error } = await supabaseAdmin.rpc('apply_data_retention');

    if (error) {
      console.error('[cron/data-retention] RPC error:', error);
      return NextResponse.json({ error: 'Database operation failed' }, { status: 500 });
    }

    if (!data || data.processed === 0) {
      return NextResponse.json({ processed: 0, message: 'No merchants with retention policy' });
    }

    return NextResponse.json({ processed: data.processed, deleted: data.deleted });
  } catch (error) {
    console.error('[cron/data-retention]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

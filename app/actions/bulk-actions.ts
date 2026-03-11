'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMerchantId } from '@/lib/auth';
import { sendInitialOutreach } from '@/app/actions/send-outreach';
import { revalidatePath } from 'next/cache';
import * as Sentry from '@sentry/nextjs';

export async function bulkSendOutreach(debtorIds: string[]): Promise<{ success: boolean; sent: number; errors: string[] }> {
  const merchantId = await getMerchantId();
  if (!merchantId) return { success: false, sent: 0, errors: ['Unauthorized'] };

  const errors: string[] = [];
  let sent = 0;

  // Concurrency limit of 5 to avoid rate-limiting from email/SMS providers
  const CONCURRENCY_LIMIT = 5;

  for (let i = 0; i < debtorIds.length; i += CONCURRENCY_LIMIT) {
    const chunk = debtorIds.slice(i, i + CONCURRENCY_LIMIT);

    const results = await Promise.allSettled(
      chunk.map(async (id) => {
        const fd = new FormData();
        fd.set('debtor_id', id);
        const res = await sendInitialOutreach(fd);
        if (!res.success) throw new Error(`${id}: ${res.error}`);
        return id;
      })
    );

    for (const result of results) {
      if (result.status === 'fulfilled') {
        sent++;
      } else {
        errors.push(result.reason.message || String(result.reason));
      }
    }
  }

  revalidatePath('/[locale]/dashboard', 'page');
  return { success: errors.length === 0, sent, errors };
}

export async function bulkMarkContacted(debtorIds: string[]): Promise<{ success: boolean; updated: number; errors: string[] }> {
  const merchantId = await getMerchantId();
  if (!merchantId) return { success: false, updated: 0, errors: ['Unauthorized'] };

  try {
    const { data: debtors } = await supabaseAdmin
      .from('debtors')
      .select('id')
      .eq('merchant_id', merchantId)
      .in('id', debtorIds)
      .neq('status', 'paid');

    if (!debtors?.length) return { success: true, updated: 0, errors: [] };

    const ids = debtors.map((d) => d.id);
    const now = new Date().toISOString();

    await supabaseAdmin
      .from('debtors')
      .update({ status: 'contacted', last_contacted: now })
      .in('id', ids)
      .eq('merchant_id', merchantId);

    for (const id of ids) {
      await supabaseAdmin.from('recovery_actions').insert({
        debtor_id: id,
        merchant_id: merchantId,
        action_type: 'status_update',
        status_after: 'contacted',
        note: 'Bulk marked as contacted',
      });
    }

    revalidatePath('/[locale]/dashboard', 'page');
    return { success: true, updated: ids.length, errors: [] };
  } catch (error) {
    Sentry.captureException(error);
    return { success: false, updated: 0, errors: [error instanceof Error ? error.message : 'Update failed'] };
  }
}

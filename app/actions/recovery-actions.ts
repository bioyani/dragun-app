'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMerchantId } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const COLLECTION_STATUSES = ['pending', 'contacted', 'promise_to_pay', 'paid', 'no_answer', 'escalated'] as const;
export type CollectionStatus = (typeof COLLECTION_STATUSES)[number];

function toCollectionStatus(input: FormDataEntryValue | null): CollectionStatus {
  const value = String(input ?? 'pending');
  if ((COLLECTION_STATUSES as readonly string[]).includes(value)) {
    return value as CollectionStatus;
  }
  return 'pending';
}

export async function updateRecoveryStatus(formData: FormData) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error('Unauthorized');

  const debtorId = String(formData.get('debtor_id') || '').trim();
  const status = toCollectionStatus(formData.get('status'));
  const note = String(formData.get('note') || '').trim();
  const actionType = String(formData.get('action_type') || 'status_update').trim();

  if (!debtorId) throw new Error('Missing debtor_id');

  const updatePayload: { status: CollectionStatus; last_contacted?: string } = { status };
  if (status === 'contacted' || status === 'promise_to_pay' || status === 'no_answer') {
    updatePayload.last_contacted = new Date().toISOString();
  }

  const { error: updateError } = await supabaseAdmin
    .from('debtors')
    .update(updatePayload)
    .eq('id', debtorId)
    .eq('merchant_id', merchantId);

  if (updateError) throw new Error(updateError.message);

  const { error: logError } = await supabaseAdmin.from('recovery_actions').insert({
    debtor_id: debtorId,
    merchant_id: merchantId,
    action_type: actionType,
    status_after: status,
    note: note || null,
  });

  if (logError) throw new Error(logError.message);

  revalidatePath('/[locale]/dashboard', 'page');
}

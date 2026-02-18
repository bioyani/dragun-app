'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMerchantId } from '@/lib/auth';

export async function updateMerchantSettings(settings: { strictness_level: number, settlement_floor: number }) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('merchants')
    .update(settings)
    .eq('id', merchantId);

  if (error) throw new Error(error.message);
  return { success: true };
}

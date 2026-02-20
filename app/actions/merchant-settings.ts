'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { getMerchantId } from '@/lib/auth';

export async function updateMerchantSettings(settings: { 
  name?: string, 
  strictness_level?: number, 
  settlement_floor?: number 
}) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('merchants')
    .update(settings)
    .eq('id', merchantId);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function completeOnboarding(data: {
  name: string,
  strictness_level: number,
  settlement_floor: number
}) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error('Unauthorized');

  const { error } = await supabaseAdmin
    .from('merchants')
    .update({
      ...data,
      onboarding_complete: true
    })
    .eq('id', merchantId);

  if (error) throw new Error(error.message);
  return { success: true };
}

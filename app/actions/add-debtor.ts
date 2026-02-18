'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';
import { revalidatePath } from 'next/cache';
import { getMerchantId } from '@/lib/auth';

export async function addDebtor(formData: FormData) {
  const merchantId = await getMerchantId();
  if (!merchantId) throw new Error('Unauthorized');

  const name = (formData.get('name') as string)?.trim();
  const email = (formData.get('email') as string)?.trim();
  const phone = (formData.get('phone') as string)?.trim() || null;
  const total_debt = parseFloat(formData.get('total_debt') as string);
  const currency = (formData.get('currency') as string) || 'USD';

  if (!name || !email || isNaN(total_debt) || total_debt <= 0) {
    throw new Error('Missing or invalid required fields');
  }

  const { error } = await supabaseAdmin.from('debtors').insert({
    merchant_id: merchantId,
    name,
    email,
    phone,
    total_debt,
    currency,
    status: 'pending',
  });

  if (error) throw new Error(error.message);

  revalidatePath('/[locale]/dashboard', 'page');
}

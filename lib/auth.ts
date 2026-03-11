import { createClient } from '@/lib/supabase/server';

export async function getMerchantId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return null;
  }

  return user.id;
}

export async function isOwner() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const ownerEmail = process.env.OWNER_EMAIL;
  if (!ownerEmail) return false;
  return user?.email === ownerEmail;
}

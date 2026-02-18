export async function getMerchantId() {
  // In a real app, this would check Supabase Auth
  // const supabase = createClient();
  // const { data: { user } } = await supabase.auth.getUser();
  // return user?.id;

  return '00000000-0000-0000-0000-000000000001';
}

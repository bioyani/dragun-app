-- Add RLS policies to allow merchants to insert their own profile and debtors
CREATE POLICY "Merchants can insert own profile" ON merchants
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Merchants can insert own debtors" ON debtors
  FOR INSERT WITH CHECK (merchant_id = auth.uid());

-- Update existing SELECT policy for merchants to allow reading by email
DROP POLICY IF EXISTS "Merchants can view own profile" ON merchants;
CREATE POLICY "Merchants can view own profile" ON merchants
  FOR SELECT USING (auth.uid() = id OR email = (auth.jwt() ->> 'email'));

-- Update existing UPDATE policy for merchants to allow updating by email
DROP POLICY IF EXISTS "Merchants can update own profile" ON merchants;
CREATE POLICY "Merchants can update own profile" ON merchants
  FOR UPDATE USING (auth.uid() = id OR email = (auth.jwt() ->> 'email'));

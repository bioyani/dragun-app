-- Drop if exists
DROP FUNCTION IF EXISTS delete_old_debtors();

-- Create RPC to delete old debtors based on merchant data_retention_days
CREATE OR REPLACE FUNCTION delete_old_debtors()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- We delete debtors where created_at is older than data_retention_days for their merchant.
  -- To prevent Foreign Key Constraint Violations in case ON DELETE CASCADE is missing
  -- in any environment, we explicitly delete related records first using chained CTEs.

  WITH target_debtors AS (
    SELECT d.id
    FROM debtors d
    JOIN merchants m ON d.merchant_id = m.id
    WHERE m.data_retention_days > 0
      AND d.created_at < (NOW() - (m.data_retention_days || ' days')::INTERVAL)
  ),
  del_conv AS (
    DELETE FROM conversations
    WHERE debtor_id IN (SELECT id FROM target_debtors)
  ),
  del_pay AS (
    DELETE FROM payments
    WHERE debtor_id IN (SELECT id FROM target_debtors)
  ),
  del_rec AS (
    DELETE FROM recovery_actions
    WHERE debtor_id IN (SELECT id FROM target_debtors)
  ),
  del_debtors AS (
    DELETE FROM debtors
    WHERE id IN (SELECT id FROM target_debtors)
    RETURNING id
  )
  SELECT count(*) INTO deleted_count FROM del_debtors;

  RETURN deleted_count;
END;
$$;

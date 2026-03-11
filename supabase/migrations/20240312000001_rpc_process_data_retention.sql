-- Function to process data retention policies for all merchants
-- Deletes debtors older than their merchant's data_retention_days
-- Relies on ON DELETE CASCADE for related records (conversations, payments, recovery_actions)

CREATE OR REPLACE FUNCTION process_data_retention()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_deleted_count INTEGER := 0;
BEGIN
  WITH deleted_debtors AS (
    DELETE FROM debtors d
    USING merchants m
    WHERE d.merchant_id = m.id
      AND m.data_retention_days > 0
      AND d.created_at < (NOW() - (m.data_retention_days || ' days')::INTERVAL)
    RETURNING d.id
  )
  SELECT count(*) INTO v_deleted_count FROM deleted_debtors;

  RETURN v_deleted_count;
END;
$$;

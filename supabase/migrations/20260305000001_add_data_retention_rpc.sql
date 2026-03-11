CREATE OR REPLACE FUNCTION apply_data_retention()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_merchant RECORD;
  v_cutoff_date TIMESTAMP WITH TIME ZONE;
  v_debtor_ids UUID[];
  v_deleted_count INT := 0;
  v_merchant_count INT := 0;
  v_total_deleted INT := 0;
BEGIN
  FOR v_merchant IN
    SELECT id, data_retention_days
    FROM merchants
    WHERE data_retention_days > 0
  LOOP
    v_cutoff_date := now() - (v_merchant.data_retention_days || ' days')::INTERVAL;

    -- Find all debtors to delete for this merchant
    SELECT array_agg(id) INTO v_debtor_ids
    FROM debtors
    WHERE merchant_id = v_merchant.id AND created_at < v_cutoff_date;

    IF array_length(v_debtor_ids, 1) > 0 THEN
      -- Delete related records first to mimic original application logic
      -- (even if ON DELETE CASCADE exists, this is safer and matches prior behavior)
      DELETE FROM conversations WHERE debtor_id = ANY(v_debtor_ids);
      DELETE FROM payments WHERE debtor_id = ANY(v_debtor_ids);
      DELETE FROM recovery_actions WHERE debtor_id = ANY(v_debtor_ids);

      -- Delete the debtors and count them
      WITH deleted AS (
        DELETE FROM debtors WHERE id = ANY(v_debtor_ids)
        RETURNING id
      )
      SELECT count(*) INTO v_deleted_count FROM deleted;

      v_total_deleted := v_total_deleted + v_deleted_count;
    END IF;

    v_merchant_count := v_merchant_count + 1;
  END LOOP;

  -- Return results in same format as before
  RETURN json_build_object(
    'processed', v_merchant_count,
    'deleted', v_total_deleted
  );
END;
$$;

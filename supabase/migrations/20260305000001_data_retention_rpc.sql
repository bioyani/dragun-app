-- Function to perform data retention cleanup in a single query
CREATE OR REPLACE FUNCTION execute_data_retention()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    deleted_count integer := 0;
BEGIN
    -- Create a temporary table to hold the IDs of debtors to be deleted
    CREATE TEMP TABLE tmp_expired_debtors (id UUID) ON COMMIT DROP;

    -- Find and store the IDs
    INSERT INTO tmp_expired_debtors (id)
    SELECT d.id
    FROM debtors d
    JOIN merchants m ON d.merchant_id = m.id
    WHERE m.data_retention_days > 0
      AND d.created_at < (NOW() - (m.data_retention_days * interval '1 day'));

    -- Check if there are any to delete
    SELECT COUNT(*) INTO deleted_count FROM tmp_expired_debtors;

    IF deleted_count > 0 THEN
        -- Explicitly delete related records to perfectly match existing JS logic
        -- even though ON DELETE CASCADE might be set.
        DELETE FROM conversations WHERE debtor_id IN (SELECT id FROM tmp_expired_debtors);
        DELETE FROM payments WHERE debtor_id IN (SELECT id FROM tmp_expired_debtors);
        DELETE FROM recovery_actions WHERE debtor_id IN (SELECT id FROM tmp_expired_debtors);

        -- Finally delete the debtors
        DELETE FROM debtors WHERE id IN (SELECT id FROM tmp_expired_debtors);
    END IF;

    RETURN deleted_count;
END;
$$;

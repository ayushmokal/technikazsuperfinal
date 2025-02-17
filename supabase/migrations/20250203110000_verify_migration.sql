/*
  # Migration Verification Queries
  
  This file contains queries to verify the successful migration of:
  1. Tables
  2. Functions
  3. Triggers
  4. Data counts
*/

-- Create verification functions
CREATE OR REPLACE FUNCTION verify_migration()
RETURNS TABLE (
    check_type text,
    item_name text,
    status text
) AS $$
DECLARE
    table_count integer;
    function_count integer;
    trigger_count integer;
BEGIN
    -- Check tables
    FOR item_name, status IN
        SELECT table_name::text, 
               CASE WHEN EXISTS (
                   SELECT 1 FROM information_schema.tables 
                   WHERE table_schema = 'public' 
                   AND table_name = tables.table_name
               ) THEN 'Present' ELSE 'Missing' END
        FROM (
            SELECT unnest(ARRAY[
                'blogs', 'mobile_products', 'laptops', 'expert_reviews',
                'product_ratings', 'product_reviews', 'affiliate_links',
                'amazon_ads', 'secrets', 'ratings', 'comments', 'admin_logs'
            ]) as table_name
        ) tables
    LOOP
        check_type := 'Table';
        RETURN NEXT;
    END LOOP;

    -- Check functions
    FOR item_name, status IN
        SELECT routine_name::text, 'Present'
        FROM information_schema.routines
        WHERE routine_schema = 'public'
    LOOP
        check_type := 'Function';
        RETURN NEXT;
    END LOOP;

    -- Check triggers
    FOR item_name, status IN
        SELECT trigger_name::text, 'Present'
        FROM information_schema.triggers
        WHERE trigger_schema = 'public'
    LOOP
        check_type := 'Trigger';
        RETURN NEXT;
    END LOOP;

    -- Check row counts
    FOR item_name, status IN
        SELECT table_name::text, count::text
        FROM (
            SELECT 'blogs' as table_name, COUNT(*)::text as count FROM blogs
            UNION ALL
            SELECT 'mobile_products', COUNT(*)::text FROM mobile_products
            UNION ALL
            SELECT 'laptops', COUNT(*)::text FROM laptops
            UNION ALL
            SELECT 'expert_reviews', COUNT(*)::text FROM expert_reviews
            UNION ALL
            SELECT 'product_ratings', COUNT(*)::text FROM product_ratings
            UNION ALL
            SELECT 'product_reviews', COUNT(*)::text FROM product_reviews
        ) counts
    LOOP
        check_type := 'Row Count';
        RETURN NEXT;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a view for easy verification
CREATE OR REPLACE VIEW migration_verification AS
SELECT * FROM verify_migration();

-- Example usage:
-- SELECT * FROM migration_verification;
-- SELECT * FROM migration_verification WHERE status = 'Missing';
-- SELECT * FROM migration_verification WHERE check_type = 'Row Count';

-- Grant permissions
GRANT EXECUTE ON FUNCTION verify_migration() TO authenticated;
GRANT SELECT ON migration_verification TO authenticated;
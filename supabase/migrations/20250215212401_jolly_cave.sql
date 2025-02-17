-- Drop existing function if it exists
DROP FUNCTION IF EXISTS check_product_exists(uuid);

-- Create the function with proper error handling
CREATE OR REPLACE FUNCTION check_product_exists(product_id uuid) 
RETURNS boolean AS $$
BEGIN
  IF product_id IS NULL THEN
    RETURN false;
  END IF;

  RETURN EXISTS (
    SELECT 1 
    FROM (
      SELECT id FROM mobile_products
      UNION ALL
      SELECT id FROM laptops
    ) products 
    WHERE id = product_id
  );
EXCEPTION
  WHEN others THEN
    -- Log error and return false
    RAISE NOTICE 'Error in check_product_exists: %', SQLERRM;
    RETURN false;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_product_exists(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION check_product_exists(uuid) TO anon;

-- Add COMMENT to document the function
COMMENT ON FUNCTION check_product_exists(uuid) IS 'Checks if a product exists in either mobile_products or laptops tables';

-- Create a function to calculate product rating that doesn't depend on check_product_exists
CREATE OR REPLACE FUNCTION calculate_product_rating(p_id uuid)
RETURNS TABLE (
  average_rating numeric,
  total_ratings bigint,
  rating_distribution integer[]
) AS $$
DECLARE
  dist integer[];
BEGIN
  -- Initialize rating distribution array with zeros
  dist := ARRAY[0, 0, 0, 0, 0];
  
  -- Calculate rating distribution
  FOR i IN 1..5 LOOP
    WITH rating_count AS (
      SELECT COUNT(*) as count
      FROM product_ratings
      WHERE product_id = p_id AND rating = i
    )
    SELECT count INTO dist[i] FROM rating_count;
  END LOOP;

  RETURN QUERY
  SELECT 
    COALESCE(AVG(rating)::numeric, 0) as average_rating,
    COUNT(*) as total_ratings,
    dist as rating_distribution
  FROM product_ratings
  WHERE product_id = p_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions for the rating calculation function
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO anon;
-- Drop all existing versions of the function
DROP FUNCTION IF EXISTS check_product_exists(uuid);
DROP FUNCTION IF EXISTS check_product_exists(text);
DROP FUNCTION IF EXISTS check_product_exists();

-- Create the function with proper error handling and IMMUTABLE property
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);

-- Grant execute permissions to all users
GRANT EXECUTE ON FUNCTION check_product_exists(uuid) TO PUBLIC;

-- Add documentation
COMMENT ON FUNCTION check_product_exists(uuid) IS 'Checks if a product exists in either mobile_products or laptops tables';

-- Create a function to calculate product rating
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
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Grant execute permissions for the rating calculation function
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO PUBLIC;

-- Update RLS policies to use the functions
DROP POLICY IF EXISTS "Anyone can submit product ratings" ON product_ratings;
CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (
  check_product_exists(product_id) AND
  rating >= 0 AND 
  rating <= 5
);

-- Create trigger to update product rating after insert
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  new_rating numeric;
BEGIN
  SELECT AVG(rating) INTO new_rating
  FROM product_ratings
  WHERE product_id = NEW.product_id;

  -- Update mobile products
  UPDATE mobile_products
  SET average_rating = new_rating
  WHERE id = NEW.product_id;

  -- Update laptops
  UPDATE laptops
  SET average_rating = new_rating
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_ratings;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();
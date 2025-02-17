/*
  # Fix product check constraint
  
  1. Changes
    - Drop and recreate check_product_exists function with proper error handling
    - Temporarily disable constraints while fixing data
    - Recreate constraints and policies
    - Add proper indexes for performance
*/

-- Drop existing function and recreate with better error handling
DROP FUNCTION IF EXISTS check_product_exists;

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
END;
$$ LANGUAGE plpgsql;

-- Temporarily disable constraints
ALTER TABLE product_ratings 
  DROP CONSTRAINT IF EXISTS check_product_ratings_product_exists;

ALTER TABLE product_reviews
  DROP CONSTRAINT IF EXISTS check_product_reviews_product_exists;

-- Clean up any invalid data
DELETE FROM product_ratings 
WHERE NOT check_product_exists(product_id);

DELETE FROM product_reviews
WHERE NOT check_product_exists(product_id);

-- Recreate constraints
ALTER TABLE product_ratings
  ADD CONSTRAINT check_product_ratings_product_exists
  CHECK (check_product_exists(product_id));

ALTER TABLE product_reviews
  ADD CONSTRAINT check_product_reviews_product_exists
  CHECK (check_product_exists(product_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can submit product ratings" ON product_ratings;
CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (check_product_exists(product_id));

DROP POLICY IF EXISTS "Anyone can submit product reviews" ON product_reviews;
CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (check_product_exists(product_id));

-- Grant permissions
GRANT EXECUTE ON FUNCTION check_product_exists TO PUBLIC;
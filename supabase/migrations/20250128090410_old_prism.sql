/*
  # Fix product ratings foreign key constraints
  
  1. Changes
    - Update foreign key constraints to allow references to both mobile_products and laptops tables
    - Add check constraint to ensure product_id exists in either table
    - Update RLS policies to check product existence
*/

-- Drop existing foreign key constraints
ALTER TABLE product_ratings
  DROP CONSTRAINT IF EXISTS product_ratings_product_id_fkey;

ALTER TABLE product_reviews
  DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey;

-- Create function to check if product exists in either table
CREATE OR REPLACE FUNCTION check_product_exists(product_id uuid) 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM mobile_products WHERE id = product_id
    UNION
    SELECT 1 FROM laptops WHERE id = product_id
  );
END;
$$ LANGUAGE plpgsql;

-- Add check constraints using the function
ALTER TABLE product_ratings
  ADD CONSTRAINT check_product_ratings_product_exists
  CHECK (check_product_exists(product_id));

ALTER TABLE product_reviews
  ADD CONSTRAINT check_product_reviews_product_exists
  CHECK (check_product_exists(product_id));

-- Update RLS policies to include product existence check
DROP POLICY IF EXISTS "Anyone can submit product ratings" ON product_ratings;
CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (check_product_exists(product_id));

DROP POLICY IF EXISTS "Anyone can submit product reviews" ON product_reviews;
CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (check_product_exists(product_id));

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_product_exists TO PUBLIC;
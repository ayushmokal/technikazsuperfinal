/*
  # Fix product rating and review sequences
  
  1. Changes
    - Create sequences for product ratings and reviews if they don't exist
    - Update table definitions to use UUID primary keys instead of sequence-based IDs
    - Update existing policies to work with UUID keys
*/

-- Drop existing sequences if they exist
DROP SEQUENCE IF EXISTS product_ratings_id_seq;
DROP SEQUENCE IF EXISTS product_reviews_id_seq;

-- Modify product_ratings table to use UUID
ALTER TABLE product_ratings 
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;

-- Modify product_reviews table to use UUID  
ALTER TABLE product_reviews
  ALTER COLUMN id SET DEFAULT gen_random_uuid(),
  ALTER COLUMN id SET DATA TYPE uuid USING id::uuid;

-- Recreate indexes with UUID type
DROP INDEX IF EXISTS idx_product_ratings_product_id_created_at;
CREATE INDEX idx_product_ratings_product_id_created_at 
ON product_ratings(product_id, created_at);

-- Update foreign key constraints if needed
ALTER TABLE product_ratings
  DROP CONSTRAINT IF EXISTS product_ratings_product_id_fkey,
  ADD CONSTRAINT product_ratings_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES mobile_products(id)
    ON DELETE CASCADE;

ALTER TABLE product_reviews
  DROP CONSTRAINT IF EXISTS product_reviews_product_id_fkey,
  ADD CONSTRAINT product_reviews_product_id_fkey 
    FOREIGN KEY (product_id) 
    REFERENCES mobile_products(id)
    ON DELETE CASCADE;

-- Ensure RLS is enabled
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Recreate policies
DROP POLICY IF EXISTS "Product ratings are viewable by everyone" ON product_ratings;
DROP POLICY IF EXISTS "Anyone can submit product ratings" ON product_ratings;
DROP POLICY IF EXISTS "Product reviews are viewable by everyone" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can submit product reviews" ON product_reviews;

CREATE POLICY "Product ratings are viewable by everyone"
ON product_ratings FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Product reviews are viewable by everyone"
ON product_reviews FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (true);
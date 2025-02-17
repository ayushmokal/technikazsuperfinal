/*
  # Fix product ratings RLS policies
  
  1. Security Changes
    - Drop existing policies
    - Add proper RLS policies for product ratings
    - Add user_email column to product_reviews
    - Update existing policies
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Product ratings are viewable by everyone" ON product_ratings;
DROP POLICY IF EXISTS "Anyone can submit product ratings" ON product_ratings;
DROP POLICY IF EXISTS "Product reviews are viewable by everyone" ON product_reviews;
DROP POLICY IF EXISTS "Anyone can submit product reviews" ON product_reviews;

-- Add user_email column to product_reviews if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'product_reviews' 
    AND column_name = 'user_email'
  ) THEN
    ALTER TABLE product_reviews ADD COLUMN user_email text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Create new policies for product_ratings
CREATE POLICY "Product ratings are viewable by everyone"
ON product_ratings FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (true);

-- Create new policies for product_reviews
CREATE POLICY "Product reviews are viewable by everyone"
ON product_reviews FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (true);

-- Create or replace rate limiting function
CREATE OR REPLACE FUNCTION check_rating_limit(product_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  recent_ratings integer;
BEGIN
  SELECT COUNT(*)
  INTO recent_ratings
  FROM product_ratings
  WHERE product_id = $1
    AND created_at > NOW() - INTERVAL '1 hour';
    
  RETURN recent_ratings < 10;
END;
$$;

-- Create index for rate limiting
CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id_created_at 
ON product_ratings(product_id, created_at);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_rating_limit TO PUBLIC;
GRANT ALL ON product_ratings TO authenticated;
GRANT ALL ON product_reviews TO authenticated;
GRANT USAGE ON SEQUENCE product_ratings_id_seq TO PUBLIC;
GRANT USAGE ON SEQUENCE product_reviews_id_seq TO PUBLIC;
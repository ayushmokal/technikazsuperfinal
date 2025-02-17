/*
  # Add RLS policies for product ratings and reviews

  1. Security
    - Enable RLS on product_ratings and product_reviews tables
    - Add policies for public read access
    - Add policies for public write access with rate limiting
*/

-- Enable RLS
ALTER TABLE product_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Product ratings are viewable by everyone"
ON product_ratings FOR SELECT
USING (true);

CREATE POLICY "Product reviews are viewable by everyone"
ON product_reviews FOR SELECT
USING (true);

-- Allow public write access
CREATE POLICY "Anyone can submit product ratings"
ON product_ratings FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (true);

-- Add rate limiting function
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

-- Apply rate limiting to insert policies
ALTER POLICY "Anyone can submit product ratings"
ON product_ratings
WITH CHECK (
  check_rating_limit(product_id)
);
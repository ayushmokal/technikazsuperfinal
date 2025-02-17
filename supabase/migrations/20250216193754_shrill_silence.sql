-- Add average_rating column to mobile_products and laptops
ALTER TABLE mobile_products 
ADD COLUMN IF NOT EXISTS average_rating numeric DEFAULT 0;

ALTER TABLE laptops 
ADD COLUMN IF NOT EXISTS average_rating numeric DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_products_average_rating 
ON mobile_products(average_rating);

CREATE INDEX IF NOT EXISTS idx_laptops_average_rating 
ON laptops(average_rating);

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS calculate_product_rating(uuid);

-- Create updated calculate_product_rating function
CREATE OR REPLACE FUNCTION calculate_product_rating(p_id uuid)
RETURNS TABLE (
  average_rating numeric,
  total_ratings integer,
  rating_distribution integer[]
) AS $$
DECLARE
  dist integer[];
  avg_rating numeric;
  total_count integer;
BEGIN
  -- Initialize rating distribution array with zeros
  dist := ARRAY[0, 0, 0, 0, 0];
  
  -- Calculate rating distribution
  FOR i IN 1..5 LOOP
    WITH rating_count AS (
      SELECT COUNT(*)::integer as count
      FROM product_ratings
      WHERE product_id = p_id AND rating = i::numeric
    )
    SELECT count INTO dist[i] FROM rating_count;
  END LOOP;

  -- Calculate average rating and total count
  SELECT 
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
    COUNT(*)::integer
  INTO avg_rating, total_count
  FROM product_ratings
  WHERE product_id = p_id;

  -- Update the average_rating in the appropriate product table
  UPDATE mobile_products
  SET average_rating = avg_rating
  WHERE id = p_id;

  UPDATE laptops
  SET average_rating = avg_rating
  WHERE id = p_id;

  RETURN QUERY
  SELECT 
    avg_rating as average_rating,
    total_count as total_ratings,
    dist as rating_distribution;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function to update product rating
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
  avg_rating numeric;
BEGIN
  -- Calculate new average rating
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
  INTO avg_rating
  FROM product_ratings
  WHERE product_id = NEW.product_id;

  -- Update mobile_products
  UPDATE mobile_products
  SET average_rating = avg_rating
  WHERE id = NEW.product_id;

  -- Update laptops
  UPDATE laptops
  SET average_rating = avg_rating
  WHERE id = NEW.product_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_ratings;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_product_rating();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO anon;
GRANT EXECUTE ON FUNCTION update_product_rating() TO authenticated;
GRANT EXECUTE ON FUNCTION update_product_rating() TO anon;
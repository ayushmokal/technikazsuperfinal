-- Drop existing function
DROP FUNCTION IF EXISTS calculate_product_rating(uuid);

-- Create updated calculate_product_rating function with array handling fix
CREATE OR REPLACE FUNCTION calculate_product_rating(p_id uuid)
RETURNS TABLE (
  average_rating numeric,
  total_ratings integer,
  rating_distribution numeric[]
) AS $$
DECLARE
  dist numeric[];
  avg_rating numeric;
  total_count integer;
  temp_count numeric;
BEGIN
  -- Initialize rating distribution array with zeros
  dist := ARRAY[0, 0, 0, 0, 0];
  
  -- Calculate rating counts for each star level using a safer approach
  FOR i IN 1..5 LOOP
    SELECT COALESCE(COUNT(*)::numeric, 0)
    INTO temp_count
    FROM product_ratings
    WHERE product_id = p_id AND rating = i::numeric;
    
    -- Safely assign the count to the array
    dist[i] := temp_count;
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
    avg_rating,
    total_count,
    dist;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO anon;

-- Add comment for documentation
COMMENT ON FUNCTION calculate_product_rating(uuid) IS 'Calculates product rating statistics including average rating, total ratings count, and rating distribution';

-- Ensure average_rating columns exist
ALTER TABLE mobile_products 
ADD COLUMN IF NOT EXISTS average_rating numeric DEFAULT 0;

ALTER TABLE laptops 
ADD COLUMN IF NOT EXISTS average_rating numeric DEFAULT 0;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id_rating 
ON product_ratings(product_id, rating);

CREATE INDEX IF NOT EXISTS idx_mobile_products_average_rating 
ON mobile_products(average_rating);

CREATE INDEX IF NOT EXISTS idx_laptops_average_rating 
ON laptops(average_rating);
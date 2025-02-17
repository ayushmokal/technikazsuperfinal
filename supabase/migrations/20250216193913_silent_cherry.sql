-- Drop existing function
DROP FUNCTION IF EXISTS calculate_product_rating(uuid);

-- Create updated calculate_product_rating function with proper type handling
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
  
  -- Calculate rating distribution with proper type casting
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
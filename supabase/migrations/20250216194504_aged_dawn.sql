-- Drop existing functions
DROP FUNCTION IF EXISTS calculate_product_rating(uuid);
DROP FUNCTION IF EXISTS update_product_rating();

-- Create rating calculation function (without updates)
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

  RETURN QUERY
  SELECT 
    avg_rating,
    total_count,
    dist;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create separate function for updating product ratings
CREATE OR REPLACE FUNCTION update_product_average_rating(p_id uuid)
RETURNS void AS $$
DECLARE
  avg_rating numeric;
BEGIN
  -- Calculate new average rating
  SELECT COALESCE(ROUND(AVG(rating)::numeric, 1), 0)
  INTO avg_rating
  FROM product_ratings
  WHERE product_id = p_id;

  -- Update mobile_products
  UPDATE mobile_products
  SET average_rating = avg_rating
  WHERE id = p_id;

  -- Update laptops
  UPDATE laptops
  SET average_rating = avg_rating
  WHERE id = p_id;
END;
$$ LANGUAGE plpgsql;

-- Create trigger function
CREATE OR REPLACE FUNCTION trigger_update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
  -- Call update function
  PERFORM update_product_average_rating(
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.product_id
      ELSE NEW.product_id
    END
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS update_product_rating_trigger ON product_ratings;
CREATE TRIGGER update_product_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON product_ratings
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_product_rating();

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

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_product_rating(uuid) TO anon;
GRANT EXECUTE ON FUNCTION update_product_average_rating(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION update_product_average_rating(uuid) TO anon;
GRANT EXECUTE ON FUNCTION trigger_update_product_rating() TO authenticated;
GRANT EXECUTE ON FUNCTION trigger_update_product_rating() TO anon;
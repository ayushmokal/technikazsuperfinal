-- Drop all existing check_product_exists functions
DO $$ 
BEGIN
  -- Drop all functions with this name regardless of argument types
  DROP FUNCTION IF EXISTS check_product_exists(uuid);
  DROP FUNCTION IF EXISTS check_product_exists(text);
  DROP FUNCTION IF EXISTS check_product_exists();
EXCEPTION
  WHEN undefined_function THEN NULL;
END $$;

-- Create a single, well-defined function
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
$$ LANGUAGE plpgsql STABLE;

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION check_product_exists(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION check_product_exists(uuid) TO anon;

-- Add COMMENT to document the function
COMMENT ON FUNCTION check_product_exists(uuid) IS 'Checks if a product exists in either mobile_products or laptops tables';
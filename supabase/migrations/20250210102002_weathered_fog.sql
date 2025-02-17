-- Create or replace the check_product_exists function
CREATE OR REPLACE FUNCTION check_product_exists(product_id uuid) 
RETURNS boolean AS $$
BEGIN
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

-- Grant execute permission to all users
GRANT EXECUTE ON FUNCTION check_product_exists TO authenticated;
GRANT EXECUTE ON FUNCTION check_product_exists TO anon;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);
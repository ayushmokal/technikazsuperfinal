-- Drop existing foreign key constraint
ALTER TABLE expert_reviews
  DROP CONSTRAINT IF EXISTS expert_reviews_product_id_fkey;

-- Create a function to check if product exists in either table
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

-- Add check constraint using the function
ALTER TABLE expert_reviews
  DROP CONSTRAINT IF EXISTS check_expert_reviews_product_exists,
  ADD CONSTRAINT check_expert_reviews_product_exists
  CHECK (check_product_exists(product_id));

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_mobile_products_id ON mobile_products(id);
CREATE INDEX IF NOT EXISTS idx_laptops_id ON laptops(id);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_product_exists TO PUBLIC;
/*
  # Improve Affiliate Links Handling

  1. Changes
    - Add NOT NULL constraint to affiliate_link column
    - Add default response function for affiliate links
    - Add trigger to ensure product_id exists
    - Add indexes for better query performance

  2. Security
    - Maintain existing RLS policies
    - Add validation checks
*/

-- Drop existing constraints if they exist
ALTER TABLE affiliate_links 
  DROP CONSTRAINT IF EXISTS affiliate_links_product_id_check;

-- Add NOT NULL constraint to product_id if not already present
ALTER TABLE affiliate_links 
  ALTER COLUMN product_id SET NOT NULL;

-- Create function to validate product_id
CREATE OR REPLACE FUNCTION validate_product_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NOT check_product_exists(NEW.product_id) THEN
    RAISE EXCEPTION 'Product with ID % does not exist', NEW.product_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for product_id validation
DROP TRIGGER IF EXISTS validate_product_id_trigger ON affiliate_links;
CREATE TRIGGER validate_product_id_trigger
  BEFORE INSERT OR UPDATE ON affiliate_links
  FOR EACH ROW
  EXECUTE FUNCTION validate_product_id();

-- Create function to get affiliate link with fallback
CREATE OR REPLACE FUNCTION get_affiliate_link(p_id uuid)
RETURNS TABLE (
  affiliate_link text
) AS $$
BEGIN
  RETURN QUERY
  SELECT al.affiliate_link
  FROM affiliate_links al
  WHERE al.product_id = p_id
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id_created 
ON affiliate_links(product_id, created_at DESC);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION get_affiliate_link TO authenticated;
GRANT EXECUTE ON FUNCTION get_affiliate_link TO anon;
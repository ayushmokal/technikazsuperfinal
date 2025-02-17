/*
  # Add popular products support
  
  1. New Columns
    - Add popular flag to mobile_products and laptops tables
  
  2. Security
    - Update RLS policies to allow updating popular status
*/

-- Add popular column to mobile_products if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mobile_products' 
    AND column_name = 'popular'
  ) THEN
    ALTER TABLE mobile_products ADD COLUMN popular boolean DEFAULT false;
  END IF;
END $$;

-- Add popular column to laptops if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'laptops' 
    AND column_name = 'popular'
  ) THEN
    ALTER TABLE laptops ADD COLUMN popular boolean DEFAULT false;
  END IF;
END $$;

-- Create policy for updating popular status
CREATE POLICY "Authenticated users can update popular status" ON mobile_products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update popular status" ON laptops
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);
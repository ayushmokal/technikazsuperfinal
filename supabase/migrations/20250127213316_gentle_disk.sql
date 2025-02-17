/*
  # Add Buy Link Column to Product Tables

  1. Changes
    - Add buy_link column to mobile_products table
    - Add buy_link column to laptops table
    - Add URL validation check constraint
  
  2. Notes
    - buy_link is optional (nullable)
    - Includes URL format validation
*/

-- Add buy_link column to mobile_products if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'mobile_products' 
    AND column_name = 'buy_link'
  ) THEN
    ALTER TABLE mobile_products ADD COLUMN buy_link text;
  END IF;
END $$;

-- Add buy_link column to laptops if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'laptops' 
    AND column_name = 'buy_link'
  ) THEN
    ALTER TABLE laptops ADD COLUMN buy_link text;
  END IF;
END $$;

-- Add URL format validation check constraints
ALTER TABLE mobile_products
  DROP CONSTRAINT IF EXISTS buy_link_url_format,
  ADD CONSTRAINT buy_link_url_format 
    CHECK (
      buy_link IS NULL OR 
      buy_link ~* '^https?:\/\/.+'
    );

ALTER TABLE laptops
  DROP CONSTRAINT IF EXISTS buy_link_url_format,
  ADD CONSTRAINT buy_link_url_format 
    CHECK (
      buy_link IS NULL OR 
      buy_link ~* '^https?:\/\/.+'
    );
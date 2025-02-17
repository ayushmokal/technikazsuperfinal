/*
  # Add subcategories array column to blogs table

  1. Changes
    - Add subcategories array column to blogs table
    - Migrate existing subcategory data to new array column
    - Create index for better performance
    - Drop old subcategory column
*/

-- Add new subcategories array column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blogs' 
    AND column_name = 'subcategories'
  ) THEN
    ALTER TABLE blogs ADD COLUMN subcategories text[] DEFAULT '{}';
  END IF;
END $$;

-- Migrate existing data from subcategory to subcategories array
UPDATE blogs 
SET subcategories = ARRAY[subcategory]
WHERE subcategory IS NOT NULL 
  AND (subcategories IS NULL OR array_length(subcategories, 1) IS NULL);

-- Create GIN index for array column for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_subcategories ON blogs USING GIN (subcategories);

-- Drop old subcategory column
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'blogs' 
    AND column_name = 'subcategory'
  ) THEN
    ALTER TABLE blogs DROP COLUMN subcategory;
  END IF;
END $$;
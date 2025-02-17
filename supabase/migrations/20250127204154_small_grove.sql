/*
  # Add Multi-Category Support

  1. Changes
    - Add categories and subcategories arrays to blogs table
    - Migrate existing data to new structure
    - Add indexes for array fields

  2. Security
    - Maintain existing RLS policies
*/

-- Add new array columns
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subcategories text[] DEFAULT '{}';

-- Migrate existing data
UPDATE blogs 
SET 
  categories = ARRAY[category],
  subcategories = CASE 
    WHEN subcategory IS NOT NULL THEN ARRAY[subcategory]
    ELSE '{}'::text[]
  END;

-- Create GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_blogs_categories ON blogs USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_blogs_subcategories ON blogs USING GIN (subcategories);

-- Add check constraints
ALTER TABLE blogs
ADD CONSTRAINT categories_not_empty CHECK (array_length(categories, 1) > 0);
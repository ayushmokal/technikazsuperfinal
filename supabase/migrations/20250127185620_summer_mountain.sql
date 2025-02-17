/*
  # Add detailed review column to expert reviews

  1. Changes
    - Adds detailed_review column to expert_reviews table for storing long-form reviews
    - Column is nullable since not all reviews will have detailed content
*/

-- Add detailed_review column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expert_reviews' 
    AND column_name = 'detailed_review'
  ) THEN
    ALTER TABLE expert_reviews ADD COLUMN detailed_review text;
  END IF;
END $$;
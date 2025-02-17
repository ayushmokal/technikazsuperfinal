/*
  # Fix Expert Reviews Table Schema

  1. Changes
    - Safely recreate expert_reviews table with proper schema
    - Ensure detailed_review column exists
    - Set up proper RLS policies

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow authenticated users to create reviews
*/

-- Safely drop and recreate the table
DO $$ 
BEGIN
  -- Create the table if it doesn't exist
  CREATE TABLE IF NOT EXISTS expert_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL REFERENCES mobile_products(id),
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 10),
    author text NOT NULL,
    summary text NOT NULL,
    detailed_review text,
    pros text[] NOT NULL DEFAULT '{}',
    cons text[] NOT NULL DEFAULT '{}',
    verdict text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
  );

  -- Add detailed_review column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expert_reviews' 
    AND column_name = 'detailed_review'
  ) THEN
    ALTER TABLE expert_reviews ADD COLUMN detailed_review text;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Expert reviews are viewable by everyone" ON expert_reviews;
DROP POLICY IF EXISTS "Authenticated users can create expert reviews" ON expert_reviews;

-- Create policies
CREATE POLICY "Expert reviews are viewable by everyone"
ON expert_reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create expert reviews"
ON expert_reviews FOR INSERT
TO authenticated
WITH CHECK (true);
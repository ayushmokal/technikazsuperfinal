/*
  # Fix Expert Reviews Table

  1. Changes
    - Remove author_id column and related policies
    - Update RLS policies for simpler access control
    - Ensure detailed_review column exists

  2. Security
    - Enable RLS
    - Allow public read access
    - Allow authenticated users to create reviews
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Expert reviews are viewable by everyone" ON expert_reviews;
DROP POLICY IF EXISTS "Authenticated users can create expert reviews" ON expert_reviews;
DROP POLICY IF EXISTS "Users can update their own expert reviews" ON expert_reviews;
DROP POLICY IF EXISTS "Users can delete their own expert reviews" ON expert_reviews;

-- Drop author_id column if it exists
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expert_reviews' 
    AND column_name = 'author_id'
  ) THEN
    ALTER TABLE expert_reviews DROP COLUMN author_id;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Expert reviews are viewable by everyone" ON expert_reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create expert reviews" ON expert_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Ensure detailed_review column exists
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
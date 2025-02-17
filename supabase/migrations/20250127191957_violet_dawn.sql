/*
  # Expert Reviews RLS Policies

  1. Security
    - Enable RLS on expert_reviews table
    - Add policies for:
      - Public read access
      - Authenticated users can create reviews
      - Authenticated users can update their own reviews
      - Authenticated users can delete their own reviews
*/

-- Enable RLS
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Expert reviews are viewable by everyone" ON expert_reviews
  FOR SELECT
  USING (true);

-- Allow authenticated users to create reviews
CREATE POLICY "Authenticated users can create expert reviews" ON expert_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update their own reviews
CREATE POLICY "Users can update their own expert reviews" ON expert_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = author_id)
  WITH CHECK (auth.uid() = author_id);

-- Allow authenticated users to delete their own reviews
CREATE POLICY "Users can delete their own expert reviews" ON expert_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = author_id);

-- Add author_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'expert_reviews' 
    AND column_name = 'author_id'
  ) THEN
    ALTER TABLE expert_reviews ADD COLUMN author_id uuid REFERENCES auth.users(id);
  END IF;
END $$;
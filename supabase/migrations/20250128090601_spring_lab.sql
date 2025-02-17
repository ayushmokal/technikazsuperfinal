/*
  # Update product reviews schema
  
  1. Changes
    - Add user_email column
    - Add indexes for performance
    - Update constraints and policies
*/

-- Add user_email column if it doesn't exist
ALTER TABLE product_reviews 
ADD COLUMN IF NOT EXISTS user_email text;

-- Create index for user lookups
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_email 
ON product_reviews(user_email);

-- Update RLS policies
DROP POLICY IF EXISTS "Anyone can submit product reviews" ON product_reviews;
CREATE POLICY "Anyone can submit product reviews"
ON product_reviews FOR INSERT
WITH CHECK (
  check_product_exists(product_id) AND
  (
    user_email IS NULL OR
    user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  )
);

-- Add email format check constraint
ALTER TABLE product_reviews
DROP CONSTRAINT IF EXISTS check_email_format;

ALTER TABLE product_reviews
ADD CONSTRAINT check_email_format
CHECK (
  user_email IS NULL OR
  user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);
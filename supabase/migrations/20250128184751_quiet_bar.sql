/*
  # Fix Ratings Table RLS Policies

  1. Security
    - Enable RLS on ratings table
    - Add policies for public read/write access
    - Add rate limiting
*/

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;
DROP POLICY IF EXISTS "Anyone can submit ratings" ON ratings;

-- Create new policies
CREATE POLICY "Ratings are viewable by everyone"
ON ratings FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit ratings"
ON ratings FOR INSERT
WITH CHECK (true);

-- Create rate limiting function
CREATE OR REPLACE FUNCTION check_blog_rating_limit(blog_id uuid)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  recent_ratings integer;
BEGIN
  SELECT COUNT(*)
  INTO recent_ratings
  FROM ratings
  WHERE blog_id = $1
    AND created_at > NOW() - INTERVAL '1 hour';
    
  RETURN recent_ratings < 10;
END;
$$;

-- Add rate limiting to insert policy
DROP POLICY IF EXISTS "Anyone can submit ratings with rate limit" ON ratings;
CREATE POLICY "Anyone can submit ratings with rate limit"
ON ratings FOR INSERT
WITH CHECK (
  check_blog_rating_limit(blog_id)
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION check_blog_rating_limit TO PUBLIC;
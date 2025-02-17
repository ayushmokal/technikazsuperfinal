-- Drop existing policies
DROP POLICY IF EXISTS "Ratings are viewable by everyone" ON ratings;
DROP POLICY IF EXISTS "Anyone can submit ratings" ON ratings;
DROP POLICY IF EXISTS "Anyone can submit ratings with rate limit" ON ratings;

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
CREATE POLICY "Ratings are viewable by everyone"
ON ratings FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit ratings"
ON ratings FOR INSERT
WITH CHECK (true);

-- Create or replace rate limiting function
CREATE OR REPLACE FUNCTION check_blog_rating_limit(blog_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Add rate limiting policy
CREATE POLICY "Rate limited ratings submission"
ON ratings FOR INSERT
WITH CHECK (
  check_blog_rating_limit(blog_id)
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ratings TO anon;
GRANT EXECUTE ON FUNCTION check_blog_rating_limit TO anon;

-- Create index for better rate limiting performance
CREATE INDEX IF NOT EXISTS idx_ratings_blog_id_created_at 
ON ratings(blog_id, created_at);
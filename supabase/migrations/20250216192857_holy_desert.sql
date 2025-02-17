-- Create new product_reviews table
CREATE TABLE IF NOT EXISTS product_reviews_new (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    user_name text NOT NULL,
    user_email text CHECK (
        user_email IS NULL OR
        user_email = '' OR
        user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title text,
    review_text text,
    helpful_votes integer DEFAULT 0,
    verified_purchase boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create function to calculate review statistics
CREATE OR REPLACE FUNCTION calculate_review_stats(p_id uuid)
RETURNS TABLE (
    average_rating numeric,
    total_reviews bigint,
    rating_distribution integer[],
    verified_reviews bigint,
    helpful_votes bigint
) AS $$
DECLARE
    dist integer[];
BEGIN
    -- Initialize rating distribution array
    dist := ARRAY[0, 0, 0, 0, 0];
    
    -- Calculate rating distribution
    FOR i IN 1..5 LOOP
        WITH rating_count AS (
            SELECT COUNT(*)::integer as count
            FROM product_reviews_new
            WHERE product_id = p_id AND rating = i
        )
        SELECT count INTO dist[i] FROM rating_count;
    END LOOP;

    RETURN QUERY
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0) as average_rating,
        COUNT(*) as total_reviews,
        dist as rating_distribution,
        COUNT(*) FILTER (WHERE verified_purchase) as verified_reviews,
        COALESCE(SUM(helpful_votes), 0)::bigint as helpful_votes
    FROM product_reviews_new
    WHERE product_id = p_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create function to mark review as helpful
CREATE OR REPLACE FUNCTION mark_review_helpful(review_id uuid)
RETURNS void AS $$
BEGIN
    UPDATE product_reviews_new
    SET helpful_votes = helpful_votes + 1
    WHERE id = review_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS
ALTER TABLE product_reviews_new ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Reviews are viewable by everyone"
ON product_reviews_new FOR SELECT
USING (true);

CREATE POLICY "Anyone can submit reviews"
ON product_reviews_new FOR INSERT
WITH CHECK (
    check_product_exists(product_id) AND
    rating >= 1 AND 
    rating <= 5
);

-- Create indexes
CREATE INDEX idx_product_reviews_new_product_id ON product_reviews_new(product_id);
CREATE INDEX idx_product_reviews_new_rating ON product_reviews_new(rating);
CREATE INDEX idx_product_reviews_new_created_at ON product_reviews_new(created_at);
CREATE INDEX idx_product_reviews_new_helpful_votes ON product_reviews_new(helpful_votes DESC);

-- Grant permissions
GRANT ALL ON TABLE product_reviews_new TO authenticated;
GRANT SELECT, INSERT ON TABLE product_reviews_new TO anon;
GRANT EXECUTE ON FUNCTION calculate_review_stats TO authenticated, anon;
GRANT EXECUTE ON FUNCTION mark_review_helpful TO authenticated, anon;
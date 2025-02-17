-- Add missing columns to blogs table
ALTER TABLE blogs
ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS subcategories text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS seo_title text,
ADD COLUMN IF NOT EXISTS seo_description text,
ADD COLUMN IF NOT EXISTS seo_keywords text,
ADD COLUMN IF NOT EXISTS reading_time integer DEFAULT 0;

-- Add missing columns to mobile_products table
ALTER TABLE mobile_products
ADD COLUMN IF NOT EXISTS main_camera_specs jsonb,
ADD COLUMN IF NOT EXISTS main_camera_features jsonb,
ADD COLUMN IF NOT EXISTS main_camera_video jsonb,
ADD COLUMN IF NOT EXISTS selfie_camera_specs jsonb,
ADD COLUMN IF NOT EXISTS selfie_camera_features jsonb,
ADD COLUMN IF NOT EXISTS selfie_camera_video jsonb,
ADD COLUMN IF NOT EXISTS battery_charging jsonb,
ADD COLUMN IF NOT EXISTS design_specs jsonb,
ADD COLUMN IF NOT EXISTS display_details jsonb,
ADD COLUMN IF NOT EXISTS performance_specs jsonb,
ADD COLUMN IF NOT EXISTS multimedia_specs jsonb,
ADD COLUMN IF NOT EXISTS network_specs jsonb,
ADD COLUMN IF NOT EXISTS sensor_specs jsonb,
ADD COLUMN IF NOT EXISTS general_specs jsonb;

-- Add missing columns to laptops table
ALTER TABLE laptops
ADD COLUMN IF NOT EXISTS design_specs jsonb,
ADD COLUMN IF NOT EXISTS display_details jsonb,
ADD COLUMN IF NOT EXISTS performance_specs jsonb,
ADD COLUMN IF NOT EXISTS multimedia_specs jsonb,
ADD COLUMN IF NOT EXISTS connectivity_specs jsonb;

-- Add missing columns to expert_reviews table
ALTER TABLE expert_reviews
ADD COLUMN IF NOT EXISTS review_date date,
ADD COLUMN IF NOT EXISTS review_score_breakdown jsonb,
ADD COLUMN IF NOT EXISTS review_categories text[],
ADD COLUMN IF NOT EXISTS review_highlights text[];

-- Add missing columns to product_reviews table
ALTER TABLE product_reviews
ADD COLUMN IF NOT EXISTS verified_purchase boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS helpful_votes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS review_images text[],
ADD COLUMN IF NOT EXISTS review_title text;

-- Add missing columns to admin_logs table
ALTER TABLE admin_logs
ADD COLUMN IF NOT EXISTS ip_address text,
ADD COLUMN IF NOT EXISTS user_agent text,
ADD COLUMN IF NOT EXISTS session_id uuid;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_blogs_categories ON blogs USING GIN (categories);
CREATE INDEX IF NOT EXISTS idx_blogs_subcategories ON blogs USING GIN (subcategories);
CREATE INDEX IF NOT EXISTS idx_expert_reviews_review_categories ON expert_reviews USING GIN (review_categories);
CREATE INDEX IF NOT EXISTS idx_product_reviews_verified_purchase ON product_reviews(verified_purchase);
CREATE INDEX IF NOT EXISTS idx_product_reviews_helpful_votes ON product_reviews(helpful_votes);

-- Add constraints
ALTER TABLE product_reviews
ADD CONSTRAINT helpful_votes_non_negative CHECK (helpful_votes >= 0);

ALTER TABLE blogs
ADD CONSTRAINT reading_time_non_negative CHECK (reading_time >= 0);

-- Update RLS policies for new columns
DO $$ 
BEGIN
  -- Product reviews policies
  DROP POLICY IF EXISTS "Anyone can update helpful votes" ON product_reviews;
  CREATE POLICY "Anyone can update helpful votes"
    ON product_reviews
    FOR UPDATE
    USING (true)
    WITH CHECK (true);
END $$;

-- Grant permissions for new columns
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
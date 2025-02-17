/*
  # Fix Expert Reviews Table Schema

  1. Changes
    - Ensure detailed_review column exists with proper type
    - Drop and recreate the table if needed to ensure proper schema
    - Preserve existing data during migration

  2. Security
    - Maintain existing RLS policies
*/

-- Create a backup of existing data
CREATE TEMP TABLE IF NOT EXISTS expert_reviews_backup AS
SELECT * FROM expert_reviews;

-- Drop existing table
DROP TABLE IF EXISTS expert_reviews;

-- Recreate table with proper schema
CREATE TABLE expert_reviews (
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

-- Restore data from backup
INSERT INTO expert_reviews (
    id,
    product_id,
    rating,
    author,
    summary,
    detailed_review,
    pros,
    cons,
    verdict,
    created_at,
    updated_at
)
SELECT
    id,
    product_id,
    rating,
    author,
    summary,
    detailed_review,
    pros,
    cons,
    verdict,
    created_at,
    updated_at
FROM expert_reviews_backup;

-- Drop backup table
DROP TABLE IF EXISTS expert_reviews_backup;

-- Enable RLS
ALTER TABLE expert_reviews ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Expert reviews are viewable by everyone"
ON expert_reviews FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create expert reviews"
ON expert_reviews FOR INSERT
TO authenticated
WITH CHECK (true);
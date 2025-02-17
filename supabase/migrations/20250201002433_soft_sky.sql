/*
  # Amazon Ads Table Setup
  
  1. New Tables
    - amazon_ads
      - id (uuid, primary key)
      - asin (text)
      - placement (text)
      - title (text)
      - image_url (text)
      - price (text)
      - created_at (timestamptz)
      - updated_at (timestamptz)
  
  2. Security
    - Enable RLS
    - Public read access
    - Authenticated write access
*/

-- Create amazon_ads table
CREATE TABLE IF NOT EXISTS amazon_ads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asin text NOT NULL,
    placement text NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    price text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE amazon_ads ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Amazon ads are viewable by everyone"
ON amazon_ads FOR SELECT
USING (true);

CREATE POLICY "Only authenticated users can manage amazon ads"
ON amazon_ads FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_amazon_ads_placement ON amazon_ads(placement);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_amazon_ads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_amazon_ads_updated_at
    BEFORE UPDATE ON amazon_ads
    FOR EACH ROW
    EXECUTE FUNCTION update_amazon_ads_updated_at();
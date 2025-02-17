/*
  # Clean Affiliate Links Setup

  1. New Tables
    - `affiliate_links`
      - `id` (uuid, primary key)
      - `product_id` (uuid, references both mobile_products and laptops)
      - `affiliate_link` (text, URL format)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS
    - Add policies for public read and authenticated write access
    - Add URL format validation
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS affiliate_links CASCADE;

-- Create affiliate_links table
CREATE TABLE affiliate_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    affiliate_link text NOT NULL CHECK (affiliate_link ~* '^https?://'),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT check_product_exists CHECK (check_product_exists(product_id))
);

-- Enable RLS
ALTER TABLE affiliate_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Affiliate links are viewable by everyone"
ON affiliate_links FOR SELECT
USING (true);

CREATE POLICY "Only authenticated users can manage affiliate links"
ON affiliate_links FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create indexes
CREATE INDEX idx_affiliate_links_product_id ON affiliate_links(product_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_affiliate_links_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_affiliate_links_updated_at
    BEFORE UPDATE ON affiliate_links
    FOR EACH ROW
    EXECUTE FUNCTION update_affiliate_links_updated_at();

-- Grant necessary permissions
GRANT ALL ON TABLE affiliate_links TO authenticated;
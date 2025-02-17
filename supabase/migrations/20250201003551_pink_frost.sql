-- Create affiliate_links table
CREATE TABLE IF NOT EXISTS affiliate_links (
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
GRANT USAGE, SELECT ON SEQUENCE affiliate_links_id_seq TO authenticated;
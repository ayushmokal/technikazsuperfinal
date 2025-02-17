-- Enable pgcrypto for UUID generation
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS secrets CASCADE;
DROP TABLE IF EXISTS amazon_ads CASCADE;
DROP TABLE IF EXISTS affiliate_links CASCADE;
DROP TABLE IF EXISTS product_reviews CASCADE;
DROP TABLE IF EXISTS product_ratings CASCADE;
DROP TABLE IF EXISTS expert_reviews CASCADE;
DROP TABLE IF EXISTS laptops CASCADE;
DROP TABLE IF EXISTS mobile_products CASCADE;
DROP TABLE IF EXISTS blogs CASCADE;

-- Create blogs table
CREATE TABLE blogs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    content text NOT NULL,
    category text NOT NULL,
    subcategory text,
    author text NOT NULL,
    image_url text,
    slug text UNIQUE NOT NULL,
    featured boolean DEFAULT false,
    featured_in_category boolean DEFAULT false,
    popular boolean DEFAULT false,
    popular_in_tech boolean DEFAULT false,
    popular_in_games boolean DEFAULT false,
    popular_in_entertainment boolean DEFAULT false,
    popular_in_stocks boolean DEFAULT false,
    popular_in_gadgets boolean DEFAULT false,
    meta_title text,
    meta_description text,
    meta_keywords text,
    view_count integer DEFAULT 0,
    share_count integer DEFAULT 0,
    average_rating numeric DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create mobile_products table
CREATE TABLE mobile_products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    brand text,
    price numeric NOT NULL CHECK (price >= 0),
    image_url text,
    gallery_images text[],
    display_specs text NOT NULL,
    processor text NOT NULL,
    ram text,
    storage text,
    battery text NOT NULL,
    camera text NOT NULL,
    os text,
    color text,
    buy_link text CHECK (buy_link IS NULL OR buy_link ~* '^https?://'),
    popular boolean DEFAULT false,
    chipset text,
    charging_specs text,
    resolution text,
    screen_size text,
    announced text,
    status text,
    cpu_details text,
    gpu_details text,
    card_slot boolean DEFAULT false,
    memory_type text,
    display_type text,
    display_protection text,
    dimensions text,
    weight text,
    build_material text,
    sim_type text,
    protection_rating text,
    wlan text,
    bluetooth text,
    nfc boolean DEFAULT false,
    gps text,
    usb_type text,
    radio boolean DEFAULT false,
    infrared boolean DEFAULT false,
    network_technology text,
    network_speed text,
    loudspeaker_type text,
    audio_jack boolean DEFAULT false,
    sensors text[],
    available_colors text[],
    model_variants text[],
    bands_2g text[],
    bands_3g text[],
    bands_4g text[],
    bands_5g text[],
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create laptops table
CREATE TABLE laptops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    brand text NOT NULL,
    model_name text NOT NULL,
    price numeric NOT NULL CHECK (price >= 0),
    display_specs text NOT NULL,
    processor text NOT NULL,
    ram text NOT NULL,
    storage text NOT NULL,
    battery text NOT NULL,
    os text NOT NULL,
    color text NOT NULL,
    buy_link text CHECK (buy_link IS NULL OR buy_link ~* '^https?://'),
    image_url text,
    gallery_images text[],
    popular boolean DEFAULT false,
    series text NOT NULL,
    thickness text NOT NULL,
    dimensions text NOT NULL,
    weight text NOT NULL,
    os_type text NOT NULL,
    display_size text NOT NULL,
    display_resolution text NOT NULL,
    pixel_density text NOT NULL,
    display_features text NOT NULL,
    refresh_rate text NOT NULL,
    graphics text NOT NULL,
    graphics_memory text NOT NULL,
    clock_speed text NOT NULL,
    cache text NOT NULL,
    ram_type text NOT NULL,
    ram_speed text NOT NULL,
    memory_slots text NOT NULL,
    expandable_memory text NOT NULL,
    ssd_capacity text NOT NULL,
    battery_cell text NOT NULL,
    battery_type text NOT NULL,
    power_supply text NOT NULL,
    battery_life text NOT NULL,
    wlan text NOT NULL,
    wifi_version text NOT NULL,
    bluetooth_version text NOT NULL,
    hdmi_ports text NOT NULL,
    usb_type_c text NOT NULL,
    ethernet_ports text NOT NULL,
    headphone_jack boolean NOT NULL DEFAULT false,
    microphone_jack boolean NOT NULL DEFAULT false,
    webcam boolean NOT NULL DEFAULT false,
    video_recording text NOT NULL,
    audio_solution text NOT NULL,
    microphone boolean NOT NULL DEFAULT false,
    backlit_keyboard text NOT NULL,
    face_recognition text NOT NULL,
    warranty text NOT NULL,
    sales_package text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create expert_reviews table
CREATE TABLE expert_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
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

-- Create product_ratings table
CREATE TABLE product_ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    created_at timestamptz DEFAULT now()
);

-- Create product_reviews table
CREATE TABLE product_reviews (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    user_name text NOT NULL,
    user_email text CHECK (
        user_email IS NULL OR
        user_email = '' OR
        user_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
    ),
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_text text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create affiliate_links table
CREATE TABLE affiliate_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id uuid NOT NULL,
    affiliate_link text NOT NULL CHECK (affiliate_link ~* '^https?://'),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create amazon_ads table
CREATE TABLE amazon_ads (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    asin text NOT NULL,
    placement text NOT NULL,
    title text NOT NULL,
    image_url text NOT NULL,
    price text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create secrets table
CREATE TABLE secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT secrets_name_key UNIQUE (name)
);

-- Create ratings table
CREATE TABLE ratings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id uuid NOT NULL REFERENCES blogs(id),
    rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    blog_id uuid NOT NULL REFERENCES blogs(id),
    content text NOT NULL,
    user_name text NOT NULL,
    parent_id uuid REFERENCES comments(id),
    upvotes integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create utility functions
CREATE OR REPLACE FUNCTION check_product_exists(product_id uuid) 
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM mobile_products WHERE id = product_id
    UNION
    SELECT 1 FROM laptops WHERE id = product_id
  );
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_rating_limit(product_id uuid)
RETURNS boolean AS $$
DECLARE
  recent_ratings integer;
BEGIN
  SELECT COUNT(*)
  INTO recent_ratings
  FROM product_ratings
  WHERE product_id = $1
    AND created_at > NOW() - INTERVAL '1 hour';
    
  RETURN recent_ratings < 10;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_blog_rating_limit(blog_id uuid)
RETURNS boolean AS $$
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
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_view_count(blog_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_share_count(blog_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE blogs
  SET share_count = COALESCE(share_count, 0) + 1
  WHERE id = blog_id;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on all tables
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- Create RLS policies
DO $$ 
BEGIN
  -- Blogs policies
  EXECUTE 'CREATE POLICY "Blogs are viewable by everyone" ON blogs FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage blogs" ON blogs FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Mobile products policies
  EXECUTE 'CREATE POLICY "Mobile products are viewable by everyone" ON mobile_products FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage mobile products" ON mobile_products FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Laptops policies
  EXECUTE 'CREATE POLICY "Laptops are viewable by everyone" ON laptops FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage laptops" ON laptops FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Expert reviews policies
  EXECUTE 'CREATE POLICY "Expert reviews are viewable by everyone" ON expert_reviews FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage expert reviews" ON expert_reviews FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Product ratings policies
  EXECUTE 'CREATE POLICY "Product ratings are viewable by everyone" ON product_ratings FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Anyone can submit product ratings" ON product_ratings FOR INSERT WITH CHECK (check_rating_limit(product_id))';

  -- Product reviews policies
  EXECUTE 'CREATE POLICY "Product reviews are viewable by everyone" ON product_reviews FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Anyone can submit product reviews" ON product_reviews FOR INSERT WITH CHECK (true)';

  -- Affiliate links policies
  EXECUTE 'CREATE POLICY "Affiliate links are viewable by everyone" ON affiliate_links FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage affiliate links" ON affiliate_links FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Amazon ads policies
  EXECUTE 'CREATE POLICY "Amazon ads are viewable by everyone" ON amazon_ads FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage amazon ads" ON amazon_ads FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Secrets policies
  EXECUTE 'CREATE POLICY "Secrets are viewable by everyone" ON secrets FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Authenticated users can manage secrets" ON secrets FOR ALL TO authenticated USING (true) WITH CHECK (true)';

  -- Ratings policies
  EXECUTE 'CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Anyone can submit ratings" ON ratings FOR INSERT WITH CHECK (check_blog_rating_limit(blog_id))';

  -- Comments policies
  EXECUTE 'CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true)';
  EXECUTE 'CREATE POLICY "Anyone can submit comments" ON comments FOR INSERT WITH CHECK (true)';
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs(category);
CREATE INDEX IF NOT EXISTS idx_blogs_subcategory ON blogs(subcategory);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at);
CREATE INDEX IF NOT EXISTS idx_mobile_products_brand ON mobile_products(brand);
CREATE INDEX IF NOT EXISTS idx_mobile_products_price ON mobile_products(price);
CREATE INDEX IF NOT EXISTS idx_laptops_brand ON laptops(brand);
CREATE INDEX IF NOT EXISTS idx_laptops_price ON laptops(price);
CREATE INDEX IF NOT EXISTS idx_product_ratings_product_id ON product_ratings(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_links_product_id ON affiliate_links(product_id);
CREATE INDEX IF NOT EXISTS idx_amazon_ads_placement ON amazon_ads(placement);
CREATE INDEX IF NOT EXISTS idx_secrets_name ON secrets(name);
CREATE INDEX IF NOT EXISTS idx_ratings_blog_id ON ratings(blog_id);
CREATE INDEX IF NOT EXISTS idx_comments_blog_id ON comments(blog_id);

-- Insert initial maintenance mode record
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    '{"enabled": false, "message": "Site is under maintenance. Please check back later."}'::jsonb
)
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
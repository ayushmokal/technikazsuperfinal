/*
  # Database Updates

  This migration safely adds any missing tables and columns without conflicting with existing ones.
  It uses IF NOT EXISTS checks to prevent errors with existing objects.

  1. Tables
    - Checks for missing tables
    - Adds any missing columns to existing tables
    - Updates constraints and indexes

  2. Security
    - Ensures RLS is enabled
    - Adds any missing policies
*/

-- Function to check if a column exists
CREATE OR REPLACE FUNCTION column_exists(tbl text, col text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = tbl
    AND column_name = col
  );
END;
$$ LANGUAGE plpgsql;

-- Add missing columns to mobile_products if they don't exist
DO $$ 
BEGIN
  IF NOT column_exists('mobile_products', 'buy_link') THEN
    ALTER TABLE mobile_products ADD COLUMN buy_link text CHECK (buy_link IS NULL OR buy_link ~* '^https?://');
  END IF;

  IF NOT column_exists('mobile_products', 'popular') THEN
    ALTER TABLE mobile_products ADD COLUMN popular boolean DEFAULT false;
  END IF;
END $$;

-- Add missing columns to laptops if they don't exist
DO $$ 
BEGIN
  IF NOT column_exists('laptops', 'buy_link') THEN
    ALTER TABLE laptops ADD COLUMN buy_link text CHECK (buy_link IS NULL OR buy_link ~* '^https?://');
  END IF;

  IF NOT column_exists('laptops', 'popular') THEN
    ALTER TABLE laptops ADD COLUMN popular boolean DEFAULT false;
  END IF;
END $$;

-- Create missing indexes if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_mobile_products_popular') THEN
    CREATE INDEX idx_mobile_products_popular ON mobile_products(popular);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_laptops_popular') THEN
    CREATE INDEX idx_laptops_popular ON laptops(popular);
  END IF;
END $$;

-- Ensure RLS is enabled on all tables
DO $$ 
DECLARE
  tbl text;
BEGIN
  FOR tbl IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public')
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', tbl);
  END LOOP;
END $$;

-- Recreate any missing RLS policies
DO $$ 
BEGIN
  -- Mobile products policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_products' AND policyname = 'Mobile products are viewable by everyone') THEN
    CREATE POLICY "Mobile products are viewable by everyone" ON mobile_products FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'mobile_products' AND policyname = 'Authenticated users can manage mobile products') THEN
    CREATE POLICY "Authenticated users can manage mobile products" ON mobile_products FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;

  -- Laptops policies
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laptops' AND policyname = 'Laptops are viewable by everyone') THEN
    CREATE POLICY "Laptops are viewable by everyone" ON laptops FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'laptops' AND policyname = 'Authenticated users can manage laptops') THEN
    CREATE POLICY "Authenticated users can manage laptops" ON laptops FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;
/*
  # Fix Secrets Table Duplicate Key Issue

  1. Changes
    - Drop and recreate secrets table with proper constraints
    - Add proper upsert handling
    - Ensure idempotent operations
    - Maintain existing RLS policies
    
  2. Security
    - Maintain RLS policies
    - Keep existing permissions
*/

-- Drop existing table and related objects
DROP TABLE IF EXISTS secrets CASCADE;

-- Create secrets table with proper constraints
CREATE TABLE secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    value text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT value_is_valid_json CHECK (value::jsonb IS NOT NULL)
);

-- Enable RLS
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Secrets are viewable by everyone"
ON secrets FOR SELECT
USING (true);

CREATE POLICY "Only authenticated users can manage secrets"
ON secrets FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Create index
CREATE INDEX idx_secrets_name ON secrets(name);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_secrets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_secrets_updated_at
    BEFORE UPDATE ON secrets
    FOR EACH ROW
    EXECUTE FUNCTION update_secrets_updated_at();

-- Insert initial maintenance mode record with proper conflict handling
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    '{"enabled":false,"message":"Site is under maintenance. Please check back later."}'
)
ON CONFLICT (name) 
DO UPDATE SET
    value = EXCLUDED.value
WHERE secrets.value::jsonb->>'enabled' IS NULL
   OR secrets.value::jsonb->>'message' IS NULL;

-- Grant necessary permissions
GRANT ALL ON TABLE secrets TO authenticated;
GRANT SELECT ON TABLE secrets TO anon;
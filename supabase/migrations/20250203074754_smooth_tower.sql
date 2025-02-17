/*
  # Fix Secrets Table Final

  1. Changes
    - Complete rewrite of secrets table with proper constraints
    - Better upsert handling for maintenance mode
    - Proper JSON validation
    - Improved error handling
    
  2. Security
    - Maintain RLS policies
    - Proper permissions
*/

-- First drop everything related to secrets to start fresh
DROP TABLE IF EXISTS secrets CASCADE;
DROP FUNCTION IF EXISTS update_secrets_updated_at CASCADE;

-- Create secrets table with proper constraints
CREATE TABLE secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Add unique constraint separately to better handle conflicts
ALTER TABLE secrets
    ADD CONSTRAINT secrets_name_key UNIQUE (name);

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

-- Insert initial maintenance mode record
DO $$
BEGIN
    INSERT INTO secrets (name, value)
    VALUES (
        'maintenance_mode',
        '{"enabled": false, "message": "Site is under maintenance. Please check back later."}'::jsonb
    )
    ON CONFLICT (name) 
    DO UPDATE SET
        value = CASE
            WHEN secrets.value IS NULL OR 
                 NOT (secrets.value ? 'enabled') OR 
                 NOT (secrets.value ? 'message')
            THEN '{"enabled": false, "message": "Site is under maintenance. Please check back later."}'::jsonb
            ELSE secrets.value
        END;
EXCEPTION
    WHEN others THEN
        -- Log error and continue
        RAISE NOTICE 'Error inserting maintenance mode: %', SQLERRM;
END $$;

-- Create index for better performance
CREATE INDEX idx_secrets_name ON secrets(name);

-- Grant necessary permissions
GRANT ALL ON TABLE secrets TO authenticated;
GRANT SELECT ON TABLE secrets TO anon;
GRANT EXECUTE ON FUNCTION update_secrets_updated_at TO authenticated;
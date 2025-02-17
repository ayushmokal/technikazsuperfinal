/*
  # Create Secrets Table for Site Configuration

  1. New Tables
    - `secrets`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `value` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users only
    - Add index on name column

  3. Initial Data
    - Add maintenance_mode record
*/

-- Create secrets table
CREATE TABLE IF NOT EXISTS secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    value text NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
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

-- Insert initial maintenance mode record
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    '{"enabled":false,"message":"Site is under maintenance. Please check back later."}'
)
ON CONFLICT (name) DO NOTHING;

-- Grant necessary permissions
GRANT ALL ON TABLE secrets TO authenticated;
GRANT SELECT ON TABLE secrets TO anon;
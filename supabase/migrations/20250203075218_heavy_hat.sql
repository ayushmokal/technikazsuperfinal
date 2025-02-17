-- Drop existing table and related objects
DROP TABLE IF EXISTS secrets CASCADE;
DROP FUNCTION IF EXISTS update_secrets_updated_at CASCADE;

-- Create secrets table with JSONB value
CREATE TABLE secrets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    value jsonb NOT NULL,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT secrets_name_key UNIQUE (name)
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

-- Insert initial maintenance mode record with proper validation
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    jsonb_build_object(
        'enabled', false,
        'message', 'Site is under maintenance. Please check back later.'
    )
)
ON CONFLICT (name) DO NOTHING;

-- Create index for better performance
CREATE INDEX idx_secrets_name ON secrets(name);

-- Grant necessary permissions
GRANT ALL ON TABLE secrets TO authenticated;
GRANT SELECT ON TABLE secrets TO anon;
GRANT EXECUTE ON FUNCTION update_secrets_updated_at TO authenticated;
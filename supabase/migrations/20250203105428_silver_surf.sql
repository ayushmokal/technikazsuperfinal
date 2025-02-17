-- Create admin_logs table
CREATE TABLE IF NOT EXISTS admin_logs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email text NOT NULL,
    action_type text NOT NULL,
    entity_type text NOT NULL,
    entity_id uuid NOT NULL,
    entity_name text NOT NULL,
    details text NOT NULL,
    ip_address text,
    user_agent text,
    session_id uuid,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admin logs are viewable by authenticated users"
ON admin_logs FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Only authenticated users can insert admin logs"
ON admin_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_logs_user_email ON admin_logs(user_email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action_type ON admin_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity_type ON admin_logs(entity_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- Grant permissions
GRANT ALL ON TABLE admin_logs TO authenticated;
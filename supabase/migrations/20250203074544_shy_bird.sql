/*
  # Fix JSON Validation for Secrets Table

  1. Changes
    - Remove custom is_json function
    - Use PostgreSQL's native JSON validation
    - Update constraints to use native JSON validation
    - Ensure idempotency

  2. Security
    - Maintain existing RLS policies
    - Keep permissions intact
*/

-- Drop the custom is_json function if it exists
DROP FUNCTION IF EXISTS is_json(text);

-- Update the value constraint to use PostgreSQL's native JSON validation
ALTER TABLE secrets
  DROP CONSTRAINT IF EXISTS value_is_valid_json;

ALTER TABLE secrets
  ADD CONSTRAINT value_is_valid_json
  CHECK (
    value IS NULL OR 
    (value::jsonb IS NOT NULL)
  );

-- Update maintenance mode record with proper validation
UPDATE secrets 
SET value = jsonb_build_object(
  'enabled', COALESCE((value::jsonb->>'enabled')::boolean, false),
  'message', COALESCE(value::jsonb->>'message', 'Site is under maintenance. Please check back later.')
)::text
WHERE name = 'maintenance_mode'
  AND (
    value IS NULL OR 
    value::jsonb->>'enabled' IS NULL OR 
    value::jsonb->>'message' IS NULL
  );

-- Insert maintenance mode record if it doesn't exist
INSERT INTO secrets (name, value)
VALUES (
  'maintenance_mode',
  '{"enabled":false,"message":"Site is under maintenance. Please check back later."}'
)
ON CONFLICT (name) DO NOTHING;
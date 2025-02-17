/*
  # Fix Secrets Table Migration

  1. Changes
    - Add proper upsert logic for maintenance_mode record
    - Add proper error handling
    - Ensure idempotency

  2. Security
    - Maintain existing RLS policies
    - Keep permissions intact
*/

-- Update maintenance mode record with proper upsert logic
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    '{"enabled":false,"message":"Site is under maintenance. Please check back later."}'
)
ON CONFLICT (name) 
DO UPDATE SET
    value = EXCLUDED.value,
    updated_at = now()
WHERE secrets.name = 'maintenance_mode'
  AND secrets.value::jsonb->>'enabled' IS NULL;

-- Ensure proper type casting for the value column
ALTER TABLE secrets
  DROP CONSTRAINT IF EXISTS value_is_valid_json,
  ADD CONSTRAINT value_is_valid_json
  CHECK (value IS NULL OR is_json(value));

-- Create function to validate JSON
CREATE OR REPLACE FUNCTION is_json(text) RETURNS boolean AS $$
BEGIN
  RETURN (SELECT value::jsonb IS NOT NULL FROM (SELECT $1 AS value) AS t);
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN false;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION is_json TO public;
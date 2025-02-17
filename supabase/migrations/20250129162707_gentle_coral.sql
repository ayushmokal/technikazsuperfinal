/*
  # Add Laptop Specifications

  1. New Columns
    - graphics: Text field for GPU specifications
    - All other laptop-specific fields that were missing
  
  2. Changes
    - Adds proper constraints and defaults
    - Ensures backwards compatibility
*/

-- Add missing columns to laptops table
ALTER TABLE laptops
  ADD COLUMN IF NOT EXISTS graphics text,
  ADD COLUMN IF NOT EXISTS display_resolution text,
  ADD COLUMN IF NOT EXISTS graphics_memory text,
  ADD COLUMN IF NOT EXISTS ram_type text,
  ADD COLUMN IF NOT EXISTS ram_speed text,
  ADD COLUMN IF NOT EXISTS memory_slots text,
  ADD COLUMN IF NOT EXISTS expandable_memory text,
  ADD COLUMN IF NOT EXISTS ssd_capacity text,
  ADD COLUMN IF NOT EXISTS battery_cell text,
  ADD COLUMN IF NOT EXISTS battery_type text,
  ADD COLUMN IF NOT EXISTS power_supply text,
  ADD COLUMN IF NOT EXISTS battery_life text,
  ADD COLUMN IF NOT EXISTS wlan text,
  ADD COLUMN IF NOT EXISTS wifi_version text,
  ADD COLUMN IF NOT EXISTS bluetooth_version text,
  ADD COLUMN IF NOT EXISTS hdmi_ports text,
  ADD COLUMN IF NOT EXISTS usb_type_c text,
  ADD COLUMN IF NOT EXISTS ethernet_ports text,
  ADD COLUMN IF NOT EXISTS headphone_jack boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS microphone_jack boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS webcam boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_recording text,
  ADD COLUMN IF NOT EXISTS audio_solution text,
  ADD COLUMN IF NOT EXISTS microphone boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS backlit_keyboard text,
  ADD COLUMN IF NOT EXISTS face_recognition text,
  ADD COLUMN IF NOT EXISTS warranty text,
  ADD COLUMN IF NOT EXISTS sales_package text;

-- Add check constraints for boolean fields
DO $$ 
BEGIN
  ALTER TABLE laptops ADD CONSTRAINT headphone_jack_not_null CHECK (headphone_jack IS NOT NULL);
  ALTER TABLE laptops ADD CONSTRAINT microphone_jack_not_null CHECK (microphone_jack IS NOT NULL);
  ALTER TABLE laptops ADD CONSTRAINT webcam_not_null CHECK (webcam IS NOT NULL);
  ALTER TABLE laptops ADD CONSTRAINT microphone_not_null CHECK (microphone IS NOT NULL);
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_laptops_graphics ON laptops(graphics);
CREATE INDEX IF NOT EXISTS idx_laptops_ram_type ON laptops(ram_type);
CREATE INDEX IF NOT EXISTS idx_laptops_graphics_memory ON laptops(graphics_memory);
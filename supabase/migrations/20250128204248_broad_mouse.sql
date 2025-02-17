-- Add new columns to laptops table
ALTER TABLE laptops
  ADD COLUMN IF NOT EXISTS series text,
  ADD COLUMN IF NOT EXISTS thickness text,
  ADD COLUMN IF NOT EXISTS dimensions text,
  ADD COLUMN IF NOT EXISTS os_type text,
  ADD COLUMN IF NOT EXISTS display_size text,
  ADD COLUMN IF NOT EXISTS pixel_density text,
  ADD COLUMN IF NOT EXISTS display_features text,
  ADD COLUMN IF NOT EXISTS refresh_rate text,
  ADD COLUMN IF NOT EXISTS clock_speed text,
  ADD COLUMN IF NOT EXISTS cache text,
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
ALTER TABLE laptops
  DROP CONSTRAINT IF EXISTS headphone_jack_check,
  ADD CONSTRAINT headphone_jack_check CHECK (headphone_jack IS NOT NULL);

ALTER TABLE laptops
  DROP CONSTRAINT IF EXISTS microphone_jack_check,
  ADD CONSTRAINT microphone_jack_check CHECK (microphone_jack IS NOT NULL);

ALTER TABLE laptops
  DROP CONSTRAINT IF EXISTS webcam_check,
  ADD CONSTRAINT webcam_check CHECK (webcam IS NOT NULL);

ALTER TABLE laptops
  DROP CONSTRAINT IF EXISTS microphone_check,
  ADD CONSTRAINT microphone_check CHECK (microphone IS NOT NULL);
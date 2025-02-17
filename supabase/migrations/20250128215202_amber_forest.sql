/*
  # Add Laptop Specifications Fields

  1. New Fields
    - General Information
      - series
      - thickness
      - dimensions
      - weight
      - os_type
    - Display Details
      - display_size
      - display_resolution 
      - pixel_density
      - display_features
      - refresh_rate
    - Performance
      - clock_speed
      - cache
      - graphics_memory
    - Memory Details
      - ram_type
      - ram_speed
      - memory_slots
      - expandable_memory
    - Storage
      - ssd_capacity
    - Battery & Charging
      - battery_cell
      - battery_type
      - power_supply
      - battery_life
    - Networking
      - wlan
      - wifi_version
      - bluetooth_version
    - Ports
      - hdmi_ports
      - usb_type_c
      - ethernet_ports
      - headphone_jack
      - microphone_jack
    - Multimedia
      - webcam
      - video_recording
      - audio_solution
      - microphone
    - Peripherals
      - backlit_keyboard
      - face_recognition
    - Others
      - warranty
      - sales_package

  2. Changes
    - Add all new columns to laptops table
    - Add appropriate constraints
    - Add indexes for commonly queried fields
*/

-- Add new columns to laptops table
ALTER TABLE laptops
  -- General Information
  ADD COLUMN IF NOT EXISTS series text,
  ADD COLUMN IF NOT EXISTS thickness text,
  ADD COLUMN IF NOT EXISTS dimensions text,
  ADD COLUMN IF NOT EXISTS weight text,
  ADD COLUMN IF NOT EXISTS os_type text,

  -- Display Details
  ADD COLUMN IF NOT EXISTS display_size text,
  ADD COLUMN IF NOT EXISTS display_resolution text,
  ADD COLUMN IF NOT EXISTS pixel_density text,
  ADD COLUMN IF NOT EXISTS display_features text,
  ADD COLUMN IF NOT EXISTS refresh_rate text,

  -- Performance
  ADD COLUMN IF NOT EXISTS clock_speed text,
  ADD COLUMN IF NOT EXISTS cache text,
  ADD COLUMN IF NOT EXISTS graphics_memory text,

  -- Memory Details
  ADD COLUMN IF NOT EXISTS ram_type text,
  ADD COLUMN IF NOT EXISTS ram_speed text,
  ADD COLUMN IF NOT EXISTS memory_slots text,
  ADD COLUMN IF NOT EXISTS expandable_memory text,

  -- Storage
  ADD COLUMN IF NOT EXISTS ssd_capacity text,

  -- Battery & Charging
  ADD COLUMN IF NOT EXISTS battery_cell text,
  ADD COLUMN IF NOT EXISTS battery_type text,
  ADD COLUMN IF NOT EXISTS power_supply text,
  ADD COLUMN IF NOT EXISTS battery_life text,

  -- Networking
  ADD COLUMN IF NOT EXISTS wlan text,
  ADD COLUMN IF NOT EXISTS wifi_version text,
  ADD COLUMN IF NOT EXISTS bluetooth_version text,

  -- Ports
  ADD COLUMN IF NOT EXISTS hdmi_ports text,
  ADD COLUMN IF NOT EXISTS usb_type_c text,
  ADD COLUMN IF NOT EXISTS ethernet_ports text,
  ADD COLUMN IF NOT EXISTS headphone_jack boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS microphone_jack boolean DEFAULT false,

  -- Multimedia
  ADD COLUMN IF NOT EXISTS webcam boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS video_recording text,
  ADD COLUMN IF NOT EXISTS audio_solution text,
  ADD COLUMN IF NOT EXISTS microphone boolean DEFAULT false,

  -- Peripherals
  ADD COLUMN IF NOT EXISTS backlit_keyboard text,
  ADD COLUMN IF NOT EXISTS face_recognition text,

  -- Others
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

-- Create indexes for commonly queried fields
CREATE INDEX IF NOT EXISTS idx_laptops_series ON laptops(series);
CREATE INDEX IF NOT EXISTS idx_laptops_ram_type ON laptops(ram_type);
CREATE INDEX IF NOT EXISTS idx_laptops_graphics_memory ON laptops(graphics_memory);
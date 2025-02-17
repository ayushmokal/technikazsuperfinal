/*
  # Update Laptop Schema

  1. New Fields
    - Add all required fields for laptops table
    - Set default values for boolean fields
    - Add constraints for required fields
  
  2. Changes
    - Make all text fields NOT NULL
    - Add check constraints for validation
    - Create indexes for commonly queried fields
*/

-- Drop existing table and recreate with proper schema
DROP TABLE IF EXISTS laptops CASCADE;

CREATE TABLE laptops (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    brand text NOT NULL,
    model_name text NOT NULL,
    price numeric NOT NULL CHECK (price >= 0),
    display_specs text NOT NULL,
    processor text NOT NULL,
    ram text NOT NULL,
    storage text NOT NULL,
    battery text NOT NULL,
    os text NOT NULL,
    color text NOT NULL,
    buy_link text CHECK (buy_link IS NULL OR buy_link ~* '^https?:\/\/.+'),
    image_url text,
    gallery_images text[],
    popular boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),

    -- General Information
    series text NOT NULL,
    thickness text NOT NULL,
    dimensions text NOT NULL,
    weight text NOT NULL,
    os_type text NOT NULL,

    -- Display Details
    display_size text NOT NULL,
    display_resolution text NOT NULL,
    pixel_density text NOT NULL,
    display_features text NOT NULL,
    refresh_rate text NOT NULL,

    -- Performance
    graphics text NOT NULL,
    graphics_memory text NOT NULL,
    clock_speed text NOT NULL,
    cache text NOT NULL,

    -- Memory Details
    ram_type text NOT NULL,
    ram_speed text NOT NULL,
    memory_slots text NOT NULL,
    expandable_memory text NOT NULL,
    ssd_capacity text NOT NULL,

    -- Battery & Power
    battery_cell text NOT NULL,
    battery_type text NOT NULL,
    power_supply text NOT NULL,
    battery_life text NOT NULL,

    -- Networking
    wlan text NOT NULL,
    wifi_version text NOT NULL,
    bluetooth_version text NOT NULL,

    -- Ports & Connectivity
    hdmi_ports text NOT NULL,
    usb_type_c text NOT NULL,
    ethernet_ports text NOT NULL,
    headphone_jack boolean NOT NULL DEFAULT false,
    microphone_jack boolean NOT NULL DEFAULT false,

    -- Multimedia
    webcam boolean NOT NULL DEFAULT false,
    video_recording text NOT NULL,
    audio_solution text NOT NULL,
    microphone boolean NOT NULL DEFAULT false,

    -- Peripherals
    backlit_keyboard text NOT NULL,
    face_recognition text NOT NULL,

    -- Others
    warranty text NOT NULL,
    sales_package text NOT NULL
);

-- Create indexes for commonly queried fields
CREATE INDEX idx_laptops_brand ON laptops(brand);
CREATE INDEX idx_laptops_price ON laptops(price);
CREATE INDEX idx_laptops_popular ON laptops(popular);
CREATE INDEX idx_laptops_created_at ON laptops(created_at);

-- Enable RLS
ALTER TABLE laptops ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Laptops are viewable by everyone"
ON laptops FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can insert laptops"
ON laptops FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update laptops"
ON laptops FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete laptops"
ON laptops FOR DELETE
TO authenticated
USING (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_laptops_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_laptops_updated_at
    BEFORE UPDATE ON laptops
    FOR EACH ROW
    EXECUTE FUNCTION update_laptops_updated_at();
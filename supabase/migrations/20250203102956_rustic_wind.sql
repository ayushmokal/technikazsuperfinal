-- Insert sample blog posts
INSERT INTO blogs (title, content, categories, subcategories, author, slug, meta_title, meta_description)
VALUES
  (
    'The Future of Gaming: PS5 vs Xbox Series X',
    '<p>A detailed comparison of the next-gen gaming consoles...</p>',
    ARRAY['GAMES'],
    ARRAY['PS5'],
    'John Doe',
    'future-of-gaming-ps5-vs-xbox',
    'PS5 vs Xbox Series X Comparison 2024',
    'Detailed comparison of PS5 and Xbox Series X features, performance, and games'
  ),
  (
    'Latest iPhone 15 Pro Review',
    '<p>An in-depth review of Apple''s newest flagship phone...</p>',
    ARRAY['GADGETS'],
    ARRAY['MOBILE'],
    'Jane Smith',
    'iphone-15-pro-review',
    'iPhone 15 Pro Review - Complete Analysis',
    'Comprehensive review of the iPhone 15 Pro including camera, performance, and battery life'
  ),
  (
    'Top Tech Deals of the Week',
    '<p>Best technology deals and discounts this week...</p>',
    ARRAY['TECH'],
    ARRAY['Tech Deals'],
    'Mike Johnson',
    'top-tech-deals-week',
    'Best Tech Deals This Week',
    'Curated list of the best technology deals and discounts available now'
  );

-- Insert sample mobile products
INSERT INTO mobile_products (
  name,
  brand,
  price,
  display_specs,
  processor,
  ram,
  storage,
  battery,
  camera,
  os,
  color,
  popular
)
VALUES
  (
    'iPhone 15 Pro Max',
    'Apple',
    159900,
    '6.7-inch Super Retina XDR OLED',
    'A17 Pro',
    '8GB',
    '256GB',
    '4422 mAh',
    '48MP Main + 12MP Ultra Wide + 12MP Telephoto',
    'iOS 17',
    'Natural Titanium',
    true
  ),
  (
    'Samsung Galaxy S24 Ultra',
    'Samsung',
    134999,
    '6.8-inch Dynamic AMOLED 2X',
    'Snapdragon 8 Gen 3',
    '12GB',
    '256GB',
    '5000 mAh',
    '200MP Main + 12MP Ultra Wide + 50MP Telephoto',
    'Android 14',
    'Titanium Gray',
    true
  ),
  (
    'Google Pixel 8 Pro',
    'Google',
    106999,
    '6.7-inch LTPO OLED',
    'Google Tensor G3',
    '12GB',
    '128GB',
    '5050 mAh',
    '50MP Main + 48MP Ultra Wide + 48MP Telephoto',
    'Android 14',
    'Obsidian',
    true
  );

-- Insert sample laptops
INSERT INTO laptops (
  name,
  brand,
  model_name,
  price,
  display_specs,
  processor,
  ram,
  storage,
  battery,
  os,
  color,
  series,
  thickness,
  dimensions,
  weight,
  os_type,
  display_size,
  display_resolution,
  pixel_density,
  display_features,
  refresh_rate,
  graphics,
  graphics_memory,
  clock_speed,
  cache,
  ram_type,
  ram_speed,
  memory_slots,
  expandable_memory,
  ssd_capacity,
  battery_cell,
  battery_type,
  power_supply,
  battery_life,
  wlan,
  wifi_version,
  bluetooth_version,
  hdmi_ports,
  usb_type_c,
  ethernet_ports,
  headphone_jack,
  microphone_jack,
  webcam,
  video_recording,
  audio_solution,
  microphone,
  backlit_keyboard,
  face_recognition,
  warranty,
  sales_package,
  popular
)
VALUES
  (
    'MacBook Pro 16 (2023)',
    'Apple',
    'MacBook Pro',
    249900,
    '16.2-inch Liquid Retina XDR display',
    'Apple M3 Max',
    '32GB',
    '1TB SSD',
    '100Wh',
    'macOS Sonoma',
    'Space Black',
    'Pro',
    '16.8 mm',
    '355.7 x 248.1 x 16.8 mm',
    '2.16 kg',
    '64-bit',
    '16.2 inches',
    '3456 x 2234 pixels',
    '254 ppi',
    'ProMotion technology, True Tone, P3 wide color',
    '120 Hz',
    'Up to 40-core GPU',
    'Up to 48GB unified memory',
    'Up to 4.2 GHz',
    '32MB L2 cache',
    'LPDDR5',
    '6400 MHz',
    'Unified memory',
    'Not upgradeable',
    '1TB',
    '6-cell',
    'Li-Polymer',
    '140W USB-C',
    'Up to 22 hours',
    'Wi-Fi 6E (802.11ax)',
    '6E',
    '5.3',
    '1x HDMI 2.1',
    '3x Thunderbolt 4',
    'None',
    true,
    false,
    true,
    '1080p FaceTime HD',
    'Six-speaker sound system with force-cancelling woofers',
    true,
    'Yes, with ambient light sensor',
    'None',
    '1 Year Limited Warranty',
    'MacBook Pro, 140W USB-C Power Adapter, USB-C to MagSafe 3 Cable',
    true
  );

-- Insert sample expert review
INSERT INTO expert_reviews (
  product_id,
  rating,
  author,
  summary,
  detailed_review,
  pros,
  cons,
  verdict
)
SELECT 
  id,
  9.5,
  'Tech Expert',
  'The iPhone 15 Pro Max represents the pinnacle of smartphone technology in 2023',
  '<p>Detailed review content here...</p>',
  ARRAY['Premium build quality', 'Excellent camera system', 'Powerful A17 Pro chip'],
  ARRAY['High price', 'Slow charging compared to competitors'],
  'The iPhone 15 Pro Max is the best iPhone yet, offering significant improvements in camera capabilities and performance'
FROM mobile_products 
WHERE name = 'iPhone 15 Pro Max'
LIMIT 1;

-- Insert initial maintenance mode setting
INSERT INTO secrets (name, value)
VALUES (
    'maintenance_mode',
    '{"enabled": false, "message": "Site is under maintenance. Please check back later."}'::jsonb
)
ON CONFLICT (name) DO NOTHING;
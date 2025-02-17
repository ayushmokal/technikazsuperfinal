import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import type { ProductFormData } from "@/schemas/productSchemas";

interface SpecificationsSectionProps {
  form: UseFormReturn<ProductFormData>;
  productType: 'mobile' | 'laptop';
}

export function SpecificationsSection({ form, productType }: SpecificationsSectionProps) {
  if (productType !== 'laptop') {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Display Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Display Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="display_specs"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Specifications</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 15.6-inch Full HD IPS Anti-glare Display" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_resolution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Resolution</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1920 x 1080 Pixels" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="pixel_density"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pixel Density</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 141 ppi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="display_features"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Features</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Full HD Anti-glare Display" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="refresh_rate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Refresh Rate</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 120 Hz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Performance Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="processor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Processor</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., AMD Hexa Core Ryzen 5 5600H" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="clock_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clock Speed</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4.2 GHz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cache"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cache</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 16 MB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="graphics"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graphics Processor</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NVIDIA GeForce RTX 3050" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="graphics_memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graphics Memory</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4 GB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Memory Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Memory Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="ram"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 8 GB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ram_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., DDR4" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ram_speed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RAM Speed</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3200 MHz" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="memory_slots"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Memory Slots</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expandable_memory"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expandable Memory</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 16 GB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="storage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Storage</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 512GB SSD" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ssd_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SSD Capacity</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 512GB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Battery Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Battery & Power</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="battery"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3 Cell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="battery_cell"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Cell</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 3 Cell" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="battery_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Type</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Li-Po" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="power_supply"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Power Supply</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 45 W" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="battery_life"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Battery Life</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 4 Hrs" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Networking Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Networking</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="wlan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wireless LAN</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 802.11 a/b/g/n/ac" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="wifi_version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wi-Fi Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bluetooth_version"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bluetooth Version</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 5.0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Ports Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Ports & Connectivity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="hdmi_ports"
            render={({ field }) => (
              <FormItem>
                <FormLabel>HDMI Ports</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usb_type_c"
            render={({ field }) => (
              <FormItem>
                <FormLabel>USB Type-C</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ethernet_ports"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ethernet Ports</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="headphone_jack"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Headphone Jack</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="microphone_jack"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Microphone Jack</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Multimedia Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Multimedia</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="webcam"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Webcam</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="video_recording"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Video Recording</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 720p" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="audio_solution"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Audio Solution</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., High Definition Nahimic Audio" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="microphone"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel>Built-in Microphone</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Peripherals Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Peripherals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="backlit_keyboard"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backlit Keyboard</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Yes, Backlit" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="face_recognition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Face Recognition</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., NA" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Others Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Others</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="warranty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Warranty</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 1 Year" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sales_package"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sales Package</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Laptop, Power Adaptor, User Guide" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
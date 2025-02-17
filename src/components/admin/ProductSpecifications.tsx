import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface SpecificationItemProps {
  label: string;
  value: string | number | boolean | null | undefined;
}

function SpecificationItem({ label, value }: SpecificationItemProps) {
  if (value === null || value === undefined) return null;
  
  // Handle boolean values
  if (typeof value === 'boolean') {
    value = value ? 'Yes' : 'No';
  }

  // Handle array values
  if (Array.isArray(value)) {
    value = value.join(', ');
  }

  return (
    <div className="flex py-2 text-left">
      <span className="text-gray-700 font-medium w-32">{label}</span>
      <span className="font-medium text-left flex-1">{value}</span>
    </div>
  );
}

interface ProductSpecificationsProps {
  product: {
    name: string;
    brand: string;
    price: number;
    model_name?: string;
    announced?: string;
    status?: string;
    display_specs: string;
    display_type?: string;
    display_size?: string;
    display_resolution?: string;
    display_protection?: string;
    processor: string;
    cpu_details?: string;
    gpu_details?: string;
    ram: string;
    memory_type?: string;
    card_slot?: boolean;
    storage: string;
    camera?: string;
    battery: string;
    battery_type?: string;
    charging_specs?: string;
    os?: string;
    dimensions?: string;
    weight?: string;
    build_material?: string;
    sim_type?: string;
    protection_rating?: string;
    wlan?: string;
    bluetooth?: string;
    nfc?: boolean;
    gps?: string;
    usb_type?: string;
    radio?: boolean;
    infrared?: boolean;
    network_technology?: string;
    network_speed?: string;
    loudspeaker_type?: string;
    audio_jack?: boolean;
    sensors?: string[];
    available_colors?: string[];
    bands_2g?: string[];
    bands_3g?: string[];
    bands_4g?: string[];
    bands_5g?: string[];
    main_camera_features?: any;
    main_camera_video?: any;
    selfie_camera_specs?: any;
    [key: string]: any;
  };
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  return (
    <div className="space-y-6">
      {/* Basic Information - Always Visible */}
      <div className="space-y-2 text-left">
        <h3 className="font-semibold text-lg pb-2 border-b-2 border-[#00897B]">Basic Information</h3>
        <div className="space-y-2">
          <SpecificationItem label="Brand" value={product.brand} />
          <SpecificationItem label="Model" value={product.name} />
          <SpecificationItem label="Price" value={`₹${product.price.toLocaleString()}`} />
          <SpecificationItem label="Announced" value={product.announced} />
          <SpecificationItem label="Status" value={product.status} />
        </div>
      </div>

      <Separator className="my-6" />

      {/* Collapsible Sections */}
      <Accordion type="multiple" defaultValue={[
        "display",
        "platform",
        "memory",
        "camera",
        "body",
        "battery",
        "communications",
        "network",
        "sound",
        "features"
      ]} className="w-full">
        <AccordionItem value="display">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Display</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Type" value={product.display_type} />
              <SpecificationItem label="Size" value={product.display_size} />
              <SpecificationItem label="Resolution" value={product.display_resolution} />
              <SpecificationItem label="Protection" value={product.display_protection} />
              <SpecificationItem label="Specifications" value={product.display_specs} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Platform</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Processor" value={product.processor} />
              <SpecificationItem label="CPU Details" value={product.cpu_details} />
              <SpecificationItem label="GPU Details" value={product.gpu_details} />
              <SpecificationItem label="Operating System" value={product.os} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="memory">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Memory</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="RAM" value={product.ram} />
              <SpecificationItem label="Storage" value={product.storage} />
              <SpecificationItem label="Memory Type" value={product.memory_type} />
              <SpecificationItem label="Card Slot" value={product.card_slot} />
            </div>
          </AccordionContent>
        </AccordionItem>

        {product.camera && (
          <AccordionItem value="camera">
            <AccordionTrigger className="border-b-2 border-[#00897B]">Camera</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <SpecificationItem label="Main Camera" value={product.camera} />
                <SpecificationItem label="Main Camera Features" value={product.main_camera_features ? JSON.stringify(product.main_camera_features, null, 2) : undefined} />
                <SpecificationItem label="Video Recording" value={product.main_camera_video ? JSON.stringify(product.main_camera_video, null, 2) : undefined} />
                <SpecificationItem label="Selfie Camera" value={product.selfie_camera_specs ? JSON.stringify(product.selfie_camera_specs, null, 2) : undefined} />
              </div>
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="body">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Body</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Dimensions" value={product.dimensions} />
              <SpecificationItem label="Weight" value={product.weight} />
              <SpecificationItem label="Build" value={product.build_material} />
              <SpecificationItem label="SIM" value={product.sim_type} />
              <SpecificationItem label="Protection" value={product.protection_rating} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="battery">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Battery & Charging</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Capacity" value={product.battery} />
              <SpecificationItem label="Type" value={product.battery_type} />
              <SpecificationItem label="Charging" value={product.charging_specs} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="communications">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Communications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="WLAN" value={product.wlan} />
              <SpecificationItem label="Bluetooth" value={product.bluetooth} />
              <SpecificationItem label="NFC" value={product.nfc} />
              <SpecificationItem label="GPS" value={product.gps} />
              <SpecificationItem label="USB Type" value={product.usb_type} />
              <SpecificationItem label="Radio" value={product.radio} />
              <SpecificationItem label="Infrared" value={product.infrared} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="network">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Network</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Technology" value={product.network_technology} />
              <SpecificationItem label="Speed" value={product.network_speed} />
              <SpecificationItem label="2G Bands" value={product.bands_2g} />
              <SpecificationItem label="3G Bands" value={product.bands_3g} />
              <SpecificationItem label="4G Bands" value={product.bands_4g} />
              <SpecificationItem label="5G Bands" value={product.bands_5g} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sound">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Sound</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Loudspeaker" value={product.loudspeaker_type} />
              <SpecificationItem label="3.5mm Jack" value={product.audio_jack} />
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="features">
          <AccordionTrigger className="border-b-2 border-[#00897B]">Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <SpecificationItem label="Sensors" value={Array.isArray(product.sensors) ? product.sensors.join(', ') : product.sensors} />
              <SpecificationItem label="Available Colors" value={Array.isArray(product.available_colors) ? product.available_colors.join(', ') : product.available_colors} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
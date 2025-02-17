import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { MobileProduct } from "@/types/product";

interface SpecificationItemProps {
  label: string;
  value: string | number | boolean | null | undefined;
}

function SpecificationItem({ label, value }: SpecificationItemProps) {
  if (value === null || value === undefined || value === '') return null;
  
  const displayValue = typeof value === 'boolean'
    ? value ? 'Yes' : 'No'
    : Array.isArray(value)
      ? value.join(', ')
      : value.toString();

  return (
    <div className="flex py-2.5 border-b last:border-b-0">
      <span className="text-gray-900 w-[140px] sm:w-[160px] flex-shrink-0 text-sm sm:text-base text-left">{label}</span>
      <span className="text-gray-900 flex-1 text-sm sm:text-base text-left">{displayValue}</span>
    </div>
  );
}

interface ProductSpecificationsProps {
  product: MobileProduct;
}

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specs = {
    basic: {
      title: "Basic Information",
      specs: [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.name },
        { label: "Price", value: `₹${product.price.toLocaleString()}` },
        { label: "Announced", value: product.announced },
        { label: "Status", value: product.status },
      ]
    },
    display: {
      title: "Display",
      specs: [
        { label: "Type", value: product.display_type },
        { label: "Protection", value: product.display_protection },
        { label: "Specifications", value: product.display_specs },
      ]
    },
    platform: {
      title: "Platform",
      specs: [
        { label: "Processor", value: product.processor },
        { label: "CPU Details", value: product.cpu_details },
        { label: "GPU Details", value: product.gpu_details },
        { label: "Operating System", value: product.os },
      ]
    },
    memory: {
      title: "Memory",
      specs: [
        { label: "RAM", value: product.ram },
        { label: "Storage", value: product.storage },
        { label: "Memory Type", value: product.memory_type },
        { label: "Card Slot", value: product.card_slot },
      ]
    },
    camera: {
      title: "Camera",
      specs: [
        { label: "Main Camera", value: product.camera },
        { label: "Features", value: product.main_camera_features ? JSON.stringify(product.main_camera_features, null, 2) : undefined },
        { label: "Video", value: product.main_camera_video ? JSON.stringify(product.main_camera_video, null, 2) : undefined },
      ]
    },
    body: {
      title: "Body",
      specs: [
        { label: "Dimensions", value: product.dimensions },
        { label: "Weight", value: product.weight },
        { label: "Build", value: product.build_material },
        { label: "SIM", value: product.sim_type },
        { label: "Protection", value: product.protection_rating },
      ]
    },
    battery: {
      title: "Battery & Charging",
      specs: [
        { label: "Capacity", value: product.battery },
        { label: "Type", value: product.battery_type },
        { label: "Charging", value: product.charging_specs },
      ]
    },
    network: {
      title: "Network",
      specs: [
        { label: "Technology", value: product.network_technology },
        { label: "2G Bands", value: product.bands_2g },
        { label: "3G Bands", value: product.bands_3g },
        { label: "4G Bands", value: product.bands_4g },
        { label: "5G Bands", value: product.bands_5g },
        { label: "Speed", value: product.network_speed },
      ]
    },
    connectivity: {
      title: "Connectivity",
      specs: [
        { label: "WLAN", value: product.wlan },
        { label: "Bluetooth", value: product.bluetooth },
        { label: "GPS", value: product.gps },
        { label: "NFC", value: product.nfc },
        { label: "Radio", value: product.radio },
        { label: "USB", value: product.usb_type },
      ]
    },
    features: {
      title: "Features",
      specs: [
        { label: "Sensors", value: product.sensors },
        { label: "Colors", value: product.available_colors },
      ]
    },
    sound: {
      title: "Sound",
      specs: [
        { label: "Loudspeaker", value: product.loudspeaker_type },
        { label: "3.5mm Jack", value: product.audio_jack },
      ]
    },
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <Accordion type="multiple" defaultValue={Object.keys(specs)} className="space-y-4">
        {Object.entries(specs).map(([key, section]) => {
          const validSpecs = section.specs.filter(spec => 
            spec.value !== null && spec.value !== undefined && spec.value !== ''
          );

          if (validSpecs.length === 0) return null;

          return (
            <AccordionItem key={key} value={key} className="border-none bg-white">
              <AccordionTrigger className="px-4 py-3 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]]:bg-gray-50 border-b-2 border-[#00897B]">
                <span className="text-base font-semibold text-gray-900">{section.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4">
                  {validSpecs.map((spec, index) => (
                    <SpecificationItem
                      key={`${key}-${index}`}
                      label={spec.label}
                      value={spec.value}
                    />
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
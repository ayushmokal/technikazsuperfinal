import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { LaptopProduct } from "@/types/product";

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
    <div className="flex py-3 border-b last:border-b-0">
      <span className="text-gray-900 w-[200px] flex-shrink-0 text-left">{label}</span>
      <span className="text-gray-900 flex-1 text-left">{displayValue}</span>
    </div>
  );
}

interface ProductSpecificationsProps {
  product: LaptopProduct;
}

export function LaptopSpecifications({ product }: ProductSpecificationsProps) {
  const specs = {
    basic: {
      title: "Basic Information",
      specs: [
        { label: "Brand", value: product.brand },
        { label: "Model", value: product.model_name },
        { label: "Series", value: product.series },
        { label: "Thickness", value: product.thickness },
        { label: "Dimensions", value: product.dimensions },
        { label: "Weight", value: product.weight },
        { label: "Colour(s)", value: product.color },
        { label: "Operating System", value: product.os },
        { label: "Operating System Type", value: product.os_type },
      ]
    },
    display: {
      title: "Display Details",
      specs: [
        { label: "Display", value: product.display_specs },
        { label: "Size", value: product.display_size },
        { label: "Resolution", value: product.display_resolution },
        { label: "Pixel Density", value: product.pixel_density },
        { label: "Features", value: product.display_features },
        { label: "Refresh Rate", value: product.refresh_rate },
      ]
    },
    performance: {
      title: "Performance",
      specs: [
        { label: "Processor", value: product.processor },
        { label: "Clock Speed", value: product.clock_speed },
        { label: "Cache", value: product.cache },
        { label: "Graphics", value: product.graphics },
        { label: "Graphics Memory", value: product.graphics_memory },
      ]
    },
    memory: {
      title: "Memory",
      specs: [
        { label: "RAM", value: product.ram },
        { label: "RAM Type", value: product.ram_type },
        { label: "RAM Speed", value: product.ram_speed },
        { label: "Memory Slots", value: product.memory_slots },
        { label: "Expandable Memory", value: product.expandable_memory },
      ]
    },
    storage: {
      title: "Storage",
      specs: [
        { label: "Storage", value: product.storage },
        { label: "SSD Capacity", value: product.ssd_capacity },
      ]
    },
    battery: {
      title: "Battery",
      specs: [
        { label: "Battery", value: product.battery },
        { label: "Battery Cell", value: product.battery_cell },
        { label: "Battery Type", value: product.battery_type },
        { label: "Power Supply", value: product.power_supply },
        { label: "Battery Life", value: product.battery_life },
      ]
    },
    networking: {
      title: "Networking",
      specs: [
        { label: "Wireless LAN", value: product.wlan },
        { label: "Wi-Fi Version", value: product.wifi_version },
        { label: "Bluetooth Version", value: product.bluetooth_version },
      ]
    },
    ports: {
      title: "Ports",
      specs: [
        { label: "HDMI Ports", value: product.hdmi_ports },
        { label: "USB Type-C", value: product.usb_type_c },
        { label: "Ethernet Ports", value: product.ethernet_ports },
        { label: "Headphone Jack", value: product.headphone_jack },
        { label: "Microphone Jack", value: product.microphone_jack },
      ]
    },
    multimedia: {
      title: "Multimedia",
      specs: [
        { label: "Webcam", value: product.webcam },
        { label: "Video Recording", value: product.video_recording },
        { label: "Audio Solution", value: product.audio_solution },
        { label: "Built-in Microphone", value: product.microphone },
      ]
    },
    peripherals: {
      title: "Peripherals",
      specs: [
        { label: "Backlit Keyboard", value: product.backlit_keyboard },
        { label: "Face Recognition", value: product.face_recognition },
      ]
    },
    others: {
      title: "Others",
      specs: [
        { label: "Warranty", value: product.warranty },
        { label: "Sales Package", value: product.sales_package },
      ]
    },
  };

  return (
    <div className="space-y-4">
      <Accordion type="multiple" defaultValue={Object.keys(specs)} className="space-y-4">
        {Object.entries(specs).map(([key, section]) => {
          const validSpecs = section.specs.filter(spec => 
            spec.value !== null && spec.value !== undefined && spec.value !== ''
          );

          if (validSpecs.length === 0) return null;

          return (
            <AccordionItem key={key} value={key} className="border-none bg-white">
              <AccordionTrigger className="px-0 py-3 text-left hover:no-underline hover:bg-gray-50 [&[data-state=open]]:bg-gray-50 border-b-2 border-[#00897B]">
                <span className="text-base font-semibold text-gray-900">{section.title}</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="py-2">
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
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CompareSearchBar } from "./CompareSearchBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { X, Plus, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ComparisonTableProps {
  selectedProducts: (MobileProduct | LaptopProduct)[];
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
  onRemove: (productId: string) => void;
  onAddProduct: (product: MobileProduct | LaptopProduct) => void;
}

export function ComparisonTable({ 
  selectedProducts, 
  currentProduct, 
  type, 
  onRemove,
  onAddProduct 
}: ComparisonTableProps) {
  const [activeProduct, setActiveProduct] = useState<string>(selectedProducts[0]?.id);
  const [showSearch, setShowSearch] = useState(false);

  // Generate unique keys for each product
  const generateKey = (prefix: string, productId: string, index: number, subIndex?: number) => {
    return `${prefix}-${productId}-${index}${subIndex !== undefined ? `-${subIndex}` : ''}`;
  };

  const mobileSpecCategories = {
    expert_review: {
      title: "Expert Review",
      specs: [
        { title: "Rating", key: "expert_rating", format: (review: any) => review ? `${review.rating}/10` : 'No review' },
        { title: "Verdict", key: "expert_verdict", format: (review: any) => review?.verdict || 'No verdict available' },
      ]
    },
    general: {
      title: "Basic Information",
      specs: [
        { title: "Brand", key: "brand" },
        { title: "Model", key: "model_name" },
        { title: "Price", key: "price", format: (value: number) => `₹${value.toLocaleString()}` },
        { title: "Announced", key: "announced" },
        { title: "Status", key: "status" },
      ]
    },
    display: {
      title: "Display",
      specs: [
        { title: "Type", key: "display_type" },
        { title: "Size", key: "display_size" },
        { title: "Resolution", key: "display_resolution" },
        { title: "Protection", key: "display_protection" },
        { title: "Features", key: "display_specs" },
      ]
    },
    platform: {
      title: "Platform",
      specs: [
        { title: "Processor", key: "processor" },
        { title: "CPU", key: "cpu_details" },
        { title: "GPU", key: "gpu_details" },
        { title: "OS", key: "os" },
      ]
    },
    memory: {
      title: "Memory",
      specs: [
        { title: "RAM", key: "ram" },
        { title: "Storage", key: "storage" },
        { title: "Card slot", key: "card_slot", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Type", key: "memory_type" },
      ]
    },
    camera: {
      title: "Camera",
      specs: [
        { title: "Main Camera", key: "camera" },
        { title: "Features", key: "main_camera_features" },
        { title: "Video", key: "main_camera_video" },
      ]
    },
    body: {
      title: "Body",
      specs: [
        { title: "Dimensions", key: "dimensions" },
        { title: "Weight", key: "weight" },
        { title: "Build", key: "build_material" },
        { title: "SIM", key: "sim_type" },
        { title: "Protection", key: "protection_rating" },
      ]
    },
    battery: {
      title: "Battery",
      specs: [
        { title: "Type", key: "battery_type" },
        { title: "Capacity", key: "battery" },
        { title: "Charging", key: "charging_specs" },
      ]
    },
    network: {
      title: "Network",
      specs: [
        { title: "Technology", key: "network_technology" },
        { title: "2G bands", key: "bands_2g" },
        { title: "3G bands", key: "bands_3g" },
        { title: "4G bands", key: "bands_4g" },
        { title: "5G bands", key: "bands_5g" },
        { title: "Speed", key: "network_speed" },
      ]
    },
    connectivity: {
      title: "Connectivity",
      specs: [
        { title: "WLAN", key: "wlan" },
        { title: "Bluetooth", key: "bluetooth" },
        { title: "GPS", key: "gps" },
        { title: "NFC", key: "nfc", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Radio", key: "radio", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "USB", key: "usb_type" },
      ]
    },
    features: {
      title: "Features",
      specs: [
        { title: "Sensors", key: "sensors" },
        { title: "Colors", key: "available_colors" },
      ]
    },
    sound: {
      title: "Sound",
      specs: [
        { title: "Loudspeaker", key: "loudspeaker_type" },
        { title: "3.5mm jack", key: "audio_jack", format: (value: boolean) => value ? "Yes" : "No" },
      ]
    },
  };

  const laptopSpecCategories = {
    general: {
      title: "Basic Information",
      specs: [
        { title: "Brand", key: "brand" },
        { title: "Model", key: "model_name" },
        { title: "Series", key: "series" },
        { title: "Price", key: "price", format: (value: number) => `₹${value.toLocaleString()}` },
        { title: "Color", key: "color" },
      ]
    },
    display: {
      title: "Display",
      specs: [
        { title: "Display", key: "display_specs" },
        { title: "Size", key: "display_size" },
        { title: "Resolution", key: "display_resolution" },
        { title: "Refresh Rate", key: "refresh_rate" },
        { title: "Features", key: "display_features" },
      ]
    },
    performance: {
      title: "Performance",
      specs: [
        { title: "Processor", key: "processor" },
        { title: "Clock Speed", key: "clock_speed" },
        { title: "Cache", key: "cache" },
        { title: "Graphics", key: "graphics" },
        { title: "Graphics Memory", key: "graphics_memory" },
      ]
    },
    memory: {
      title: "Memory",
      specs: [
        { title: "RAM", key: "ram" },
        { title: "RAM Type", key: "ram_type" },
        { title: "RAM Speed", key: "ram_speed" },
        { title: "Storage", key: "storage" },
        { title: "SSD Capacity", key: "ssd_capacity" },
      ]
    },
    battery: {
      title: "Battery & Power",
      specs: [
        { title: "Battery", key: "battery" },
        { title: "Battery Cell", key: "battery_cell" },
        { title: "Battery Type", key: "battery_type" },
        { title: "Power Supply", key: "power_supply" },
        { title: "Battery Life", key: "battery_life" },
      ]
    },
    ports: {
      title: "Ports & Connectivity",
      specs: [
        { title: "HDMI Ports", key: "hdmi_ports" },
        { title: "USB Type-C", key: "usb_type_c" },
        { title: "Ethernet", key: "ethernet_ports" },
        { title: "Headphone Jack", key: "headphone_jack", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Microphone Jack", key: "microphone_jack", format: (value: boolean) => value ? "Yes" : "No" },
      ]
    },
    multimedia: {
      title: "Multimedia",
      specs: [
        { title: "Webcam", key: "webcam", format: (value: boolean) => value ? "Yes" : "No" },
        { title: "Video Recording", key: "video_recording" },
        { title: "Audio", key: "audio_solution" },
        { title: "Microphone", key: "microphone", format: (value: boolean) => value ? "Yes" : "No" },
      ]
    },
    others: {
      title: "Others",
      specs: [
        { title: "Keyboard", key: "backlit_keyboard" },
        { title: "Face Recognition", key: "face_recognition" },
        { title: "Warranty", key: "warranty" },
        { title: "Sales Package", key: "sales_package" },
      ]
    },
  };

  const specCategories = type === 'laptop' ? laptopSpecCategories : mobileSpecCategories;

  const formatValue = (spec: any, value: any, product: MobileProduct | LaptopProduct) => {
    if (spec.key.startsWith('expert_')) {
      const review = getExpertReview(product.id);
      return spec.format(review);
    }

    if (value === null || value === undefined || value === '') return 'Not Specified';
    if (spec.format) return spec.format(value);
    if (Array.isArray(value)) return value.join(', ');
    return value.toString();
  };

  // Fetch expert reviews for all products
  const { data: expertReviews = [] } = useQuery({
    queryKey: ['expert-reviews', selectedProducts.map(p => p.id)],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_reviews')
        .select('*')
        .in('product_id', selectedProducts.map(p => p.id));

      if (error) throw error;
      return data;
    }
  });

  const getExpertReview = (productId: string) => {
    return expertReviews.find(review => review.product_id === productId);
  };

  const MobileView = () => (
    <div className="space-y-4">
      {/* Product Selection */}
      <div className="flex gap-2 overflow-x-auto pb-4 px-4 snap-x scrollbar-hide">
        {selectedProducts.map((product, index) => (
          <div 
            key={generateKey('mobile-product', product.id, index)}
            className={cn(
              "flex-shrink-0 w-[140px] snap-start",
              "border rounded-lg p-3 cursor-pointer transition-colors",
              activeProduct === product.id ? "border-primary bg-primary/5" : "border-gray-200"
            )}
            onClick={() => setActiveProduct(product.id)}
          >
            <div className="aspect-square mb-2">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-sm font-medium line-clamp-2">{product.name}</h3>
            <p className="text-primary font-bold mt-1 text-sm">₹{product.price.toLocaleString()}</p>
          </div>
        ))}
        {selectedProducts.length < 3 && (
          <button
            key="mobile-add-button"
            onClick={() => setShowSearch(true)}
            className="flex-shrink-0 w-[140px] aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-primary hover:border-primary transition-colors"
          >
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium px-2 text-center">Add Product</span>
          </button>
        )}
      </div>

      {/* Specifications */}
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(specCategories).map(([categoryKey, category]) => {
          if (!category) return null;
          return (
            <AccordionItem key={generateKey('mobile-category', categoryKey, 0)} value={categoryKey}>
              <AccordionTrigger className="text-lg font-semibold px-4">
                {category.title}
              </AccordionTrigger>
              <AccordionContent className="px-4">
                <div className="space-y-4">
                  {category.specs.map((spec, specIndex) => (
                    <div key={generateKey('mobile-spec', categoryKey, specIndex)} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-3">{spec.title}</h4>
                      <div className="space-y-3">
                        {selectedProducts.map((product, productIndex) => (
                          <div 
                            key={generateKey('mobile-value', product.id, specIndex)}
                            className={cn(
                              "flex items-center justify-between gap-2 p-2 rounded-lg transition-colors",
                              activeProduct === product.id ? "bg-primary/5" : "hover:bg-gray-50"
                            )}
                            onClick={() => setActiveProduct(product.id)}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <img 
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                className="w-8 h-8 object-contain"
                              />
                              <span className="font-medium truncate">{product.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                {formatValue(spec, product[spec.key as keyof typeof product], product)}
                              </span>
                              <ChevronRight className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Search Dialog */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full sm:w-[400px] sm:rounded-lg">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">Add Product to Compare</h3>
            </div>
            <div className="p-4">
              <CompareSearchBar
                type={type}
                onProductSelect={(product) => {
                  onAddProduct(product);
                  setShowSearch(false);
                }}
                currentProductId={currentProduct.id}
              />
            </div>
            <div className="p-4 bg-gray-50 sm:rounded-b-lg">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowSearch(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="hidden md:block">
        <ScrollArea className="w-full">
          <div className="min-w-[640px]">
            {/* Product Headers */}
            <div className="grid grid-cols-4 gap-4 p-6 border-b">
              <div className="font-semibold text-left text-lg">Specifications</div>
              {selectedProducts.map((product, index) => (
                <div key={generateKey('header', product.id, index)} className="relative">
                  <div className="flex flex-col items-center">
                    <div className="w-48 h-48 relative mb-3">
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                      {product.id !== currentProduct.id && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => onRemove(product.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <h3 className="text-sm font-medium text-center line-clamp-2">{product.name}</h3>
                    <p className="text-primary font-bold mt-1">₹{product.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {selectedProducts.length < 3 && (
                <div key="add-product-slot" className="flex flex-col items-center justify-center">
                  <div className="w-48 h-48 border-2 border-dashed rounded-lg flex items-center justify-center p-4">
                    <CompareSearchBar
                      type={type}
                      onProductSelect={onAddProduct}
                      currentProductId={currentProduct.id}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Content */}
            <div className="p-6">
              {Object.entries(specCategories).map(([categoryKey, category], categoryIndex) => {
                if (!category) return null;
                return (
                  <div key={`category-${categoryKey}-${categoryIndex}`} className="mb-8">
                    <h3 className="text-lg font-semibold mb-4 text-left text-gray-900">{category.title}</h3>
                    <div className="space-y-3">
                      {category.specs.map((spec, specIndex) => (
                        <div key={`spec-${categoryKey}-${specIndex}`} className="grid grid-cols-4 gap-4 py-2">
                          <div className="font-medium text-gray-700 text-left">
                            {spec.title}
                          </div>
                          {selectedProducts.map((product, productIndex) => (
                            <div 
                              key={`value-${product.id}-${specIndex}-${productIndex}`}
                              className="text-gray-600 break-words"
                            >
                              {formatValue(spec, product[spec.key as keyof typeof product], product)}
                            </div>
                          ))}
                          {selectedProducts.length < 3 && (
                            <div key={`empty-${spec.key}-${specIndex}`} className="text-gray-400 italic">
                              -
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Separator className="my-6" />
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>
      <div className="md:hidden">
        <MobileView />
      </div>
    </>
  );
}
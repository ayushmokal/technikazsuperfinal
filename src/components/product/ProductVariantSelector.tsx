import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LaptopProduct, MobileProduct } from "@/types/product";

interface ProductVariantSelectorProps {
  product: LaptopProduct | MobileProduct;
  type: 'mobile' | 'laptop';
  onVariantChange: (variant: LaptopProduct | MobileProduct) => void;
}

export function ProductVariantSelector({ product, type, onVariantChange }: ProductVariantSelectorProps) {
  const { data: variants } = useQuery({
    queryKey: ['product-variants', product.name, product.brand],
    queryFn: async () => {
      const { data, error } = await supabase
        .from(type === 'laptop' ? 'laptops' : 'mobile_products')
        .select('*')
        .eq('name', product.name)
        .eq('brand', product.brand);

      if (error) {
        console.error('Error fetching variants:', error);
        throw error;
      }

      return data || [];
    },
  });

  // Get unique storage and color options for this product model
  const storageOptions = [...new Set(variants?.map(v => v.storage))].filter(Boolean).sort((a, b) => {
    const aNum = parseInt(a?.replace(/\D/g, '') || '0');
    const bNum = parseInt(b?.replace(/\D/g, '') || '0');
    return aNum - bNum;
  });

  const colorOptions = [...new Set(variants?.map(v => v.color))].filter(Boolean);

  const handleStorageChange = (newStorage: string) => {
    const variant = variants?.find(v => 
      v.storage === newStorage && 
      (product.color ? v.color === product.color : true)
    );
    
    if (variant) {
      console.log('Storage changed, new variant:', variant);
      onVariantChange(variant);
    }
  };

  const handleColorChange = (newColor: string) => {
    const variant = variants?.find(v => 
      v.color === newColor && 
      (product.storage ? v.storage === product.storage : true)
    );
    
    if (variant) {
      console.log('Color changed, new variant:', variant);
      onVariantChange(variant);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <Select 
        value={product.storage || ''} 
        onValueChange={handleStorageChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Storage" />
        </SelectTrigger>
        <SelectContent>
          {storageOptions.map((storage) => (
            <SelectItem key={storage} value={storage || ''}>
              {storage} Storage
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={product.color || ''} 
        onValueChange={handleColorChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Color" />
        </SelectTrigger>
        <SelectContent>
          {colorOptions.map((color) => (
            <SelectItem key={color} value={color || ''}>
              {color}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
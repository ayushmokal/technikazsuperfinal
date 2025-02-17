import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, Search } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface CompareSearchBarProps {
  type: 'mobile' | 'laptop';
  onProductSelect: (product: MobileProduct | LaptopProduct) => void;
  currentProductId: string;
}

export function CompareSearchBar({ type, onProductSelect, currentProductId }: CompareSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['product-search', type, searchQuery],
    queryFn: async () => {
      if (!searchQuery) return [];
      
      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .neq('id', currentProductId)
        .ilike('name', `%${searchQuery}%`)
        .limit(5);

      if (error) throw error;
      return data;
    },
    enabled: searchQuery.length > 0,
  });

  const handleProductSelect = (product: MobileProduct | LaptopProduct) => {
    onProductSelect(product);
    setOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-center h-12 px-4"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-[calc(100vw-2rem)] sm:w-[400px] p-0" 
          align="start"
          side="bottom"
          sideOffset={4}
        >
          <Command>
            <CommandInput
              placeholder="Search products..."
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="h-12"
            />
            <CommandList>
              <CommandEmpty className="py-6 text-center text-sm">
                {searchQuery ? "No products found." : "Type to search..."}
              </CommandEmpty>
              <CommandGroup>
                {isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  searchResults.map((product) => (
                    <CommandItem
                      key={product.id}
                      value={product.name}
                      onSelect={() => handleProductSelect(product)}
                      className="py-3 px-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 flex-shrink-0 rounded-md border p-2">
                          <img
                            src={product.image_url || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="flex flex-col gap-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{product.price.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {type === 'mobile' ? (product as MobileProduct).camera : (product as LaptopProduct).graphics}
                          </p>
                        </div>
                      </div>
                    </CommandItem>
                  ))
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ComparisonTable } from "./ComparisonTable";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface CompareSectionProps {
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
}

export function CompareSection({ currentProduct, type }: CompareSectionProps) {
  const [selectedProducts, setSelectedProducts] = useState<(MobileProduct | LaptopProduct)[]>([currentProduct]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: searchResults = [], isLoading } = useQuery({
    queryKey: ['products', type, searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      
      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .neq('id', currentProduct.id)
        .ilike('name', `%${searchQuery}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
  });

  const addToCompare = (product: MobileProduct | LaptopProduct) => {
    if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
      setSearchQuery("");
      setShowResults(false);
    } else {
      toast({
        title: "Maximum products reached",
        description: "You can compare up to 3 products at a time",
      });
    }
  };

  const removeFromCompare = (productId: string) => {
    setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
  };

  const handleCompare = () => {
    if (selectedProducts.length > 1) {
      navigate('/comparison', {
        state: {
          products: selectedProducts,
          type,
        },
        replace: true
      });
    } else {
      toast({
        title: "Add more products",
        description: "Please select at least one more product to compare",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search products to compare..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Search Results Dialog */}
        <Dialog open={showResults && searchQuery.trim().length > 0} onOpenChange={setShowResults}>
          <DialogContent className="max-w-md">
            <DialogTitle>Select Product to Compare</DialogTitle>
            <ScrollArea className="max-h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center p-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((product) => (
                    <Button
                      key={product.id}
                      variant="ghost"
                      className="w-full justify-start text-left hover:bg-gray-100"
                      onClick={() => addToCompare(product)}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          className="w-12 h-12 object-contain"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.name}</p>
                          <p className="text-xs text-muted-foreground">
                            ₹{product.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-sm text-muted-foreground">
                  No products found
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>

      {/* Selected Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {selectedProducts.map((product, index) => (
          <div key={product.id} className="bg-white rounded-lg p-4 border shadow-sm relative">
            {index > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeFromCompare(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <div className="aspect-square mb-4">
              <img
                src={product.image_url || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="font-medium text-sm line-clamp-2 mb-2">{product.name}</h3>
            <p className="text-sm text-primary">₹{product.price.toLocaleString()}</p>
          </div>
        ))}

        {selectedProducts.length < 3 && (
          <button
            className="bg-white rounded-lg border border-dashed p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-gray-50 transition-colors"
            onClick={() => setShowResults(true)}
          >
            <Plus className="h-8 w-8 text-gray-400" />
            <p className="text-sm text-gray-600">Add product to compare</p>
          </button>
        )}
      </div>

      {selectedProducts.length > 0 && (
        <>
          <ComparisonTable
            selectedProducts={selectedProducts}
            currentProduct={currentProduct}
            type={type}
            onRemove={removeFromCompare}
          />
          <div className="flex justify-end">
            <Button
              onClick={handleCompare}
              className="bg-teal-600 hover:bg-teal-700 w-full md:w-auto"
              disabled={selectedProducts.length < 2}
            >
              Compare Products
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
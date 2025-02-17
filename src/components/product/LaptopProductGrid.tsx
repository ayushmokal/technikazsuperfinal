import { Link } from "react-router-dom";
import { LaptopProduct } from "@/types/product";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, LayoutGrid, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useInView } from "react-intersection-observer";

interface LaptopProductGridProps {
  products: LaptopProduct[];
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export function LaptopProductGrid({ 
  products: initialProducts,
  onLoadMore,
  hasMore,
  isLoading
}: LaptopProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // Get unique brands from products
  const { data: brands = [] } = useQuery({
    queryKey: ['laptop-brands'],
    queryFn: async () => {
      const { data } = await supabase
        .from('laptops')
        .select('brand')
        .not('brand', 'is', null)
        .order('brand');
      
      const uniqueBrands = [...new Set(data?.map(item => item.brand))];
      return uniqueBrands;
    }
  });

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore();
    }
  }, [inView, hasMore, isLoading, onLoadMore]);

  // Filter and sort products
  const filteredProducts = initialProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBrand = selectedBrand === "all" || product.brand === selectedBrand;
      return matchesSearch && matchesBrand;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  return (
    <section className="mb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Latest Laptops</h2>
        <div className="flex gap-4">
          <button 
            className={`p-2 border rounded ${viewMode === "list" ? "bg-primary text-white" : ""}`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-5 w-5" />
          </button>
          <button 
            className={`p-2 border rounded ${viewMode === "grid" ? "bg-primary text-white" : ""}`}
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search laptops..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 flex-col sm:flex-row w-full sm:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price-low-high">Price: Low to High</SelectItem>
              <SelectItem value="price-high-low">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Brands</SelectItem>
              {brands.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Products Grid/List */}
      <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg p-4 hover:shadow-lg transition-shadow">
            <Link to={`/product/${product.id}?type=laptop`} className={viewMode === "grid" ? "flex flex-col" : "flex gap-6"}>
              <div className={`${
                viewMode === "grid" 
                  ? "w-full aspect-square mb-4" 
                  : "w-32 h-32 sm:w-48 sm:h-48 flex-shrink-0"
              }`}>
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-lg sm:text-xl font-medium text-primary mb-2 line-clamp-2">
                    {product.name} – Full Laptop Specification
                  </h3>
                  <div className="text-xl sm:text-2xl font-bold whitespace-nowrap">
                    ₹{product.price.toLocaleString()}
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px] text-left">Display:</span>
                    <span className="line-clamp-1">{product.display_specs}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px] text-left">Processor:</span>
                    <span className="line-clamp-1">{product.processor}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px] text-left">Graphics:</span>
                    <span className="line-clamp-1">{product.graphics}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium min-w-[100px] text-left">Memory:</span>
                    <span>{product.ram} | {product.storage}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-primary hover:underline">
                    View Details →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Infinite scroll trigger */}
      {(hasMore || isLoading) && (
        <div ref={ref} className="py-4 text-center">
          {isLoading && <p>Loading more products...</p>}
        </div>
      )}
    </section>
  );
}
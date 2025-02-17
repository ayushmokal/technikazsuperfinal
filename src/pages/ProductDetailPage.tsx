import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductContent } from "@/components/product/ProductContent";
import { useToast } from "@/hooks/use-toast";
import { LaptopProduct, MobileProduct } from "@/types/product";

export type ProductType = 'mobile' | 'laptop';

export default function ProductDetailPage() {
  const [activeSection, setActiveSection] = useState('overview');
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') as ProductType || 'mobile';
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id, type],
    queryFn: async () => {
      if (!id) {
        throw new Error('Product ID is required');
      }

      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
        throw error;
      }

      if (!data) {
        toast({
          variant: "destructive",
          title: "Not Found",
          description: "Product not found",
        });
        navigate('/gadgets');
        return null;
      }

      return data as LaptopProduct | MobileProduct;
    },
    enabled: !!id,
  });

  if (isLoading || !product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1">
          <div className="container mx-auto py-8">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 relative">
        <div className="container mx-auto py-4 sm:py-8 px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Section - Fixed Gallery */}
            <div className="w-full lg:w-[25%]">
              <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
                <ProductGallery 
                  mainImage={product.image_url} 
                  productName={product.name}
                  galleryImages={product.gallery_images}
                  activeSection={activeSection}
                  onSectionChange={setActiveSection}
                />
              </div>
            </div>
            
            {/* Right Section - Scrollable Content */}
            <div className="w-full lg:w-[75%]" id="product-content">
              <ProductContent
                product={product}
                type={type}
                activeSection={activeSection}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
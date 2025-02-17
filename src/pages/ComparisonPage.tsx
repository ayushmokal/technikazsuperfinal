import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { MobileProduct, LaptopProduct } from "@/types/product";
import { ComparisonTable } from "@/components/product/ComparisonTable";
import { PopularMobiles } from "@/components/product/PopularMobiles";
import { Separator } from "@/components/ui/separator";

export default function ComparisonPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialProduct = location.state?.product as MobileProduct | LaptopProduct;
  const type = location.state?.type as 'mobile' | 'laptop';

  const [products, setProducts] = useState<(MobileProduct | LaptopProduct)[]>(
    initialProduct ? [initialProduct] : []
  );

  if (!initialProduct || !type) {
    navigate('/gadgets');
    return null;
  }

  const handleAddProduct = (product: MobileProduct | LaptopProduct) => {
    if (products.length < 3) {
      setProducts([...products, product]);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <div className="container mx-auto py-4 sm:py-8 px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <Button
              variant="ghost"
              className="w-fit gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-xl sm:text-2xl font-bold">Compare Products</h1>
          </div>

          {/* Comparison Table */}
          <div className="bg-white rounded-lg border overflow-hidden">
            <ComparisonTable
              selectedProducts={products}
              currentProduct={products[0]}
              type={type}
              onRemove={handleRemoveProduct}
              onAddProduct={handleAddProduct}
            />
          </div>

          {/* Back Button */}
          <div className="mt-8 mb-8">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Product
            </Button>
          </div>

          {/* Popular Mobiles Section */}
          {type === 'mobile' && (
            <>
              <Separator className="my-8 sm:my-12" />
              <PopularMobiles />
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  popular?: boolean;
  display_specs?: string;
  camera?: string;
  battery?: string;
  graphics?: string;
}

export default function PopularProductsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'mobile' | 'laptop'>('mobile');

  const { data: products = [], refetch } = useQuery({
    queryKey: ['products', activeTab],
    queryFn: async () => {
      const tableName = activeTab === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Product[];
    },
  });

  const handleTogglePopular = async (product: Product) => {
    try {
      const tableName = activeTab === 'laptop' ? 'laptops' : 'mobile_products';
      
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to update products');
      }

      const { error } = await supabase
        .from(tableName)
        .update({ popular: !product.popular })
        .eq('id', product.id);

      if (error) throw error;

      await supabase.from('admin_logs').insert({
        user_email: session.user.email,
        action_type: 'update',
        entity_type: 'product',
        entity_id: product.id,
        entity_name: product.name,
        details: `${product.popular ? 'Removed from' : 'Marked as'} popular: ${product.name}`
      });

      toast({
        title: "Success",
        description: `Product ${product.popular ? 'removed from' : 'marked as'} popular`,
      });
      
      refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Popular Products Management</h1>
          <Link to="/admin">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'mobile' | 'laptop')}>
          <TabsList>
            <TabsTrigger value="mobile">Mobile Phones</TabsTrigger>
            <TabsTrigger value="laptop">Laptops</TabsTrigger>
          </TabsList>

          <TabsContent value="mobile" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="relative">
                    <AspectRatio ratio={1}>
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </AspectRatio>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePopular(product)}
                      className={`absolute top-2 right-2 h-8 w-8 transition-colors ${
                        product.popular ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <Star className={`h-5 w-5 transition-all ${product.popular ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="font-semibold text-primary">₹{product.price.toLocaleString()}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="line-clamp-1">Display: {product.display_specs}</p>
                      {'camera' in product && <p className="line-clamp-1">Camera: {product.camera}</p>}
                      <p className="line-clamp-1">Battery: {product.battery}</p>
                      {'graphics' in product && <p className="line-clamp-1">Graphics: {product.graphics}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="laptop" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-sm border p-4">
                  <div className="relative">
                    <AspectRatio ratio={1}>
                      <img
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </AspectRatio>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleTogglePopular(product)}
                      className={`absolute top-2 right-2 h-8 w-8 transition-colors ${
                        product.popular ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'
                      }`}
                    >
                      <Star className={`h-5 w-5 transition-all ${product.popular ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    <p className="text-sm text-gray-500">{product.brand}</p>
                    <p className="font-semibold text-primary">₹{product.price.toLocaleString()}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="line-clamp-1">Display: {product.display_specs}</p>
                      <p className="line-clamp-1">Battery: {product.battery}</p>
                      {'graphics' in product && <p className="line-clamp-1">Graphics: {product.graphics}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
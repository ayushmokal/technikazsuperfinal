import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface AffiliateLink {
  id: string;
  product_id: string;
  affiliate_link: string;
  created_at: string;
}

export function AmazonAdManager() {
  const [affiliateLink, setAffiliateLink] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if affiliate_links table exists
  const { data: tableExists = false, isLoading: isCheckingTable } = useQuery({
    queryKey: ['affiliate-links-table-exists'],
    queryFn: async () => {
      try {
        const { count, error } = await supabase
          .from('affiliate_links')
          .select('*', { count: 'exact', head: true });
        
        return error ? false : true;
      } catch (error) {
        return false;
      }
    }
  });

  // Query for all products
  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const [mobileResponse, laptopResponse] = await Promise.all([
        supabase.from('mobile_products').select('id, name, price, image_url'),
        supabase.from('laptops').select('id, name, price, image_url')
      ]);

      if (mobileResponse.error) throw mobileResponse.error;
      if (laptopResponse.error) throw laptopResponse.error;

      return [...(mobileResponse.data || []), ...(laptopResponse.data || [])];
    }
  });

  // Query for existing affiliate links
  const { data: affiliateLinks = [], isLoading: isLoadingLinks } = useQuery({
    queryKey: ['affiliate-links'],
    queryFn: async () => {
      if (!tableExists) return [];
      
      const { data, error } = await supabase
        .from('affiliate_links')
        .select('*');

      if (error) {
        console.error('Error fetching affiliate links:', error);
        return [];
      }
      return data || [];
    },
    enabled: tableExists
  });

  // Mutation to add/update affiliate link
  const linkMutation = useMutation({
    mutationFn: async ({ productId, link }: { productId: string; link: string }) => {
      if (!tableExists) {
        throw new Error("Affiliate links table not found. Please run database migrations first.");
      }

      // First try to get existing link
      const { data: existingLinks } = await supabase
        .from('affiliate_links')
        .select('*')
        .eq('product_id', productId);

      const existing = existingLinks && existingLinks[0];

      if (existing) {
        const { error } = await supabase
          .from('affiliate_links')
          .update({ affiliate_link: link })
          .eq('product_id', productId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('affiliate_links')
          .insert({ product_id: productId, affiliate_link: link });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-links'] });
      toast({
        title: "Success",
        description: "Affiliate link saved successfully",
      });
      setAffiliateLink("");
      setSelectedProductId(null);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save affiliate link",
      });
    }
  });

  // Mutation to delete affiliate link
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      if (!tableExists) {
        throw new Error("Affiliate links table not found. Please run database migrations first.");
      }

      const { error } = await supabase
        .from('affiliate_links')
        .delete()
        .eq('product_id', productId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-links'] });
      toast({
        title: "Success",
        description: "Affiliate link removed successfully",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove affiliate link",
      });
    }
  });

  const handleSubmit = (productId: string, link: string) => {
    if (!link.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter an affiliate link",
      });
      return;
    }

    linkMutation.mutate({ productId, link });
  };

  if (isCheckingTable || isLoadingProducts || isLoadingLinks) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!tableExists) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          The affiliate links table has not been created yet. Please run the database migrations first.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => {
          const existingLink = affiliateLinks.find(link => link.product_id === product.id);
          
          return (
            <Card key={product.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="aspect-square mb-4">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <h4 className="font-medium text-sm line-clamp-2 mb-2">
                  {product.name}
                </h4>
                <p className="text-sm font-semibold mb-4">
                  ₹{product.price.toLocaleString()}
                </p>
                
                {selectedProductId === product.id ? (
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter affiliate link..."
                      value={affiliateLink}
                      onChange={(e) => setAffiliateLink(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => handleSubmit(product.id, affiliateLink)}
                        className="flex-1"
                        disabled={linkMutation.isPending}
                      >
                        {linkMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setSelectedProductId(null);
                          setAffiliateLink("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {existingLink ? (
                      <>
                        <p className="text-xs text-gray-500 break-all">
                          {existingLink.affiliate_link}
                        </p>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              setSelectedProductId(product.id);
                              setAffiliateLink(existingLink.affiliate_link);
                            }}
                          >
                            Edit Link
                          </Button>
                          <Button 
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(product.id)}
                            disabled={deleteMutation.isPending}
                          >
                            Remove
                          </Button>
                        </div>
                      </>
                    ) : (
                      <Button 
                        className="w-full"
                        onClick={() => setSelectedProductId(product.id)}
                      >
                        Add Affiliate Link
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
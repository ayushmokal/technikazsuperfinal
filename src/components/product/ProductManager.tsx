import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ProductTable } from "./ProductTable";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExpertReviewForm } from "../admin/expert-review/ExpertReviewForm";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  popular?: boolean;
}

interface ProductManagerProps {
  productType: 'mobile' | 'laptop';
}

export function ProductManager({ productType }: ProductManagerProps) {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showExpertReview, setShowExpertReview] = useState(false);
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const [selectedProductForReview, setSelectedProductForReview] = useState<Product | null>(null);
  const [selectedProductForImages, setSelectedProductForImages] = useState<Product | null>(null);

  const { data: products = [], refetch } = useQuery({
    queryKey: ['products', productType],
    queryFn: async () => {
      const tableName = productType === 'laptop' ? 'laptops' : 'mobile_products';
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  });

  const handleView = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddReview = (product: Product) => {
    setSelectedProductForReview(product);
    setShowExpertReview(true);
    setShowDetailedReview(false);
  };

  const handleAddDetailedReview = (product: Product) => {
    setSelectedProductForReview(product);
    setShowDetailedReview(true);
    setShowExpertReview(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const tableName = productType === 'laptop' ? 'laptops' : 'mobile_products';
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product deleted successfully",
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

  const handleTogglePopular = async (product: Product) => {
    try {
      const tableName = productType === 'laptop' ? 'laptops' : 'mobile_products';
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to update products');
      }

      const { error } = await supabase
        .from(tableName)
        .update({ popular: !product.popular })
        .eq('id', product.id);

      if (error) throw error;

      // Log the action
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
    <div className="space-y-6">
      <ProductTable
        products={products}
        onView={handleView}
        onAddReview={handleAddReview}
        onAddDetailedReview={handleAddDetailedReview}
        onDelete={handleDelete}
        onTogglePopular={handleTogglePopular}
      />

      {selectedProduct && (
        <ProductDetailsDialog
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <Dialog 
        open={showExpertReview} 
        onOpenChange={(open) => {
          if (!open) {
            setShowExpertReview(false);
            setSelectedProductForReview(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Expert Review</DialogTitle>
          </DialogHeader>
          {selectedProductForReview && (
            <ExpertReviewForm
              productId={selectedProductForReview.id}
              onSuccess={() => {
                setShowExpertReview(false);
                setSelectedProductForReview(null);
                toast({
                  title: "Success",
                  description: "Expert review added successfully",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog 
        open={showDetailedReview} 
        onOpenChange={(open) => {
          if (!open) {
            setShowDetailedReview(false);
            setSelectedProductForReview(null);
          }
        }}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Detailed Review</DialogTitle>
          </DialogHeader>
          {selectedProductForReview && (
            <div className="space-y-4">
              <div className="min-h-[500px] border rounded-md">
                <CKEditor
                  editor={ClassicEditor}
                  data=""
                  config={{
                    toolbar: {
                      items: [
                        'heading',
                        '|',
                        'bold',
                        'italic',
                        'link',
                        'bulletedList',
                        'numberedList',
                        '|',
                        'outdent',
                        'indent',
                        '|',
                        'imageUpload',
                        'blockQuote',
                        'insertTable',
                        'mediaEmbed',
                        'undo',
                        'redo'
                      ]
                    }
                  }}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setShowDetailedReview(false)}>
                  Save Detailed Review
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
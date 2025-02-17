import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

interface ProductReview {
  id: string;
  product_id: string;
  user_name: string;
  rating: number;
  review_text: string;
  created_at: string;
}

export default function ProductReviewsPage() {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const { data: reviews } = useQuery({
    queryKey: ["product-reviews", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select("*")
        .eq("product_id", id)
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load reviews",
        });
        throw error;
      }

      return data as ProductReview[];
    },
  });

  const { data: product } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mobile_products")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product details",
        });
        throw error;
      }

      return data;
    },
  });

  const pros = [
    "Premium build quality",
    "Excellent performance",
    "Great camera system",
    "Fast charging",
    "Beautiful display"
  ];

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">{product?.name} Reviews</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Product Summary</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key Features</TableHead>
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pros.map((pro, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">Feature {index + 1}</TableCell>
                  <TableCell>{pro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">User Reviews</h2>
          {reviews?.map((review) => (
            <div key={review.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">{review.user_name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="bg-primary/10 px-2 py-1 rounded">
                  <span className="font-semibold">{review.rating}/5</span>
                </div>
              </div>
              <p className="text-gray-700">{review.review_text}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
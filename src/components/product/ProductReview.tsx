import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ProductReviewProps {
  productId: string;
}

interface ExpertReview {
  id: string;
  product_id: string;
  rating: number;
  date: string;
  author: string;
  detailed_review?: string;
  summary: string;
  pros: string[];
  cons: string[];
  verdict: string;
}

export function ProductReview({ productId }: ProductReviewProps) {
  const [showDetailedReview, setShowDetailedReview] = useState(false);
  const { data: reviews, isLoading } = useQuery({
    queryKey: ['expert-review', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expert_reviews')
        .select(`
          id,
          product_id,
          rating,
          author,
          summary,
          detailed_review,
          pros,
          cons,
          verdict,
          created_at
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching expert reviews:', error);
        return [];
      }

      if (!data?.length) {
        return [];
      }

      // Ensure pros and cons are arrays
      return data.map(review => ({
        ...review,
        pros: Array.isArray(review.pros) ? review.pros : [],
        cons: Array.isArray(review.cons) ? review.cons : []
      })) as ExpertReview[];
    },
    retry: 2,
    staleTime: 60000,
    refetchOnMount: true
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!reviews?.length) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600 text-center">
          No expert review available for this product yet.
          {process.env.NODE_ENV === 'development' && (
            <span className="block text-sm text-gray-400 mt-2">
              Product ID: {productId}
            </span>
          )}
        </p>
      </div>
    );
  }

  // Display the most recent review
  const latestReview = reviews[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <span className="text-sm text-gray-500">by {latestReview.author}</span>
        <div className="flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-lg">
          <span className="text-3xl font-bold text-primary">{latestReview.rating}</span>
          <span className="text-gray-500">/10</span>
        </div>
      </div>
      <p className="text-gray-700 text-left">{latestReview.summary}</p>

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h4 className="font-semibold text-green-600 mb-4 text-left">PROS</h4>
          <ul className="space-y-2">
            {latestReview.pros.map((pro, index) => (
              <li key={index} className="flex items-center gap-2 text-left">
                <span className="text-green-600">+</span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-red-600 mb-4 text-left">CONS</h4>
          <ul className="space-y-2">
            {latestReview.cons.map((con, index) => (
              <li key={index} className="flex items-center gap-2 text-left">
                <span className="text-red-600">-</span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2 text-left">VERDICT</h4>
        <p className="text-gray-700 text-left">{latestReview.verdict}</p>
        {latestReview.detailed_review && (
          <>
            <Button
              variant="link"
              onClick={() => setShowDetailedReview(!showDetailedReview)}
              className="mt-4 p-0 h-auto font-normal hover:no-underline text-primary"
            >
              View Detailed Review →
            </Button>
            {showDetailedReview && (
              <div className="mt-6 border-t pt-6">
                <h4 className="font-semibold mb-4 text-left">Detailed Review</h4>
                <div 
                  className="prose max-w-none text-left"
                  dangerouslySetInnerHTML={{ __html: latestReview.detailed_review }}
                />
              </div>
            )}
          </>
        )}
      </div>

      {reviews.length > 1 && (
        <div className="border-t pt-4">
          <p className="text-sm text-gray-500 text-left">
            {reviews.length - 1} more expert {reviews.length - 1 === 1 ? 'review' : 'reviews'} available
          </p>
        </div>
      )}
    </div>
  );
}
import { useState } from "react";
import { Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface ProductRatingSystemProps {
  productId: string;
  productType?: 'mobile' | 'laptop';
}

interface RatingStats {
  average_rating: number;
  total_ratings: number;
  rating_distribution: number[];
}

const defaultStats: RatingStats = {
  average_rating: 0,
  total_ratings: 0,
  rating_distribution: [0, 0, 0, 0, 0]
};

export function ProductRatingSystem({ productId, productType = 'mobile' }: ProductRatingSystemProps) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [review, setReview] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: ratingStats = defaultStats, isLoading } = useQuery<RatingStats>({
    queryKey: ['product-rating-stats', productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc('calculate_product_rating', { p_id: productId });

      if (error) {
        console.error('Error fetching rating stats:', error);
        return defaultStats;
      }

      const result = data?.[0];
      if (!result) return defaultStats;

      // Ensure rating_distribution is a valid array of numbers
      const distribution = Array.isArray(result.rating_distribution) 
        ? result.rating_distribution.map(n => Number(n))
        : [0, 0, 0, 0, 0];

      return {
        average_rating: Number(result.average_rating) || 0,
        total_ratings: Number(result.total_ratings) || 0,
        rating_distribution: distribution
      };
    }
  });

  const handleRatingSubmit = async () => {
    if (!selectedRating) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // First submit the rating
      const { error: ratingError } = await supabase
        .from('product_ratings')
        .insert({
          product_id: productId,
          rating: selectedRating,
        });

      if (ratingError) throw ratingError;

      // If there's a review text or name, submit the review
      if (review.trim() || name.trim()) {
        const { error: reviewError } = await supabase
          .from('product_reviews')
          .insert({
            product_id: productId,
            rating: selectedRating,
            review_text: review,
            user_name: name,
            user_email: email || null
          });

        if (reviewError) throw reviewError;
      }

      // Invalidate queries to trigger refetch
      await queryClient.invalidateQueries({ queryKey: ['product-rating-stats', productId] });
      await queryClient.invalidateQueries({ queryKey: ['product-reviews', productId] });

      toast({
        title: "Success",
        description: "Thank you for your rating and review!",
      });

      // Reset form
      setSelectedRating(0);
      setReview("");
      setName("");
      setEmail("");
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to submit rating",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Rating Statistics */}
      <div className="bg-[#F4FCFB] p-8 rounded-lg">
        <div className="text-center">
          <div className="text-5xl font-bold text-[#00897B] mb-4">
            {ratingStats.average_rating.toFixed(1)}
          </div>
          <div className="flex justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${
                  star <= ratingStats.average_rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">
            Based on {ratingStats.total_ratings} {ratingStats.total_ratings === 1 ? 'rating' : 'ratings'}
          </div>
        </div>

        <div className="mt-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars, index) => {
            const count = Number(ratingStats.rating_distribution[5 - stars]) || 0;
            const percentage = ratingStats.total_ratings > 0 
              ? (count / ratingStats.total_ratings) * 100 
              : 0;
            
            return (
              <div key={stars} className="flex items-center gap-4">
                <span className="w-16 text-sm text-gray-600">{stars} stars</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#00897B] rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-sm text-gray-600 text-right">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Form */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold">Rate this product</h3>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              className="transition-all duration-200"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setSelectedRating(star)}
            >
              <Star
                className={`w-8 h-8 ${
                  star <= (hoveredRating || selectedRating)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <Input
            placeholder="Your Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Your Email (optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Textarea
            placeholder="Write your review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="min-h-[120px]"
          />
        </div>

        <Button
          onClick={handleRatingSubmit}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-[#00897B] hover:bg-[#00897B]/90"
        >
          {isSubmitting ? "Submitting..." : "Submit Rating & Review"}
        </Button>
      </div>
    </div>
  );
}
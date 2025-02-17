import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface AmazonProductAdProps {
  placement: string;
  className?: string;
}

export function AmazonProductAd({ placement, className }: AmazonProductAdProps) {
  const { data: ad } = useQuery({
    queryKey: ['amazon-ad', placement],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('amazon_ads')
        .select('*')
        .eq('placement', placement)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    }
  });

  if (!ad) {
    return null;
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <a 
          href={`https://www.amazon.in/dp/${ad.asin}?tag=${import.meta.env.VITE_AMAZON_PARTNER_TAG}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block group"
        >
          <div className="relative aspect-square mb-4">
            <img
              src={ad.image_url}
              alt={ad.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
            />
          </div>
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {ad.title}
          </h3>
          <p className="text-sm font-semibold mt-2">{ad.price}</p>
          <p className="text-xs text-gray-500 mt-1">Sponsored</p>
        </a>
      </CardContent>
    </Card>
  );
}
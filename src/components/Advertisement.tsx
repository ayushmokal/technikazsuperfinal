import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { LoadingSpinner } from "./ui/loading-spinner";
import { AspectRatio } from "./ui/aspect-ratio";

interface AdvertisementProps {
  className?: string;
  placement?: string;
}

export function Advertisement({ className, placement = "sidebar" }: AdvertisementProps) {
  const { data: ad, isLoading } = useQuery({
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

  if (isLoading) {
    return (
      <div className={cn(
        "w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 p-4",
        className
      )}>
        <div className="flex items-center justify-center h-32">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (!ad) {
    return (
      <div className={cn(
        "w-full bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200",
        className
      )}>
        <div className="aspect-[21/3] flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200">
          <span className="text-gray-500 text-sm">Advertisement</span>
        </div>
      </div>
    );
  }

  const productUrl = `https://www.amazon.in/dp/${ad.asin}?tag=${import.meta.env.VITE_AMAZON_PARTNER_TAG}`;

  return (
    <div className={cn(
      "w-full bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200",
      className
    )}>
      <a 
        href={productUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="block group"
      >
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="w-32 h-32 flex-shrink-0">
              <AspectRatio ratio={1}>
                <img
                  src={ad.image_url}
                  alt={ad.title}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-200"
                />
              </AspectRatio>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium line-clamp-2 group-hover:text-primary transition-colors">
                {ad.title}
              </h3>
              <p className="text-xl font-bold mt-2">{ad.price}</p>
              <div className="flex items-center gap-2 mt-2">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg"
                  alt="Amazon"
                  className="w-5 h-5"
                />
                <span className="text-sm text-gray-500">Sponsored</span>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}
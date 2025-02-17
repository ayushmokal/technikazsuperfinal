import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function PopularMobiles() {
  const { toast } = useToast();

  const { data: popularMobiles = [], error, isLoading } = useQuery({
    queryKey: ['popular-mobiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('mobile_products')
        .select('*')
        .eq('popular', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching mobiles:', error);
        throw error;
      }
      
      return data || [];
    },
    meta: {
      onError: () => {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load mobile products. Please try again.",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Failed to load mobile products. Please try again later.</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Popular Mobile Phones</h2>
        <Link 
          to="/gadgets" 
          className="text-sm text-gray-600 hover:text-primary"
        >
          • See All
        </Link>
      </div>

      <div className="relative px-12">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {popularMobiles.map((mobile) => (
              <CarouselItem
                key={mobile.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4"
              >
                <Link 
                  to={`/product/${mobile.id}?type=mobile`}
                  className="block group"
                >
                  <div className="bg-white rounded-lg p-6 hover:shadow-lg transition-shadow border border-gray-200 h-full">
                    <div className="aspect-square mb-6">
                      <img
                        src={mobile.image_url || "/placeholder.svg"}
                        alt={mobile.name}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary/90 transition-colors line-clamp-2">
                        {mobile.name}
                      </h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-primary">₹{mobile.price.toLocaleString()}</span>
                      </div>
                      <div className="space-y-1.5 text-sm text-gray-600">
                        <p className="line-clamp-1">
                          Display: {mobile.display_specs}
                        </p>
                        <p className="line-clamp-1">
                          Camera: {mobile.camera}
                        </p>
                        <p className="line-clamp-1">
                          Battery: {mobile.battery}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious
            className="absolute -left-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white opacity-70 hover:opacity-100 transition-opacity"
          />
          <CarouselNext 
            className="absolute -right-6 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white opacity-70 hover:opacity-100 transition-opacity"
          />
        </Carousel>
      </div>
    </section>
  );
}
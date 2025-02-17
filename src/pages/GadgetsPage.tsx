import { useState } from "react";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CategoryHeader } from "@/components/CategoryHeader";
import { MobileProductList } from "@/components/product/MobileProductList";
import { LaptopProductGrid } from "@/components/product/LaptopProductGrid";
import { BlogSidebar } from "@/components/BlogSidebar";
import type { MobileProduct, LaptopProduct } from "@/types/product";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { categories } from "@/types/blog";

const ITEMS_PER_PAGE = 8;

export default function GadgetsPage() {
  const [subcategory, setSubcategory] = useState<"MOBILE" | "LAPTOPS">("MOBILE");
  const [activeTab, setActiveTab] = useState("popular");
  const [sortBy, setSortBy] = useState("default");
  const [showPopularOnly, setShowPopularOnly] = useState(false);
  const [popularFilter, setPopularFilter] = useState<"all" | "popular">("all");

  // Query for gadget blogs
  const { data: gadgetBlogs = [], isLoading: isLoadingBlogs } = useQuery({
    queryKey: ['gadget-blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GADGETS')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (error) throw error;
      return data || [];
    }
  });

  // Query for category-specific featured articles
  const { data: featuredArticles } = useInfiniteQuery({
    queryKey: ['gadgets-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GADGETS')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: () => null, // No pagination for featured articles
  });

  // Query for all gadgets articles
  const { data: articles } = useInfiniteQuery({
    queryKey: ['gadgets-articles', subcategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GADGETS')
        .contains('subcategories', [subcategory])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    initialPageParam: 0,
    getNextPageParam: () => null, // No pagination for articles
  });

  // Infinite query for mobile products
  const {
    data: mobileData,
    fetchNextPage: fetchNextMobile,
    hasNextPage: hasNextMobile,
    isFetchingNextPage: isFetchingNextMobile
  } = useInfiniteQuery({
    queryKey: ['infinite-mobiles'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('mobile_products')
        .select('*', { count: 'exact' });

      if (popularFilter === "popular") {
        query = query.eq('popular', true);
      }

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      
      return {
        data: data || [],
        nextPage: data && data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  // Infinite query for laptops
  const {
    data: laptopData,
    fetchNextPage: fetchNextLaptop,
    hasNextPage: hasNextLaptop,
    isFetchingNextPage: isFetchingNextLaptop
  } = useInfiniteQuery({
    queryKey: ['infinite-laptops'],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      
      let query = supabase
        .from('laptops')
        .select('*', { count: 'exact' });

      if (showPopularOnly) {
        query = query.eq('popular', true);
      }

      let orderBy = 'created_at';
      let ascending = false;

      switch (sortBy) {
        case 'price-low-high':
          orderBy = 'price';
          ascending = true;
          break;
        case 'price-high-low':
          orderBy = 'price';
          ascending = false;
          break;
      }

      query = query.order(orderBy, { ascending }).range(from, to);

      const { data, error, count } = await query;
      
      if (error) throw error;
      
      return {
        data: data || [],
        nextPage: data && data.length === ITEMS_PER_PAGE ? pageParam + 1 : undefined,
        totalCount: count
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });

  // Flatten the pages data
  const mobileProducts = mobileData?.pages.flatMap(page => page.data) || [];
  const laptops = laptopData?.pages.flatMap(page => page.data) || [];

  const ProductGrids = () => (
    <div className="lg:col-span-8 space-y-8">
      {subcategory === "MOBILE" && (
        <MobileProductList 
          products={mobileProducts}
          onLoadMore={fetchNextMobile}
          hasMore={hasNextMobile}
          isLoading={isFetchingNextMobile}
        />
      )}
      {subcategory === "LAPTOPS" && (
        <LaptopProductGrid 
          products={laptops}
          onLoadMore={fetchNextLaptop}
          hasMore={hasNextLaptop}
          isLoading={isFetchingNextLaptop}
        />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <CategoryHeader
        title="Gadgets"
        subcategories={categories.GADGETS}
        selectedSubcategory={subcategory}
        onSubcategoryChange={(sub) => setSubcategory(sub as typeof subcategory)}
      />

      <main className="container mx-auto px-4 py-4 sm:py-8 space-y-6 sm:space-y-8">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {isLoadingBlogs ? (
            <div className="lg:col-span-8 bg-white rounded-lg flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : gadgetBlogs[0] && (
            <div className="lg:col-span-8 bg-white rounded-lg overflow-hidden group">
              <Link to={`/article/${gadgetBlogs[0].slug}`} className="block">
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img
                      src={gadgetBlogs[0].image_url}
                      alt={gadgetBlogs[0].title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-primary/90 transition-colors">
                          {gadgetBlogs[0].title}
                        </h2>
                        <p className="text-gray-300 mt-2 line-clamp-2 text-sm sm:text-base">
                          {gadgetBlogs[0].meta_description}
                        </p>
                      </div>
                    </div>
                  </AspectRatio>
                </div>
              </Link>
            </div>
          )}

          {/* Side Articles */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-6">
            {gadgetBlogs.slice(1, 3).map((article) => (
              <div key={article.slug} className="bg-white rounded-lg overflow-hidden group">
                <Link to={`/article/${article.slug}`} className="block">
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                          <h3 className="text-base sm:text-lg font-medium text-white group-hover:text-primary/90 transition-colors">
                            {article.title}
                          </h3>
                        </div>
                      </div>
                    </AspectRatio>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {isLoadingBlogs ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            <ProductGrids />
            <div className="lg:col-span-4 sticky top-4">
              <BlogSidebar />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
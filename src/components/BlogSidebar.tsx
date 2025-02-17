import { useState } from "react";
import { Button } from "./ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const ITEMS_PER_PAGE = 5;

interface BlogItem {
  id: string;
  title: string;
  image_url: string;
  created_at: string;
  slug: string;
}

export function BlogSidebar() {
  const [selectedCategory, setSelectedCategory] = useState("TECH");

  const { 
    data, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['sidebar-items', selectedCategory],
    queryFn: async ({ pageParam = 0 }) => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', selectedCategory)
        .order('created_at', { ascending: false })
        .range(pageParam * ITEMS_PER_PAGE, (pageParam + 1) * ITEMS_PER_PAGE - 1);
      
      if (error) {
        console.error('Error fetching sidebar items:', error);
        throw error;
      }
      
      return data || [];
    },
    getNextPageParam: (lastPage: BlogItem[], allPages: BlogItem[][]) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length : undefined;
    },
    initialPageParam: 0,
  });

  const mainCategories = ["TECH", "GAMES", "ENTERTAINMENT", "STOCKS"];

  const renderBlogItem = (item: BlogItem) => (
    <Link 
      to={`/article/${item.slug}`}
      key={item.id} 
      className="flex gap-3 group hover:bg-gray-50 p-2 rounded-lg"
    >
      <div className="w-[80px] h-[60px] sm:w-[100px] sm:h-[75px] flex-shrink-0 overflow-hidden rounded">
        <AspectRatio ratio={4/3}>
          <img
            src={item.image_url || "/placeholder.svg"}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </AspectRatio>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(item.created_at).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>
    </Link>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <aside className="lg:sticky lg:top-[calc(4rem_+_48px)] space-y-6">
      <div className="rounded-lg border bg-white shadow-sm">
        {/* Header */}
        <div className="bg-[#00897B] text-white p-3">
          <h2 className="text-lg font-bold">Upcomings</h2>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap border-b">
          {mainCategories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className={`flex-1 rounded-none border-b-2 text-xs sm:text-sm h-9 ${
                selectedCategory === category 
                ? "border-[#00897B] text-[#00897B]" 
                : "border-transparent"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category.split(' ').map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(' ')}
            </Button>
          ))}
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-100">
          {data?.pages.map((page, pageIndex) => (
            <div key={pageIndex}>
              {page.map((item) => renderBlogItem(item))}
            </div>
          ))}

          {/* Load More Button */}
          {hasNextPage && (
            <div className="p-3 text-center">
              <Button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isFetchingNextPage ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {data?.pages[0]?.length === 0 && (
            <div className="p-4 text-center text-gray-500 text-sm">
              No upcoming items found
            </div>
          )}
        </div>
      </div>

      {/* Advertisement */}
      <div className="rounded-lg bg-gray-100 p-4 shadow-sm">
        <div className="aspect-square flex items-center justify-center bg-gray-200 rounded-md">
          <span className="text-gray-500 text-sm">Advertisement</span>
        </div>
      </div>
    </aside>
  );
}
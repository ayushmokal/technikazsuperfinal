import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/types/blog";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CategoryHero } from "@/components/CategoryHero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleTabs } from "@/components/ArticleTabs";
import { BlogSidebar } from "@/components/BlogSidebar";
import { CategoryHeader } from "@/components/CategoryHeader";

export default function EntertainmentPage() {
  const [subcategory, setSubcategory] = useState<"ALL" | string>("ALL");
  const [activeTab, setActiveTab] = useState("popular");

  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['entertainment-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'ENTERTAINMENT')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['entertainment-articles', subcategory],
    queryFn: async () => {
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('category', 'ENTERTAINMENT')
        .order('created_at', { ascending: false });
      
      if (subcategory !== "ALL") {
        // Use contains operator for array column
        query = query.contains('subcategories', [subcategory]);
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    }
  });

  const mainFeaturedArticle = featuredArticles[0];
  const gridFeaturedArticles = featuredArticles.slice(1, 3);
  const popularArticles = articles || [];
  const recentArticles = articles.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <CategoryHeader
        title="Entertainment"
        subcategories={categories.ENTERTAINMENT}
        selectedSubcategory={subcategory}
        onSubcategoryChange={setSubcategory}
      />

      <main className="container mx-auto px-4 py-8">
        {subcategory === "ALL" && mainFeaturedArticle && (
          <CategoryHero 
            featuredArticle={mainFeaturedArticle} 
            gridArticles={gridFeaturedArticles} 
          />
        )}

        <ArticleGrid articles={articles.slice(0, 4)} />

        <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center my-8">
          <span className="text-gray-500">Advertisement</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <ArticleTabs
              popularArticles={popularArticles}
              recentArticles={recentArticles}
              onTabChange={setActiveTab}
              category="ENTERTAINMENT"
            />
          </div>

          <div className="lg:col-span-4">
            <BlogSidebar />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
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

type StocksSubcategory = "Market News" | "Analysis" | "IPO" | "Crypto";

export default function StocksPage() {
  const [subcategory, setSubcategory] = useState<StocksSubcategory>("Market News");
  const [activeTab, setActiveTab] = useState("popular");

  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['stocks-featured-articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'STOCKS')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const { data: articles = [] } = useQuery({
    queryKey: ['stocks-articles', subcategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'STOCKS')
        .contains('subcategories', [subcategory])
        .order('created_at', { ascending: false });
      
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
        title="Stocks"
        subcategories={categories.STOCKS}
        selectedSubcategory={subcategory}
        onSubcategoryChange={setSubcategory}
      />

      <main className="container mx-auto px-4 py-8">
        <CategoryHero 
          featuredArticle={mainFeaturedArticle} 
          gridArticles={gridFeaturedArticles} 
        />

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
              category="STOCKS"
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
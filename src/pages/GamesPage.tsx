import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryHero } from "@/components/CategoryHero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleTabs } from "@/components/ArticleTabs";
import { BlogSidebar } from "@/components/BlogSidebar";
import { categories } from "@/types/blog";
import { CategoryHeader } from "@/components/CategoryHeader";
import type { Subcategory } from "@/types/blog";

export default function GamesPage() {
  const [platform, setPlatform] = useState<Subcategory | "ALL">("ALL");
  const [activeTab, setActiveTab] = useState("popular");

  // Query for category-specific featured articles
  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['games-featured-articles'],
    queryFn: async () => {
      console.log('Fetching featured games articles');
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GAMES')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured games articles:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Query for all games articles
  const { data: articles = [] } = useQuery({
    queryKey: ['games-articles', platform],
    queryFn: async () => {
      console.log('Fetching games articles with platform:', platform);
      let query = supabase
        .from('blogs')
        .select('*')
        .eq('category', 'GAMES')
        .order('created_at', { ascending: false });
      
      if (platform !== "ALL") {
        // Use contains operator for array column
        query = query.contains('subcategories', [platform]);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching games articles:', error);
        throw error;
      }
      
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
        title="Games"
        subcategories={categories.GAMES}
        selectedSubcategory={platform}
        onSubcategoryChange={setPlatform}
      />

      <main className="container mx-auto px-4 py-8">
        {platform === "ALL" && mainFeaturedArticle && (
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
              category="GAMES"
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
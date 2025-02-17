import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { categories } from "@/types/blog";
import { CategoryHero } from "@/components/CategoryHero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleTabs } from "@/components/ArticleTabs";
import { BlogSidebar } from "@/components/BlogSidebar";
import { CategoryHeader } from "@/components/CategoryHeader";

type TechSubcategory = "Tech Deals" | "News";

export default function TechPage() {
  const [subcategory, setSubcategory] = useState<TechSubcategory>("Tech Deals");
  const [activeTab, setActiveTab] = useState("popular");

  // Query for category-specific featured articles
  const { data: featuredArticles = [] } = useQuery({
    queryKey: ['tech-featured-articles'],
    queryFn: async () => {
      console.log('Fetching featured tech articles');
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'TECH')
        .eq('featured_in_category', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching featured tech articles:', error);
        throw error;
      }
      
      return data || [];
    }
  });

  // Query for all tech articles
  const { data: articles = [] } = useQuery({
    queryKey: ['tech-articles', subcategory],
    queryFn: async () => {
      console.log('Fetching tech articles with subcategory:', subcategory);
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('category', 'TECH')
        .contains('subcategories', [subcategory])
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tech articles:', error);
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
        title="Tech"
        subcategories={categories.TECH}
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
              category="TECH"
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
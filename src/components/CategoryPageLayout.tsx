import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CategoryHero } from "@/components/CategoryHero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleTabs } from "@/components/ArticleTabs";
import { BlogSidebar } from "@/components/BlogSidebar";
import { BlogFormData } from "@/types/blog";
import { useState } from "react";

interface CategoryPageLayoutProps {
  title: string;
  category: string;
  articles: BlogFormData[];
  featuredArticles: BlogFormData[];
  subcategories: readonly string[];
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  children?: React.ReactNode;
}

export function CategoryPageLayout({
  title,
  category,
  articles,
  featuredArticles,
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  children
}: CategoryPageLayoutProps) {
  const [activeTab, setActiveTab] = useState("popular");

  const mainFeaturedArticle = featuredArticles[0];
  const gridFeaturedArticles = featuredArticles.slice(1, 3);
  const popularArticles = articles || [];
  const recentArticles = articles.slice(0, 6) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>

        <div className="flex justify-center gap-4 mb-8">
          {subcategories.map((sub) => (
            <Button
              key={sub}
              variant={selectedSubcategory === sub ? "default" : "outline"}
              onClick={() => onSubcategoryChange(sub)}
              className="min-w-[100px]"
            >
              {sub}
            </Button>
          ))}
        </div>

        {mainFeaturedArticle && (
          <CategoryHero 
            featuredArticle={mainFeaturedArticle} 
            gridArticles={gridFeaturedArticles} 
          />
        )}

        {children}

        {/* Only show ArticleGrid if not on Gadgets page */}
        {category !== "GADGETS" && <ArticleGrid articles={articles.slice(0, 4)} />}

        <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center my-8">
          <span className="text-gray-500">Advertisement</span>
        </div>

        {/* Only show ArticleTabs if not on Gadgets page */}
        {category !== "GADGETS" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <ArticleTabs
                popularArticles={popularArticles}
                recentArticles={recentArticles}
                onTabChange={setActiveTab}
                category={category}
              />
            </div>

            <div className="lg:col-span-4">
              <BlogSidebar />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
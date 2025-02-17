import { useState } from "react";
import { BlogFormData } from "@/types/blog";
import { CategoryHero } from "@/components/CategoryHero";
import { ArticleGrid } from "@/components/ArticleGrid";
import { ArticleTabs } from "@/components/ArticleTabs";
import { BlogSidebar } from "@/components/BlogSidebar";
import { Button } from "@/components/ui/button";

interface CategoryPageContentProps {
  title: string;
  articles: BlogFormData[];
  featuredArticles: BlogFormData[];
  subcategories: readonly string[];
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
  category: string;
}

export function CategoryPageContent({
  title,
  articles,
  featuredArticles,
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
  category
}: CategoryPageContentProps) {
  const [visibleArticles, setVisibleArticles] = useState(4);
  const [activeTab, setActiveTab] = useState("popular");

  const mainFeaturedArticle = featuredArticles[0];
  const gridFeaturedArticles = featuredArticles.slice(1, 3);
  const popularArticles = articles || [];
  const recentArticles = articles.slice(0, 6) || [];

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">{title}</h1>

      <div className="flex justify-center gap-4 mb-8">
        <Button
          variant={selectedSubcategory === "ALL" ? "default" : "outline"}
          onClick={() => onSubcategoryChange("ALL")}
          className="min-w-[100px]"
        >
          All
        </Button>
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

      {selectedSubcategory === "ALL" && mainFeaturedArticle && (
        <CategoryHero 
          featuredArticle={mainFeaturedArticle} 
          gridArticles={gridFeaturedArticles} 
        />
      )}

      <ArticleGrid articles={articles.slice(0, visibleArticles)} />

      <div className="w-full h-[200px] bg-gray-200 flex items-center justify-center my-8">
        <span className="text-gray-500">Advertisement</span>
      </div>

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
    </main>
  );
}
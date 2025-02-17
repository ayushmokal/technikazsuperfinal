import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { supabase } from "@/integrations/supabase/client";
import type { BlogFormData } from "@/types/blog";
import { categories } from "@/types/blog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoryPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState<BlogFormData[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const subcategories = category ? categories[category.toUpperCase() as keyof typeof categories] || [] : [];

  useEffect(() => {
    if (subcategories.length > 0 && !selectedSubcategory) {
      setSelectedSubcategory(subcategories[0]);
    }
    fetchArticles();
  }, [category, selectedSubcategory]);

  const fetchArticles = async () => {
    try {
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("category", category?.toUpperCase());

      if (selectedSubcategory) {
        query = query.eq("subcategory", selectedSubcategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 py-8">
          <div>Loading...</div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold capitalize">{category}</h1>
          {subcategories.length > 0 && (
            <Tabs value={selectedSubcategory} className="mt-4" onValueChange={setSelectedSubcategory}>
              <TabsList>
                {subcategories.map((subcat) => (
                  <TabsTrigger key={subcat} value={subcat}>
                    {subcat}
                  </TabsTrigger>
                ))}
              </TabsList>
              {subcategories.map((subcat) => (
                <TabsContent key={subcat} value={subcat}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                    {articles.map((article) => (
                      <ArticleCard
                        key={article.slug}
                        title={article.title}
                        image={article.image_url || "/placeholder.svg"}
                        category={article.category}
                        slug={article.slug}
                      />
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </header>

        {!subcategories.length && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                title={article.title}
                image={article.image_url || "/placeholder.svg"}
                category={article.category}
                slug={article.slug}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
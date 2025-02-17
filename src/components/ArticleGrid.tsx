import { BlogFormData } from "@/types/blog";
import { SideArticle } from "@/components/SideArticle";
import { Card } from "@/components/ui/card";

interface ArticleGridProps {
  articles: BlogFormData[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
      {articles?.slice(0, 4).map((article) => (
        <SideArticle key={article.slug} article={article} />
      ))}
    </div>
  );
}
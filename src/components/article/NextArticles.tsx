import { BlogFormData } from "@/types/blog";
import { ArticleContent } from "./ArticleContent";
import { Button } from "@/components/ui/button";

interface NextArticlesProps {
  articles: BlogFormData[];
  isLoadingMore: boolean;
  onLoadMore: () => void;
}

export function NextArticles({ articles, isLoadingMore, onLoadMore }: NextArticlesProps) {
  if (!articles.length) return null;

  return (
    <div className="space-y-8">
      {articles.map((article) => (
        <ArticleContent key={article.slug} blog={article} />
      ))}
      
      <div className="flex justify-center py-8">
        <Button
          onClick={onLoadMore}
          disabled={isLoadingMore}
          variant="outline"
          size="lg"
        >
          {isLoadingMore ? "Loading..." : "Load More Articles"}
        </Button>
      </div>
    </div>
  );
}
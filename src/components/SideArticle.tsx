import { Link } from "react-router-dom";
import { BlogFormData } from "@/types/blog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";

interface SideArticleProps {
  article: BlogFormData;
}

export function SideArticle({ article }: SideArticleProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link
        to={`/article/${article.slug}`}
        className="flex flex-col h-full group"
      >
        <div className="relative overflow-hidden">
          <AspectRatio ratio={16/9}>
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 bg-gray-100"
              loading="lazy"
            />
          </AspectRatio>
        </div>
        <div className="p-3 sm:p-4 flex-1">
          <h3 className="text-sm sm:text-base font-medium line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{article.author}</span>
            <span>•</span>
            <time>
              {new Date(article.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
        </div>
      </Link>
    </Card>
  );
}
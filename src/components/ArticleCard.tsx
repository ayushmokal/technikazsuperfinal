import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card } from "@/components/ui/card";
import { useAnalytics } from "@/context/AnalyticsContext";

interface ArticleCardProps {
  title: string;
  image: string;
  category: string;
  slug: string;
  featured?: boolean;
  mainFeatured?: boolean;
}

export function ArticleCard({ 
  title, 
  image, 
  category, 
  slug, 
  featured = false,
  mainFeatured = false 
}: ArticleCardProps) {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent({
      action: 'article_click',
      category: 'engagement',
      label: title,
      value: featured ? 1 : 0
    });
  };

  return (
    <div className={cn(
      "group",
      mainFeatured ? "lg:col-span-3" : featured ? "lg:col-span-2" : "lg:col-span-1",
      "animate-fadeIn"
    )}>
      <Card className="h-full overflow-hidden">
        <Link
          to={`/article/${slug}`}
          className="block"
          onClick={handleClick}
        >
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16/9}>
              <img
                src={image || '/placeholder.svg'}
                alt={title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </AspectRatio>
          </div>
          <div className="p-4">
            <h3 className={cn(
              "font-bold leading-tight group-hover:text-primary transition-colors line-clamp-2 min-h-[2.5em]",
              mainFeatured ? "text-2xl md:text-3xl" : featured ? "text-xl md:text-2xl" : "text-lg"
            )}>
              {title}
            </h3>
          </div>
        </Link>
      </Card>
    </div>
  );
}
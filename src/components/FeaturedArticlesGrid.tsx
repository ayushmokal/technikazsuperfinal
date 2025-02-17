import { BlogFormData } from "@/types/blog";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface FeaturedArticlesGridProps {
  articles: BlogFormData[];
}

export function FeaturedArticlesGrid({ articles }: FeaturedArticlesGridProps) {
  if (!articles.length) return null;

  const mainFeaturedArticle = articles[0];
  const sideFeaturedArticle = articles[1];
  const regularArticles = articles.slice(2, 6);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Featured Section */}
      <div className="flex flex-col lg:flex-row gap-4 lg:h-[500px]">
        {/* Main Featured Article (Left) */}
        {mainFeaturedArticle && (
          <div className="lg:w-2/3 h-[300px] lg:h-full">
            <Link to={`/article/${mainFeaturedArticle.slug}`} className="block h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <img
                  src={mainFeaturedArticle.image_url || '/placeholder.svg'}
                  alt={mainFeaturedArticle.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white group-hover:text-primary/90 transition-colors">
                      {mainFeaturedArticle.title}
                    </h2>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Side Featured Article (Right) */}
        {sideFeaturedArticle && (
          <div className="lg:w-1/3 h-[300px] lg:h-full">
            <Link to={`/article/${sideFeaturedArticle.slug}`} className="block h-full">
              <div className="relative h-full rounded-lg overflow-hidden">
                <img
                  src={sideFeaturedArticle.image_url || '/placeholder.svg'}
                  alt={sideFeaturedArticle.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-primary/90 transition-colors">
                      {sideFeaturedArticle.title}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}
      </div>

      {/* Regular Articles Grid */}
      {regularArticles.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {regularArticles.map((article) => (
            <Link 
              key={article.slug}
              to={`/article/${article.slug}`}
              className="group block bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative overflow-hidden">
                <AspectRatio ratio={16/9}>
                  <img
                    src={article.image_url || '/placeholder.svg'}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </AspectRatio>
              </div>
              <div className="p-3 sm:p-4">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
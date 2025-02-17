import { BlogFormData } from "@/types/blog";
import { Link, useLocation } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CategoryHeroProps {
  featuredArticle: BlogFormData | undefined;
  gridArticles: BlogFormData[];
}

export function CategoryHero({ featuredArticle, gridArticles }: CategoryHeroProps) {
  const location = useLocation();
  const isGadgetsPage = location.pathname === "/gadgets";
  
  if (!featuredArticle || isGadgetsPage) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 animate-fadeIn">
      {/* Main Featured Article - 75% width */}
      <div className="lg:col-span-2 overflow-hidden group bg-white rounded-lg shadow-sm">
        <Link to={`/article/${featuredArticle.slug}`} className="block">
          <div className="relative overflow-hidden">
            <AspectRatio ratio={16/9}>
              <img
                src={featuredArticle.image_url}
                alt={featuredArticle.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white group-hover:text-primary/90 transition-colors">
                    {featuredArticle.title}
                  </h2>
                  <p className="text-gray-300 mt-2 line-clamp-2 text-sm sm:text-base">
                    {featuredArticle.meta_description}
                  </p>
                </div>
              </div>
            </AspectRatio>
          </div>
        </Link>
      </div>

      {/* Side Articles Column - 25% width */}
      <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {gridArticles.slice(0, 2).map((article) => (
          <div key={article.slug} className="bg-white rounded-lg overflow-hidden group shadow-sm">
            <Link to={`/article/${article.slug}`} className="block">
              <div className="relative">
                <AspectRatio ratio={16/9}>
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base font-medium text-white group-hover:text-primary/90 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                    </div>
                  </div>
                </AspectRatio>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
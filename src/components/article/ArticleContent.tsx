import { BlogFormData } from "@/types/blog";
import { ArticleHeader } from "./ArticleHeader";
import { Progress } from "@/components/ui/progress";
import { ArticleRating } from "./ArticleRating";
import { useState, useEffect } from "react";

interface ArticleContentProps {
  blog: BlogFormData;
}

export function ArticleContent({ blog }: ArticleContentProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [averageRating, setAverageRating] = useState(blog.average_rating || 0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolled = (scrollTop / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(scrolled, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRatingUpdate = (newRating: number) => {
    setAverageRating(newRating);
  };

  return (
    <article className="bg-white rounded-lg shadow-lg overflow-hidden text-left">
      <Progress 
        value={scrollProgress} 
        className="fixed top-0 left-0 right-0 z-50 h-1 rounded-none bg-gray-200"
      />
      {blog.image_url && (
        <img
          src={blog.image_url}
          alt={blog.title}
          className="w-full h-[400px] object-cover"
        />
      )}
      <div className="p-8">
        <ArticleHeader blog={blog} />
        <div 
          className="prose max-w-none mb-8 text-left"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        <div className="border-t pt-8">
          <ArticleRating 
            blogId={blog.id || ''} 
            currentRating={averageRating}
            onRatingUpdate={handleRatingUpdate}
          />
        </div>
      </div>
    </article>
  );
}
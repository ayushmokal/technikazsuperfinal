import { BlogFormData } from "@/types/blog";
import { ArticleMetrics } from "./ArticleMetrics";
import { calculateReadingTime } from "@/utils/readingTime";
import { Clock } from "lucide-react";

interface ArticleHeaderProps {
  blog: BlogFormData;
}

export function ArticleHeader({ blog }: ArticleHeaderProps) {
  const readingTime = calculateReadingTime(blog.content);

  return (
    <div className="mb-6 text-left">
      <div className="flex gap-2 mb-4">
        <span className="inline-block bg-primary text-white px-3 py-1 text-sm font-semibold rounded-full">
          {blog.category}
        </span>
        {blog.subcategory && (
          <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 text-sm font-semibold rounded-full">
            {blog.subcategory}
          </span>
        )}
      </div>
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <div className="flex items-center justify-start gap-8 mb-4">
        <div className="flex flex-col gap-2 text-gray-600 text-sm">
          <div>
            <span className="mr-4">By {blog.author}</span>
            <span>
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-1 text-gray-500">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
        <ArticleMetrics 
          blogId={blog.id}
          viewCount={blog.view_count || 0}
          shareCount={blog.share_count || 0}
        />
      </div>
    </div>
  );
}
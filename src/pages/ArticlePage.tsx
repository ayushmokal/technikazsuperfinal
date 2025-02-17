import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { BlogSidebar } from "@/components/BlogSidebar";
import type { BlogFormData } from "@/types/blog";
import { useToast } from "@/hooks/use-toast";
import { Clock, Share2, Facebook, Twitter, Mail, Link2, Linkedin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ArticlePage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<BlogFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      fetchBlog();
    }
  }, [slug]);

  const fetchBlog = async () => {
    try {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();

      if (error) throw error;
      
      if (!data) {
        toast({
          variant: "destructive",
          title: "Article not found",
          description: "The article you're looking for doesn't exist.",
        });
        navigate("/");
        return;
      }

      await supabase.rpc('increment_view_count', { blog_id: data.id });
      setBlog(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load the article. Please try again later.",
      });
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (platform: string) => {
    if (!blog) return;

    try {
      const url = window.location.href;
      const title = blog.title;

      switch (platform) {
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
          break;
        case 'email':
          window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`;
          break;
        case 'copy':
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "Article link has been copied to your clipboard.",
          });
          break;
        default:
          if (navigator.share) {
            await navigator.share({
              title: title,
              url: url,
            });
          }
      }
      
      // Increment share count in database
      await supabase.rpc('increment_share_count', { blog_id: blog.id });
      
      if (platform !== 'copy') {
        toast({
          title: "Shared successfully!",
          description: "Thank you for sharing this article.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        variant: "destructive",
        title: "Error sharing article",
        description: "Please try again later.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-4 mt-6 sm:mt-8">
            <div className="h-48 sm:h-64 lg:h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!blog) return null;

  const cleanDescription = blog.meta_description || blog.content.replace(/<[^>]*>/g, '').slice(0, 160);

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{blog.meta_title || `${blog.title} | Technikaz`}</title>
        <meta name="description" content={cleanDescription} />
        <meta name="keywords" content={blog.meta_keywords || ''} />
        
        {/* OpenGraph Meta Tags */}
        <meta property="og:title" content={blog.meta_title || blog.title} />
        <meta property="og:description" content={cleanDescription} />
        <meta property="og:image" content={blog.image_url || '/og-image.png'} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={blog.created_at} />
        <meta property="article:author" content={blog.author} />
        <meta property="article:section" content={blog.category} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={blog.meta_title || blog.title} />
        <meta name="twitter:description" content={cleanDescription} />
        <meta name="twitter:image" content={blog.image_url || '/og-image.png'} />
      </Helmet>

      <Navigation />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mt-4 sm:mt-6 lg:mt-8">
          <article className="lg:col-span-8 space-y-4 sm:space-y-6">
            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-[#00897B] hover:bg-[#00897B]/90">
                {blog.category}
              </Badge>
              {blog.subcategories && blog.subcategories.length > 0 && (
                <Badge variant="secondary">
                  {blog.subcategories.join(', ')}
                </Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-left">
              {blog.title}
            </h1>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span>By {blog.author}</span>
                <span>•</span>
                <time>
                  {new Date(blog.created_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>1 min read</span>
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span>{blog.view_count || 0} views</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex items-center gap-2"
                    >
                      <Share2 className="h-4 w-4" />
                      <span>{blog.share_count || 0}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => handleShare('facebook')}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('twitter')}>
                      <Twitter className="h-4 w-4 mr-2" />
                      X (Twitter)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('linkedin')}>
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleShare('copy')}>
                      <Link2 className="h-4 w-4 mr-2" />
                      <span className="text-primary">Copy Link</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Featured Image */}
            {blog.image_url && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              </div>
            )}

            {/* Article Content */}
            <div 
              className="prose max-w-none text-left prose-img:rounded-lg prose-img:mx-auto sm:prose-base lg:prose-lg prose-headings:scroll-mt-20"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 space-y-6 lg:mt-[168px]">
              <BlogSidebar />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
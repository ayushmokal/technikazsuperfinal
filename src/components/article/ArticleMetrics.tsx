import { Share2, Facebook, Twitter, Mail, Link2, Linkedin, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ArticleMetricsProps {
  blogId: string;
  viewCount: number;
  shareCount: number;
}

export function ArticleMetrics({ blogId, viewCount, shareCount }: ArticleMetricsProps) {
  const { toast } = useToast();

  const handleShare = async (platform: string) => {
    try {
      const url = window.location.href;
      const title = document.title;

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
      await supabase.rpc('increment_share_count', { blog_id: blogId });
      
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

  return (
    <div className="flex items-center gap-6 text-sm text-gray-600">
      <div className="flex items-center gap-2">
        <span>{viewCount}</span>
        <span>views</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center gap-2 hover:text-primary"
          >
            <Share2 className="h-4 w-4" />
            <span>{shareCount}</span>
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
  );
}
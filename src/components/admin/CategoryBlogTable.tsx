import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Star, Trophy, Home, Heart } from "lucide-react";
import { BlogFormData } from "@/types/blog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CategoryBlogTableProps {
  blog: BlogFormData;
  onToggleFeatured: (id: string, currentValue: boolean, category: string, isHomepage?: boolean) => void;
  onTogglePopular: (id: string, currentValue: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategoryBlogTable({
  blog,
  onToggleFeatured,
  onTogglePopular,
  onEdit,
  onDelete,
}: CategoryBlogTableProps) {
  // Helper function to get the correct popular field based on category
  const getPopularInCategory = (blog: BlogFormData) => {
    switch (blog.category) {
      case 'TECH':
        return blog.popular_in_tech;
      case 'GAMES':
        return blog.popular_in_games;
      case 'ENTERTAINMENT':
        return blog.popular_in_entertainment;
      case 'STOCKS':
        return blog.popular_in_stocks;
      case 'GADGETS':
        return blog.popular_in_gadgets;
      default:
        return false;
    }
  };

  return (
    <TableRow>
      <TableCell>{blog.title}</TableCell>
      <TableCell>{blog.subcategory || '-'}</TableCell>
      <TableCell>{blog.author}</TableCell>
      <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTogglePopular(blog.id, blog.popular || false)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      blog.popular ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Popular on Homepage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onTogglePopular(blog.id, getPopularInCategory(blog))}
                >
                  <Star
                    className={`h-4 w-4 ${
                      getPopularInCategory(blog) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Popular in {blog.category}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFeatured(blog.id, blog.featured || false, blog.category, true)}
                >
                  <Home
                    className={`h-4 w-4 ${
                      blog.featured ? "fill-blue-500 text-blue-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Featured on Homepage</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onToggleFeatured(blog.id, blog.featured_in_category || false, blog.category)}
                >
                  <Trophy
                    className={`h-4 w-4 ${
                      blog.featured_in_category ? "fill-primary text-primary" : "text-gray-400"
                    }`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Featured in Category</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(blog.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Edit Blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(blog.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete Blog</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
    </TableRow>
  );
}
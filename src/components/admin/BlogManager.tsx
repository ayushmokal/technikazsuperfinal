import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { type Category, categories } from "@/types/blog";
import { CategorySection } from "./CategorySection";

interface BlogManagerProps {
  selectedCategory?: Category;
}

export function BlogManager({ selectedCategory }: BlogManagerProps) {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: blogs, refetch } = useQuery({
    queryKey: ['blogs', selectedCategory],
    queryFn: async () => {
      const query = supabase
        .from('blogs')
        .select('*');

      if (selectedCategory) {
        query.eq('category', selectedCategory);
      }

      query.order('created_at', { ascending: false });

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching blogs:', error);
        throw error;
      }
      
      return data || [];
    },
  });

  const handleDelete = async (id: string) => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to delete blogs",
        });
        return;
      }

      // Get blog details before deletion
      const { data: blog } = await supabase
        .from('blogs')
        .select('title')
        .eq('id', id)
        .single();

      // Delete the blog
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log the delete action
      await supabase.from('admin_logs').insert({
        user_email: session.user.email,
        action_type: 'delete',
        entity_type: 'blog',
        entity_id: id,
        entity_name: blog.title,
        details: `Deleted blog post "${blog.title}"`
      });

      toast({
        title: "Success",
        description: "Blog post deleted successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Error deleting blog:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete blog post",
      });
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleToggleFeatured = async (id: string, currentValue: boolean, category: string, isHomepage?: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update blogs",
        });
        return;
      }

      // Get blog details before update
      const { data: blog } = await supabase
        .from('blogs')
        .select('title')
        .eq('id', id)
        .single();

      // Determine which field to update
      const updateField = isHomepage ? 'featured' : 'featured_in_category';

      // Update the blog
      const { error } = await supabase
        .from('blogs')
        .update({ [updateField]: !currentValue })
        .eq('id', id);

      if (error) throw error;

      // Log the update action
      await supabase.from('admin_logs').insert({
        user_email: session.user.email,
        action_type: 'update',
        entity_type: 'blog',
        entity_id: id,
        entity_name: blog.title,
        details: `${!currentValue ? 'Added' : 'Removed'} ${isHomepage ? 'homepage' : 'category'} featured status for "${blog.title}"`
      });

      toast({
        title: "Success",
        description: "Blog status updated successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Error updating blog:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update blog status",
      });
    }
  };

  const handleTogglePopular = async (id: string, currentValue: boolean) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const { data: blogData } = await supabase
        .from('blogs')
        .select('title, category')
        .eq('id', id)
        .single();

      if (!session?.user?.email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "You must be logged in to update blogs",
        });
        return;
      }

      // Determine which popular field to update based on category
      const updateField = `popular_in_${blogData.category.toLowerCase()}`;
      const updateData = {
        [updateField]: !currentValue,
        // Also update the main popular flag for consistency
        popular: !currentValue
      };

      // Update the blog
      const { error } = await supabase
        .from('blogs')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      // Log the update action
      await supabase.from('admin_logs').insert({
        user_email: session.user.email,
        action_type: 'update',
        entity_type: 'blog',
        entity_id: id,
        entity_name: blogData.title,
        details: `${!currentValue ? 'Added' : 'Removed'} popular status for "${blogData.title}" in ${blogData.category}`
      });

      toast({
        title: "Success",
        description: "Blog status updated successfully",
      });
      refetch();
    } catch (error: any) {
      console.error('Error updating blog:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update blog status",
      });
    }
  };

  if (!blogs) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading blogs...</p>
      </div>
    );
  }

  const categoriesToShow = selectedCategory ? [selectedCategory] : Object.keys(categories) as Category[];

  return (
    <div className="space-y-4">
      {categoriesToShow.map((category) => {
        const categoryBlogs = blogs.filter((blog) => blog.category === category);
        
        return (
          <CategorySection
            key={category}
            category={category}
            blogs={categoryBlogs}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggleFeatured={handleToggleFeatured}
            onTogglePopular={handleTogglePopular}
          />
        );
      })}
    </div>
  );
}
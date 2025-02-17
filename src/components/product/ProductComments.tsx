import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  blog_id: string;
  content: string;
  user_name: string;
  parent_id: string | null;
  upvotes: number;
  created_at: string;
  updated_at: string;
}

export function ProductComments({ productId }: { productId: string }) {
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const { data: comments, refetch } = useQuery({
    queryKey: ["product-comments", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("*")
        .eq("content_id", productId)
        .eq("content_type", "product")
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load comments",
        });
        throw error;
      }

      return data as Comment[];
    },
  });

  const handleSubmitComment = async () => {
    if (!comment.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a comment",
      });
      return;
    }

    const { error } = await supabase.from("comments").insert({
      content_id: productId,
      content_type: "product",
      content: comment,
      user_name: "Anonymous", // Replace with actual user name when auth is implemented
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to post comment",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Comment posted successfully",
    });
    setComment("");
    refetch();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4 mt-6">
        {comments?.map((comment: Comment) => (
          <div key={comment.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{comment.user_name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="mt-2">{comment.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
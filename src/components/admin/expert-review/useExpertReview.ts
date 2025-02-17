import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { expertReviewSchema, type ExpertReviewFormData } from "@/schemas/productSchemas";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function useExpertReview(productId: string, onSuccess?: () => void) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);
  const [detailedReview, setDetailedReview] = useState<string>("");

  const form = useForm<ExpertReviewFormData>({
    resolver: zodResolver(expertReviewSchema),
    defaultValues: {
      rating: 0,
      author: "",
      summary: "",
      detailed_review: "",
      pros: [""],
      cons: [""],
      verdict: "",
    },
  });

  const handleAddPro = () => setPros([...pros, ""]);
  const handleAddCon = () => setCons([...cons, ""]);

  const handleProChange = (index: number, value: string) => {
    const newPros = [...pros];
    newPros[index] = value;
    setPros(newPros);
    form.setValue("pros", newPros.filter(pro => pro.trim() !== ""));
  };

  const handleConChange = (index: number, value: string) => {
    const newCons = [...cons];
    newCons[index] = value;
    setCons(newCons);
    form.setValue("cons", newCons.filter(con => con.trim() !== ""));
  };

  const handleDetailedReviewChange = (event: any, editor: any) => {
    const data = editor.getData();
    setDetailedReview(data);
    form.setValue("detailed_review", data);
  };

  const onSubmit = async (data: ExpertReviewFormData) => {
    try {
      setIsLoading(true);

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      
      if (!session?.user) {
        throw new Error('You must be logged in to submit a review');
      }

      console.log('Submitting expert review:', {
        productId,
        authorId: session.user.id,
        ...data
      });
      
      const { error } = await supabase
        .from("expert_reviews")
        .insert({
          product_id: productId,
          rating: data.rating,
          author: data.author,
          summary: data.summary,
          detailed_review: data.detailed_review,
          pros: data.pros,
          cons: data.cons,
          verdict: data.verdict,
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Expert review added successfully",
      });
      
      form.reset();
      setPros([""]);
      setCons([""]);
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add expert review",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    pros,
    cons,
    handleAddPro,
    handleAddCon,
    handleProChange,
    handleConChange,
    handleDetailedReviewChange,
    onSubmit,
  };
}
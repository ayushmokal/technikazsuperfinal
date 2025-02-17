import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { expertReviewSchema, type ExpertReviewFormData } from "@/schemas/productSchemas";

interface ExpertReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export function ExpertReviewForm({ productId, onSuccess }: ExpertReviewFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pros, setPros] = useState<string[]>([""]);
  const [cons, setCons] = useState<string[]>([""]);

  const form = useForm<ExpertReviewFormData>({
    resolver: zodResolver(expertReviewSchema),
    defaultValues: {
      rating: 0,
      author: "",
      summary: "",
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

  const onSubmit = async (data: ExpertReviewFormData) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from("expert_reviews")
        .insert({
          product_id: productId,
          rating: data.rating,
          author: data.author,
          summary: data.summary,
          pros: data.pros,
          cons: data.cons,
          verdict: data.verdict,
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Expert Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (0-10)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="10"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="summary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <FormLabel>Pros</FormLabel>
              {pros.map((pro, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={pro}
                    onChange={(e) => handleProChange(index, e.target.value)}
                    placeholder={`Pro ${index + 1}`}
                  />
                  {index === pros.length - 1 && (
                    <Button type="button" variant="outline" onClick={handleAddPro}>
                      Add Pro
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <FormLabel>Cons</FormLabel>
              {cons.map((con, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={con}
                    onChange={(e) => handleConChange(index, e.target.value)}
                    placeholder={`Con ${index + 1}`}
                  />
                  {index === cons.length - 1 && (
                    <Button type="button" variant="outline" onClick={handleAddCon}>
                      Add Con
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="verdict"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verdict</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Expert Review"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
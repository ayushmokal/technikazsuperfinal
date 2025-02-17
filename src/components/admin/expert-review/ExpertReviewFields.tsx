import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { UseFormReturn } from "react-hook-form";
import { ExpertReviewFormData } from "@/schemas/productSchemas";

interface ExpertReviewFieldsProps {
  form: UseFormReturn<ExpertReviewFormData>;
}

export function ExpertReviewFields({ form }: ExpertReviewFieldsProps) {
  return (
    <>
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
      
      <FormField
        control={form.control}
        name="detailed_review"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Detailed Review</FormLabel>
            <FormControl>
              <RichTextEditor content={field.value || ''} onChange={field.onChange} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
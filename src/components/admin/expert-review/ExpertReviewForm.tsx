import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ExpertReviewFields } from "./ExpertReviewFields";
import { ProsConsFields } from "./ProsConsFields";
import { useExpertReview } from "./useExpertReview";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

interface ExpertReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  className?: string;
}

export function ExpertReviewForm({ productId, onSuccess, className }: ExpertReviewFormProps) {
  const {
    form,
    isLoading,
    handleDetailedReviewChange,
    pros,
    cons,
    handleAddPro,
    handleAddCon,
    handleProChange,
    handleConChange,
    onSubmit,
  } = useExpertReview(productId, onSuccess);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-4">
          <CardTitle>Add Expert Review</CardTitle>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-primary">10</span>
            <span className="text-sm text-gray-500">/10</span>
          </div>
          <span className="text-sm text-gray-500">by ayush • 1/23/2025</span>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <ExpertReviewFields form={form} />

            <ProsConsFields
              items={pros}
              onItemChange={handleProChange}
              onAddItem={handleAddPro}
              label="Pro"
            />

            <ProsConsFields
              items={cons}
              onItemChange={handleConChange}
              onAddItem={handleAddCon}
              label="Con"
            />

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

            <FormField
              control={form.control}
              name="detailed_review"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Review</FormLabel>
                  <FormControl className="min-h-[400px] border rounded-md">
                    <CKEditor
                      editor={ClassicEditor}
                      data={field.value || ''}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        field.onChange(data);
                      }}
                      config={{
                        toolbar: {
                          items: [
                            'heading',
                            '|',
                            'bold',
                            'italic',
                            'link',
                            'bulletedList',
                            'numberedList',
                            '|',
                            'outdent',
                            'indent',
                            '|',
                            'imageUpload',
                            'blockQuote',
                            'insertTable',
                            'mediaEmbed',
                            'undo',
                            'redo'
                          ]
                        }
                      }}
                    />
                  </FormControl>
                  <p className="text-sm text-muted-foreground mt-2">
                    Write a detailed review with rich text formatting. You can include images, links, and formatting.
                  </p>
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
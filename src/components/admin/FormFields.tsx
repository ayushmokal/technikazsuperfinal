import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { BlogFormData } from "@/types/blog";
import { RichTextEditor } from "./RichTextEditor";
import { CategorySelect } from "./CategorySelect";
import { SubcategorySelect } from "./SubcategorySelect";
import { ImageUpload } from "./ImageUpload";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FormFieldsProps {
  form: UseFormReturn<BlogFormData>;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormFields({ form, selectedCategory, onCategoryChange, onImageChange }: FormFieldsProps) {
  return (
    <>
      <div className="text-left">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-left">Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter blog title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="mt-4">
          <CategorySelect 
            form={form} 
            onCategoryChange={onCategoryChange} 
          />
        </div>

        <div className="mt-4">
          <SubcategorySelect 
            form={form}
            selectedCategory={selectedCategory}
          />
        </div>

        <div className="mt-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left">Content</FormLabel>
                <FormControl>
                  <RichTextEditor 
                    content={field.value} 
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-left">Author</FormLabel>
                <FormControl>
                  <Input placeholder="Enter author name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="mt-4">
          <ImageUpload onChange={onImageChange} />
        </div>

        <div className="mt-4">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="seo">
              <AccordionTrigger className="text-left">SEO Meta Tags</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="meta_title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Title</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter meta title (max 60 characters)" 
                            {...field} 
                            maxLength={60}
                            onChange={(e) => {
                              field.onChange(e);
                              const input = e.target.value;
                              if (input.length > 60) {
                                e.target.setCustomValidity('Meta title should be under 60 characters');
                              } else {
                                e.target.setCustomValidity('');
                              }
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          {field.value?.length || 0}/60 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter meta description (max 160 characters)" 
                            {...field} 
                            maxLength={160}
                            onChange={(e) => {
                              field.onChange(e);
                              const input = e.target.value;
                              if (input.length > 160) {
                                e.target.setCustomValidity('Meta description should be under 160 characters');
                              } else {
                                e.target.setCustomValidity('');
                              }
                            }}
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          {field.value?.length || 0}/160 characters
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta_keywords"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-left">Meta Keywords</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter keywords separated by commas (e.g., tech, gadgets, review)" 
                            {...field} 
                          />
                        </FormControl>
                        <p className="text-xs text-gray-500 mt-1">
                          Add relevant keywords separated by commas
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </>
  );
}
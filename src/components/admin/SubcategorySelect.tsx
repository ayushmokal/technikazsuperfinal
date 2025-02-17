import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { categories } from "@/types/blog";
import { UseFormReturn } from "react-hook-form";
import type { BlogFormData } from "@/types/blog";
import { Checkbox } from "@/components/ui/checkbox";

interface SubcategorySelectProps {
  form: UseFormReturn<BlogFormData>;
  selectedCategory: string;
}

export function SubcategorySelect({ form, selectedCategory }: SubcategorySelectProps) {
  const subcategories = selectedCategory ? categories[selectedCategory as keyof typeof categories] || [] : [];

  return (
    <FormField
      control={form.control}
      name="subcategories"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Subcategories</FormLabel>
          <div className="grid grid-cols-2 gap-4">
            {subcategories.map((subcategory) => (
              <FormItem
                key={subcategory}
                className="flex flex-row items-start space-x-3 space-y-0"
              >
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(subcategory)}
                    onCheckedChange={(checked) => {
                      const currentValue = field.value || [];
                      const newValue = checked
                        ? [...currentValue, subcategory]
                        : currentValue.filter((val) => val !== subcategory);
                      field.onChange(newValue);
                    }}
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {subcategory}
                </FormLabel>
              </FormItem>
            ))}
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryBlogTable } from "./CategoryBlogTable";
import { type BlogFormData } from "@/types/blog";

interface CategorySectionProps {
  category: string;
  blogs: BlogFormData[];
  onToggleFeatured: (id: string, currentValue: boolean, category: string, isHomepage?: boolean) => void;
  onTogglePopular: (id: string, currentValue: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CategorySection({
  category,
  blogs,
  onToggleFeatured,
  onTogglePopular,
  onEdit,
  onDelete
}: CategorySectionProps) {
  const featuredInCategoryCount = blogs.filter(blog => blog.featured_in_category).length;
  const featuredCount = blogs.filter(blog => blog.featured).length;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold capitalize">{category}</h3>
        <div className="flex gap-4 text-sm">
          <span className={`${featuredInCategoryCount >= 7 ? 'text-red-500' : 'text-gray-500'}`}>
            Featured in {category}: {featuredInCategoryCount}/7
          </span>
          <span className="text-gray-500">
            Featured on Homepage: {featuredCount}
          </span>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Subcategory</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs.map((blog) => (
              <CategoryBlogTable
                key={blog.id}
                blog={blog}
                onToggleFeatured={onToggleFeatured}
                onTogglePopular={onTogglePopular}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
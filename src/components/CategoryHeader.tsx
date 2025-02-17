import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface CategoryHeaderProps {
  title: string;
  subcategories: readonly string[];
  selectedSubcategory: string;
  onSubcategoryChange: (subcategory: string) => void;
}

export function CategoryHeader({
  title,
  subcategories,
  selectedSubcategory,
  onSubcategoryChange,
}: CategoryHeaderProps) {
  return (
    <div className="border-b mb-4 sm:mb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center py-4 sm:py-6 gap-4">
          {/* Title on the left */}
          <h1 className="text-2xl sm:text-3xl font-bold text-left sm:w-48">{title}</h1>
          
          {/* Subcategories centered */}
          <div className="flex gap-4 sm:gap-8 overflow-x-auto pb-2 sm:pb-0 justify-center flex-1">
            {subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => onSubcategoryChange(sub)}
                className={cn(
                  "text-sm sm:text-lg font-medium whitespace-nowrap hover:text-primary transition-colors hover:border-b-2 hover:border-primary",
                  selectedSubcategory === sub && "text-primary border-b-2 border-primary"
                )}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
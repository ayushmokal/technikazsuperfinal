import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { navigationCategories } from "./navigationData";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export function MobileMenu() {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (categoryName: string) => {
    setOpenItems(prev => 
      prev.includes(categoryName) 
        ? prev.filter(item => item !== categoryName)
        : [...prev, categoryName]
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden -ml-3">
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[350px] p-0">
        <div className="py-2 sm:py-4">
          <div className="space-y-0.5">
            {navigationCategories.map((category) => (
              <Collapsible 
                key={category.name}
                open={openItems.includes(category.name)}
                onOpenChange={() => toggleItem(category.name)}
              >
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-gray-50">
                  <Link 
                    to={category.path} 
                    className="flex-1 text-left text-sm sm:text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    {category.name}
                  </Link>
                  {category.subcategories.length > 0 && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openItems.includes(category.name) ? 'transform rotate-180' : ''
                      }`}
                    />
                  )}
                </CollapsibleTrigger>
                {category.subcategories.length > 0 && (
                  <CollapsibleContent className="pl-4 space-y-0.5">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        to={`${category.path}?subcategory=${subcategory}`}
                        className="block p-3 text-sm hover:bg-gray-50 text-gray-600"
                      >
                        {subcategory}
                      </Link>
                    ))}
                  </CollapsibleContent>
                )}
              </Collapsible>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
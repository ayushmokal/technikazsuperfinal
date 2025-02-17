import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryTabsProps {
  mainImage: string | null;
  productName: string;
  galleryImages?: string[] | null;
}

export function ProductGalleryTabs({
  mainImage,
  productName,
  galleryImages = []
}: ProductGalleryTabsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Deduplicate and filter out null/undefined/empty values
  const allImages = Array.from(new Set([mainImage, ...(galleryImages || [])])).filter(Boolean) as string[];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      <DialogTitle className="p-4 text-lg font-bold">Product Gallery - {productName}</DialogTitle>
      
      <div className="mt-4">
        <div className="relative bg-gray-50 rounded-lg">
          <div className="aspect-[4/3] flex items-center justify-center p-4">
            <img
              src={allImages[currentIndex]}
              alt={`${productName}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-4">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-4 pb-2 overflow-x-auto">
          {allImages.map((image, index) => (
            <button
              key={`gallery-thumb-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={`relative flex-shrink-0 w-16 h-16 rounded border overflow-hidden ${
                index === currentIndex 
                  ? 'border-emerald-600 ring-1 ring-emerald-600' 
                  : 'border-gray-200 hover:border-emerald-600'
              }`}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
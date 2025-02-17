import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ProductGalleryTabs } from "./ProductGalleryTabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ProductGalleryProps {
  mainImage: string | null;
  productName: string;
  galleryImages?: string[] | null;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'review', label: 'Expert Review' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'comparison', label: 'Comparison' },
  { id: 'user-reviews', label: 'User Reviews' },
  { id: 'pictures', label: 'Pictures' },
];

export function ProductGallery({ 
  mainImage, 
  productName,
  galleryImages = [],
  activeSection,
  onSectionChange
}: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  // Deduplicate and filter out null/undefined/empty values
  const allImages = Array.from(new Set([mainImage, ...(galleryImages || [])])).filter(Boolean) as string[];

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleSectionClick = (sectionId: string) => {
    if (sectionId === 'pictures') {
      setIsGalleryOpen(true);
      return;
    }

    onSectionChange(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Product Name */}
      <h1 className="text-2xl font-bold text-left">{productName}</h1>

      {/* Main Image */}
      <div className="relative bg-white rounded-lg border overflow-hidden">
        <AspectRatio ratio={1}>
          <img
            src={allImages[currentIndex]}
            alt={`${productName} - View ${currentIndex + 1}`}
            className="w-full h-full object-contain p-4"
            onClick={() => setIsGalleryOpen(true)}
          />
        </AspectRatio>
        {allImages.length > 1 && (
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4">
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
        )}
      </div>

      {/* Thumbnail Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {allImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded-lg border overflow-hidden",
                index === currentIndex && "ring-2 ring-primary"
              )}
            >
              <img
                src={image}
                alt={`${productName} view ${index + 1}`}
                className="w-full h-full object-contain p-2"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Navigation Menu */}
      <div className="overflow-x-auto lg:overflow-visible">
        <div className="flex lg:flex-col gap-2 min-w-max lg:min-w-0 p-1 lg:border-l lg:border-gray-200">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleSectionClick(section.id)}
              className={cn(
                "px-4 py-2 text-sm whitespace-nowrap rounded-md transition-colors text-left",
                "hover:bg-gray-100 hover:text-primary",
                activeSection === section.id && "bg-primary/5 text-primary border-l-2 border-primary lg:rounded-l-none"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Modal */}
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto p-0">
          <DialogTitle className="sr-only">Product Gallery</DialogTitle>
          <ProductGalleryTabs
            mainImage={mainImage}
            productName={productName}
            galleryImages={galleryImages}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
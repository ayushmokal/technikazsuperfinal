import { ImageUpload } from "../ImageUpload";
import { FormLabel } from "@/components/ui/form";

interface ImageSectionProps {
  onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentImageUrl?: string;
  currentGalleryImages?: string[];
  onRemoveGalleryImage: (index: number) => void;
}

export function ImageSection({
  onMainImageChange,
  onGalleryImagesChange,
  currentImageUrl,
  currentGalleryImages,
  onRemoveGalleryImage,
}: ImageSectionProps) {
  return (
    <div className="space-y-4 text-left">
      <h3 className="text-lg font-semibold">Product Images</h3>
      <div className="grid gap-6">
        <div className="space-y-2">
          <FormLabel className="text-left">Main Product Image</FormLabel>
          <ImageUpload 
            onChange={onMainImageChange} 
            currentImageUrl={currentImageUrl}
            label="Main Product Image"
          />
        </div>
        
        <div className="space-y-2">
          <FormLabel className="text-left">Product Gallery Images</FormLabel>
          <ImageUpload 
            onChange={onGalleryImagesChange} 
            currentGalleryImages={currentGalleryImages}
            label="Product Gallery Images"
            multiple
            onRemoveImage={onRemoveGalleryImage}
          />
        </div>
      </div>
    </div>
  );
}
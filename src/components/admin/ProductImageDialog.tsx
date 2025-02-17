import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { X } from "lucide-react";

interface ProductImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  currentImage: string | null;
  currentGalleryImages: string[] | null;
  onSuccess: () => void;
  type: 'mobile' | 'laptop';
}

export function ProductImageDialog({
  isOpen,
  onClose,
  productId,
  currentImage,
  currentGalleryImages = [],
  onSuccess,
  type
}: ProductImageDialogProps) {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setMainImageFile(file);
      }
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => validateFile(file));
      setGalleryImageFiles(validFiles);
    }
  };

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB",
      });
      return false;
    }

    if (!allowedTypes.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Only JPEG, PNG and WebP images are allowed",
      });
      return false;
    }

    return true;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("blog-images")
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from("blog-images")
      .getPublicUrl(filePath);

    if (!publicUrlData.publicUrl) {
      throw new Error('Failed to get public URL for uploaded image');
    }

    return publicUrlData.publicUrl;
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const updates: { image_url?: string; gallery_images?: string[] } = {};

      if (mainImageFile) {
        updates.image_url = await uploadImage(mainImageFile);
      }

      if (galleryImageFiles.length > 0) {
        const uploadPromises = galleryImageFiles.map(file => uploadImage(file));
        const newGalleryImages = await Promise.all(uploadPromises);
        updates.gallery_images = [...(currentGalleryImages || []), ...newGalleryImages];
      }

      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { error } = await supabase
        .from(tableName)
        .update(updates)
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product images updated successfully",
      });

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error updating images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update images",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveGalleryImage = async (index: number) => {
    try {
      const updatedGalleryImages = [...(currentGalleryImages || [])];
      updatedGalleryImages.splice(index, 1);

      const tableName = type === 'laptop' ? 'laptops' : 'mobile_products';
      const { error } = await supabase
        .from(tableName)
        .update({ gallery_images: updatedGalleryImages })
        .eq('id', productId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Gallery image removed successfully",
      });

      onSuccess();
    } catch (error: any) {
      console.error('Error removing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove image",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Update Product Images</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Main Image Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Main Product Image</h3>
            {currentImage && (
              <div className="w-48 h-48 mx-auto">
                <AspectRatio ratio={1}>
                  <img
                    src={currentImage}
                    alt="Current main product image"
                    className="object-contain w-full h-full rounded-lg border"
                  />
                </AspectRatio>
              </div>
            )}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleMainImageChange}
            />
          </div>

          {/* Gallery Images Section */}
          <div className="space-y-4">
            <h3 className="font-medium">Gallery Images</h3>
            {currentGalleryImages && currentGalleryImages.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currentGalleryImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <AspectRatio ratio={1}>
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="object-contain w-full h-full rounded-lg border"
                      />
                    </AspectRatio>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveGalleryImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleGalleryImagesChange}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Images"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
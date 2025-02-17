import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useImageUpload() {
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState<File[]>([]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImageFile(e.target.files[0]);
    }
  };

  const handleGalleryImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setGalleryImageFiles(Array.from(e.target.files));
    }
  };

  const handleRemoveGalleryImage = (index: number, form: any) => {
    const currentImages = form.getValues().gallery_images || [];
    const updatedImages = [...currentImages];
    updatedImages.splice(index, 1);
    form.setValue('gallery_images', updatedImages);
  };

  const uploadImage = async (file: File, folder: string): Promise<string> => {
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    try {
      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("blog-images")
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("blog-images")
        .getPublicUrl(filePath);

      if (!publicUrlData.publicUrl) {
        throw new Error('Failed to get public URL for uploaded image');
      }

      return publicUrlData.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }
  };

  return {
    mainImageFile,
    galleryImageFiles,
    handleMainImageChange,
    handleGalleryImagesChange,
    handleRemoveGalleryImage,
    uploadImage,
  };
}
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mobileProductSchema, laptopProductSchema } from "@/schemas/productSchemas";
import { useImageUpload } from "./useImageUpload";
import { useAuthCheck } from "./useAuthCheck";
import { useProductData } from "./useProductData";
import { supabase } from "@/integrations/supabase/client";
import type { UseProductFormProps, MobileProductData, LaptopProductData } from "../components/admin/types/productTypes";

export function useProductForm({ initialData, onSuccess, productType: propProductType }: UseProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [productType, setProductType] = useState<'mobile' | 'laptop'>(propProductType || 'mobile');
  const { toast, navigate } = useAuthCheck();
  const { updateProduct, insertProduct } = useProductData();
  const { 
    mainImageFile, 
    galleryImageFiles, 
    handleMainImageChange, 
    handleGalleryImagesChange, 
    handleRemoveGalleryImage,
    uploadImage 
  } = useImageUpload();

  const getDefaultValues = () => {
    if (productType === 'laptop') {
      return {
        name: "",
        brand: "",
        model_name: "",
        price: 0,
        display_specs: "",
        processor: "",
        ram: "",
        storage: "",
        battery: "",
        os: "",
        color: "",
        graphics: "",
        warranty: "", // Added default value
        sales_package: "", // Added default value
        series: "",
        thickness: "",
        dimensions: "",
        weight: "",
        os_type: "",
        display_size: "",
        display_resolution: "",
        pixel_density: "",
        display_features: "",
        refresh_rate: "",
        clock_speed: "",
        cache: "",
        graphics_memory: "",
        ram_type: "",
        ram_speed: "",
        memory_slots: "",
        expandable_memory: "",
        ssd_capacity: "",
        battery_cell: "",
        battery_type: "",
        power_supply: "",
        battery_life: "",
        wlan: "",
        wifi_version: "",
        bluetooth_version: "",
        hdmi_ports: "",
        usb_type_c: "",
        ethernet_ports: "",
        headphone_jack: false,
        microphone_jack: false,
        webcam: false,
        video_recording: "",
        audio_solution: "",
        microphone: false,
        backlit_keyboard: "",
        face_recognition: "",
      };
    }

    return {
      name: "",
      brand: "",
      model_name: "",
      price: 0,
      display_specs: "",
      processor: "",
      ram: "",
      storage: "",
      battery: "",
      camera: "",
      os: "",
      color: "",
    };
  };

  const form = useForm({
    resolver: zodResolver(productType === 'mobile' ? mobileProductSchema : laptopProductSchema),
    defaultValues: initialData || getDefaultValues(),
  });

  // Reset form when product type changes
  useEffect(() => {
    if (!initialData) {
      form.reset(getDefaultValues());
    }
  }, [productType]);

  // Update product type when prop changes
  useEffect(() => {
    if (propProductType) {
      setProductType(propProductType);
    }
  }, [propProductType]);

  const onSubmit = async (data: MobileProductData | LaptopProductData) => {
    try {
      setIsLoading(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Please login again to continue.",
        });
        navigate("/admin/login");
        return;
      }

      let finalData = { ...data };

      // Handle image uploads
      if (mainImageFile) {
        try {
          finalData.image_url = await uploadImage(mainImageFile, 'main');
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to upload main image: ${error.message}`,
          });
          return;
        }
      }

      if (galleryImageFiles.length > 0) {
        try {
          const uploadPromises = galleryImageFiles.map(file => uploadImage(file, 'gallery'));
          const newGalleryImages = await Promise.all(uploadPromises);
          finalData.gallery_images = [...(initialData?.gallery_images || []), ...newGalleryImages];
        } catch (error: any) {
          toast({
            variant: "destructive",
            title: "Error",
            description: `Failed to upload gallery images: ${error.message}`,
          });
          return;
        }
      }

      // Clean up empty strings
      Object.keys(finalData).forEach(key => {
        if (finalData[key] === '') {
          finalData[key] = null;
        }
      });

      const table = productType === 'laptop' ? 'laptops' : 'mobile_products';
      
      let result;
      try {
        if (initialData?.id) {
          result = await updateProduct(table, initialData.id, finalData, productType);
          toast({
            title: "Success",
            description: `${productType === 'mobile' ? 'Mobile phone' : 'Laptop'} updated successfully`,
          });
        } else {
          result = await insertProduct(table, finalData, productType);
          toast({
            title: "Success",
            description: `${productType === 'mobile' ? 'Mobile phone' : 'Laptop'} added successfully`,
          });
        }

        form.reset(getDefaultValues());
        onSuccess?.(result.id);
      } catch (error: any) {
        if (error.message?.includes('not found')) {
          toast({
            variant: "destructive",
            title: "Database Error",
            description: "The product table has not been created yet. Please run database migrations first.",
          });
          return;
        }
        throw error;
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.message?.includes('JWT')) {
        toast({
          variant: "destructive",
          title: "Session Expired",
          description: "Please login again to continue.",
        });
        navigate("/admin/login");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to save product",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    isLoading,
    productType,
    handleMainImageChange,
    handleGalleryImagesChange,
    handleRemoveGalleryImage: (index: number) => handleRemoveGalleryImage(index, form),
    onSubmit,
  };
}
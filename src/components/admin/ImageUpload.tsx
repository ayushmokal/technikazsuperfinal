import * as React from "react";
import { Input } from "@/components/ui/input";
import { FormLabel } from "@/components/ui/form";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { X, Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_GALLERY_IMAGES = 10; // Maximum number of images allowed in gallery

interface ImageUploadProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  currentImageUrl?: string | null;
  currentGalleryImages?: string[] | null;
  multiple?: boolean;
  onRemoveImage?: (index: number) => void;
}

export function ImageUpload({ 
  onChange, 
  label = "Product Image", 
  currentImageUrl, 
  currentGalleryImages = [], 
  multiple = false,
  onRemoveImage 
}: ImageUploadProps) {
  const [previewUrls, setPreviewUrls] = React.useState<string[]>([]);
  const [dragActive, setDragActive] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: `${file.name} is larger than 1MB. Please choose a smaller file.`,
      });
      return false;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: `${file.name} is not a supported file type. Only JPEG, PNG and WebP images are allowed.`,
      });
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const currentCount = multiple ? (currentGalleryImages?.length || 0) + previewUrls.length : 0;
    
    if (multiple && currentCount + fileArray.length > MAX_GALLERY_IMAGES) {
      toast({
        variant: "destructive",
        title: "Too many images",
        description: `You can only upload up to ${MAX_GALLERY_IMAGES} images in the gallery. Please remove some images first.`,
      });
      return;
    }

    const validFiles = fileArray.filter(file => validateFile(file));
    
    if (validFiles.length !== fileArray.length) {
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input if any files were invalid
      }
      return;
    }

    // Create new preview URLs
    const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => {
      // Cleanup old preview URLs
      prev.forEach(url => URL.revokeObjectURL(url));
      return [...prev, ...newPreviewUrls];
    });

    // Create a new event with all valid files
    const dataTransfer = new DataTransfer();
    validFiles.forEach(file => dataTransfer.items.add(file));
    
    const event = {
      target: {
        files: dataTransfer.files,
        multiple: multiple
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    
    onChange(event);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Cleanup preview URLs on unmount
  React.useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  const imagesToDisplay = React.useMemo(() => {
    if (previewUrls.length > 0) return previewUrls;
    if (multiple && Array.isArray(currentGalleryImages)) return currentGalleryImages;
    if (!multiple && currentImageUrl) return [currentImageUrl];
    return [];
  }, [previewUrls, currentGalleryImages, currentImageUrl, multiple]);

  const currentCount = imagesToDisplay.length;

  return (
    <div className="space-y-4">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
          ${dragActive ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <Upload className="h-8 w-8 text-gray-400" />
          <div className="text-center">
            <Button
              type="button"
              variant="ghost"
              className="relative"
              onClick={handleButtonClick}
            >
              Choose file{multiple ? 's' : ''}
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              or drag and drop
              <br />
              {multiple ? (
                <span>Up to {MAX_GALLERY_IMAGES} images • </span>
              ) : null}
              Max 1MB per file
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              JPEG, PNG, WebP
            </p>
          </div>
        </div>
      </div>

      {multiple && (
        <Alert variant={currentCount >= MAX_GALLERY_IMAGES ? "destructive" : "default"}>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {currentCount} of {MAX_GALLERY_IMAGES} images used
          </AlertDescription>
        </Alert>
      )}

      {imagesToDisplay.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {imagesToDisplay.map((url, index) => (
            <div key={`${url}-${index}`} className="relative group">
              <AspectRatio ratio={1}>
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="object-contain w-full h-full rounded-md border border-gray-200"
                />
              </AspectRatio>
              {onRemoveImage && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => onRemoveImage(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
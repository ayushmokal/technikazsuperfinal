import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

interface ProductImageProps {
  imageUrl: string;
  productName: string;
}

export function ProductImage({ imageUrl, productName }: ProductImageProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-2">
        <AspectRatio ratio={1}>
          <img
            src={imageUrl}
            alt={productName}
            className="object-contain w-full h-full"
          />
        </AspectRatio>
      </CardContent>
    </Card>
  );
}
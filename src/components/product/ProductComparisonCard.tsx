import { Button } from "@/components/ui/button";
import { MobileProduct, LaptopProduct } from "@/types/product";

interface ProductComparisonCardProps {
  product: MobileProduct | LaptopProduct;
  onCompare: (product: MobileProduct | LaptopProduct) => void;
  isSelected: boolean;
}

export function ProductComparisonCard({ product, onCompare, isSelected }: ProductComparisonCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <img
        src={product.image_url || "/placeholder.svg"}
        alt={product.name}
        className="w-full h-32 object-contain mb-2"
      />
      <h4 className="font-medium text-sm">{product.name}</h4>
      <p className="text-sm text-muted-foreground mb-2">₹{product.price.toLocaleString()}</p>
      <Button
        variant={isSelected ? "secondary" : "default"}
        className="w-full"
        onClick={() => onCompare(product)}
        disabled={isSelected}
      >
        {isSelected ? "Added" : "Add to Compare"}
      </Button>
    </div>
  );
}
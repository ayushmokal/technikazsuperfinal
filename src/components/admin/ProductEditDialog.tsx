import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import type { ProductFormData } from "@/schemas/productSchemas";

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image_url?: string;
  display_specs: string;
  processor: string;
  ram: string;
  storage: string;
  battery: string;
  camera?: string;
  os?: string;
  chipset?: string;
  color?: string;
  graphics?: string;
  ports?: string;
  model_name?: string;
  resolution?: string;
  screen_size?: string;
  charging_specs?: string;
}

interface ProductEditDialogProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
  productType: 'mobile' | 'laptop';
}

export function ProductEditDialog({ product, onClose, onSuccess, productType }: ProductEditDialogProps) {
  if (!product) return null;

  return (
    <Dialog open={!!product} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          initialData={product}
          onSuccess={onSuccess}
          productType={productType}
        />
      </DialogContent>
    </Dialog>
  );
}
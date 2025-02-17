import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CompareSection } from "./CompareSection";
import { MobileProduct, LaptopProduct } from "@/types/product";

interface CompareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentProduct: MobileProduct | LaptopProduct;
  type: 'mobile' | 'laptop';
}

export function CompareDialog({ isOpen, onClose, currentProduct, type }: CompareDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare {currentProduct.name} with Other Products</DialogTitle>
        </DialogHeader>
        <CompareSection currentProduct={currentProduct} type={type} />
      </DialogContent>
    </Dialog>
  );
}
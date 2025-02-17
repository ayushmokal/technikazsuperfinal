import { Button } from "@/components/ui/button";
import { Image as LucideImage, Star, FileText, BookOpen, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductImage } from "./ProductImage";
import type { MobileProduct, LaptopProduct } from "@/types/product";

interface ProductTableProps {
  products: (MobileProduct | LaptopProduct)[];
  onView: (product: MobileProduct | LaptopProduct) => void;
  onAddReview: (product: MobileProduct | LaptopProduct) => void;
  onAddDetailedReview: (product: MobileProduct | LaptopProduct) => void;
  onDelete: (id: string) => void;
  onTogglePopular: (product: MobileProduct | LaptopProduct) => void;
  onUpdateImages: (product: MobileProduct | LaptopProduct) => void;
  type: 'mobile' | 'laptop';
}

export function ProductTable({
  products,
  onView,
  onAddReview,
  onAddDetailedReview,
  onDelete,
  onTogglePopular,
  onUpdateImages,
  type
}: ProductTableProps) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.image_url && (
                  <div className="w-16 h-16">
                    <ProductImage imageUrl={product.image_url} productName={product.name} />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{product.brand}</TableCell>
              <TableCell>₹{product.price.toLocaleString()}</TableCell>
              <TableCell>
                <div className="flex justify-end items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onTogglePopular(product)}
                    className={`h-8 w-8 transition-colors ${product.popular ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-gray-500'}`}
                    title={product.popular ? "Remove from Popular" : "Mark as Popular"}
                  >
                    <Star className={`h-4 w-4 transition-all ${product.popular ? 'fill-current scale-110' : 'scale-100'}`} />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onView(product)}
                  >
                    View Details
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateImages(product)}
                  >
                    <LucideImage className="h-4 w-4 mr-1" />
                    Images
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddReview(product)}
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Review
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onAddDetailedReview(product)}
                  >
                    <BookOpen className="h-4 w-4 mr-1" />
                    Details
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
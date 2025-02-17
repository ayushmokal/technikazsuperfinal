import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";

interface ProsConsFieldsProps {
  items: string[];
  onItemChange: (index: number, value: string) => void;
  onAddItem: () => void;
  label: string;
}

export function ProsConsFields({ items, onItemChange, onAddItem, label }: ProsConsFieldsProps) {
  return (
    <div className="space-y-4">
      <FormLabel>{label}</FormLabel>
      {items.map((item, index) => (
        <div key={index} className="flex gap-2">
          <Input
            value={item}
            onChange={(e) => onItemChange(index, e.target.value)}
            placeholder={`${label} ${index + 1}`}
          />
          {index === items.length - 1 && (
            <Button type="button" variant="outline" onClick={onAddItem}>
              Add {label}
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
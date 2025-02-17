import { Separator } from "@/components/ui/separator";

interface SpecificationGroup {
  title: string;
  specs: { label: string; value: string | null | undefined }[];
}

interface ProductSpecTableProps {
  specifications: SpecificationGroup[];
}

export function ProductSpecTable({ specifications }: ProductSpecTableProps) {
  return (
    <div className="w-full rounded-md border p-4">
      <div className="space-y-6">
        {specifications.map((group, index) => (
          <div key={index}>
            <h3 className="font-semibold mb-2">{group.title}</h3>
            <div className="space-y-2">
              {group.specs.map((spec, specIndex) => (
                <div key={specIndex} className="flex justify-between">
                  <span className="text-muted-foreground">{spec.label}</span>
                  <span>{spec.value || 'N/A'}</span>
                </div>
              ))}
            </div>
            {index < specifications.length - 1 && <Separator className="my-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}
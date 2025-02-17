import { Cpu, Camera, CircuitBoard, Laptop, Smartphone, MemoryStick as Memory } from "lucide-react";

interface ProductKeySpecsProps {
  type?: 'mobile' | 'laptop';
  screenSize?: string;
  camera?: string;
  processor: string;
  ram: string;
  graphics?: string;
}

export function ProductKeySpecs({ 
  type = 'mobile',
  screenSize,
  camera,
  processor,
  ram,
  graphics
}: ProductKeySpecsProps) {
  return (
    <div className="grid grid-cols-4 gap-8 py-8 border-y">
      <div className="flex flex-col items-center text-center">
        {type === 'mobile' ? 
          <Smartphone className="h-10 w-10 mb-4 text-primary stroke-1" /> :
          <Laptop className="h-10 w-10 mb-4 text-primary stroke-1" />
        }
        <span className="text-sm font-medium">{screenSize || "Display"}</span>
      </div>
      
      {type === 'mobile' ? (
        <div className="flex flex-col items-center text-center">
          <Camera className="h-10 w-10 mb-4 text-primary stroke-1" />
          <span className="text-sm font-medium line-clamp-2">{camera || "Camera"}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <CircuitBoard className="h-10 w-10 mb-4 text-primary stroke-1" />
          <span className="text-sm font-medium line-clamp-2">{graphics || "Graphics"}</span>
        </div>
      )}
      
      <div className="flex flex-col items-center text-center">
        <Cpu className="h-10 w-10 mb-4 text-primary stroke-1" />
        <span className="text-sm font-medium line-clamp-2">{processor}</span>
      </div>
      
      <div className="flex flex-col items-center text-center">
        <Memory className="h-10 w-10 mb-4 text-primary stroke-1" />
        <span className="text-sm font-medium line-clamp-2">{ram}</span>
      </div>
    </div>
  );
}
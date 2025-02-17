import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, X } from "lucide-react";

export function SocialLinks() {
  return (
    <div className="flex gap-1 sm:gap-2">
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
        <Facebook className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
        <Twitter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
        <Instagram className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-primary">
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
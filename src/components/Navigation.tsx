import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Logo } from "./navigation/Logo";
import { SocialLinks } from "./navigation/SocialLinks";
import { SearchBar } from "./navigation/SearchBar";
import { MobileMenu } from "./navigation/MobileMenu";
import { DesktopMenu } from "./navigation/DesktopMenu";
import { useAnalytics } from "@/context/AnalyticsContext";

export function Navigation() {
  const { trackEvent } = useAnalytics();

  const handleContactClick = () => {
    trackEvent({
      action: 'contact_click',
      category: 'navigation',
      label: 'header_contact_button'
    });
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-black text-white py-1 sm:py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <SocialLinks />
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden sm:block text-white hover:text-white/90"
            onClick={handleContactClick}
          >
            <Link to="/contact">Contact</Link>
          </Button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          <div className="flex items-center gap-2 sm:gap-4">
            <MobileMenu />
            <Logo />
          </div>
          
          <DesktopMenu />
          
          <div className="flex items-center gap-2 sm:gap-4">
            <SearchBar />
          </div>
        </div>
      </div>
    </nav>
  );
}
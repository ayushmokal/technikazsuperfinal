import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  mainImage: string | null;
  productName: string;
  galleryImages?: string[] | null;
}

export function ProductSidebar({ 
  activeSection, 
  onSectionChange, 
  mainImage, 
  productName,
  galleryImages = []
}: ProductSidebarProps) {
  const [currentSection, setCurrentSection] = useState('overview');
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'overview', label: 'Overview' },
    { id: 'review', label: 'Expert Review' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'comparison', label: 'Comparison' },
    { id: 'user-reviews', label: 'User Reviews' },
    { id: 'pictures', label: 'Pictures' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          let currentActiveSection = sections[0].id;
          let maxVisibility = 0;

          sections.forEach(section => {
            const element = document.getElementById(section.id);
            if (element) {
              const rect = element.getBoundingClientRect();
              const total = rect.height;
              const visible = Math.min(rect.bottom, window.innerHeight) - 
                            Math.max(rect.top, 0);
              
              const visibilityRatio = visible / total;
              
              if (visibilityRatio > maxVisibility) {
                maxVisibility = visibilityRatio;
                currentActiveSection = section.id;
              }
            }
          });

          if (currentSection !== currentActiveSection) {
            setCurrentSection(currentActiveSection);
            onSectionChange(currentActiveSection);
          }

          // Update sidebar position
          if (sidebarRef.current) {
            const scrollY = window.scrollY;
            const sidebar = sidebarRef.current;
            
            // Get the content area boundaries
            const contentArea = document.getElementById('product-content');
            if (contentArea) {
              const contentRect = contentArea.getBoundingClientRect();
              const sidebarRect = sidebar.getBoundingClientRect();
              const headerOffset = 96; // 24px * 4 for top-24
              
              // Calculate the maximum scroll position
              const maxScroll = contentRect.bottom - sidebarRect.height - headerOffset;
              
              // Apply smooth transition
              sidebar.style.transition = 'transform 0.3s ease-out';
              
              if (scrollY <= headerOffset) {
                sidebar.style.transform = 'translateY(0)';
              } else if (scrollY > maxScroll) {
                sidebar.style.transform = `translateY(${maxScroll - headerOffset}px)`;
              } else {
                sidebar.style.transform = `translateY(${scrollY - headerOffset}px)`;
              }
            }

            lastScrollY.current = scrollY;
          }

          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections, currentSection, onSectionChange]);

  const handleSectionClick = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div 
      ref={sidebarRef}
      className="w-48 space-y-0 fixed left-auto top-24 max-h-[calc(100vh-6rem)] overflow-y-auto will-change-transform"
      style={{
        position: 'fixed',
        top: '96px', // 24px * 4
        zIndex: 10
      }}
    >
      <Tabs
        value={currentSection}
        onValueChange={handleSectionClick}
        orientation="vertical"
        className="w-full"
      >
        <TabsList className="flex flex-col rounded-none border-l border-border bg-transparent p-0 w-full">
          {sections.map((section) => (
            <TabsTrigger
              key={section.id}
              value={section.id}
              className={cn(
                "relative w-full justify-start rounded-none after:absolute after:inset-y-0 after:start-0 after:w-0.5",
                "data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary",
                "hover:bg-gray-50 transition-colors"
              )}
            >
              {section.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
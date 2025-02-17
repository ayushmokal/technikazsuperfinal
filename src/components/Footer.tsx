import { useState } from "react";
import { Link } from "react-router-dom";
import { Instagram, Facebook, Linkedin, Twitter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAnalytics } from "@/context/AnalyticsContext";

export function Footer() { 
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { trackEvent } = useAnalytics();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('newsletter_subscribers')
        .insert([{ email }]);

      if (error) throw error;

      trackEvent({
        action: 'newsletter_signup',
        category: 'engagement',
        label: 'footer_signup'
      });

      toast({
        title: "Success",
        description: "Thank you for subscribing to our newsletter!",
      });
      
      setEmail("");
    } catch (error: any) {
      console.error('Error subscribing to newsletter:', error);
      
      if (error.code === '23505') { // Unique violation
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to subscribe. Please try again later",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialClick = (platform: string) => {
    trackEvent({
      action: 'social_click',
      category: 'engagement',
      label: platform
    });
  };

  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 py-12 gap-8 lg:gap-12">
          {/* Logo and Newsletter - Left Column */}
          <div className="space-y-6">
            <Link to="/" className="block">
              <img 
                src="/logo.png"   
                alt="Technikaz" 
                className="h-20 w-auto hover:opacity-80 transition-opacity"
              />
            </Link>
            
            <form onSubmit={handleNewsletterSignup} className="relative max-w-md">
              <input
                type="email"
                placeholder="Sign-Up For Newsletters"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 rounded-lg bg-white/10 text-white placeholder:text-gray-400 border border-white/20 focus:outline-none focus:border-white/40 transition-colors"
                disabled={isSubmitting}
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="absolute right-1 top-1 h-10 px-6 bg-[#00897B] text-white rounded-lg font-medium hover:bg-[#007A6D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "..." : "GO"}
              </button>
            </form>
          </div>

          {/* Links and Company Sections - Middle and Right Columns */}
          <div className="grid grid-cols-2 gap-8 lg:col-span-2">
            {/* Links Column */}
            <div>
              <h3 className="text-[#00E0FF] font-medium mb-6 text-lg">Links</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/games" className="hover:text-[#00E0FF] transition-colors">Games</Link>
                </li>
                <li>
                  <Link to="/tech" className="hover:text-[#00E0FF] transition-colors">Tech</Link>
                </li>
                <li>
                  <Link to="/entertainment" className="hover:text-[#00E0FF] transition-colors">Entertainment</Link>
                </li>
                <li>
                  <Link to="/gadgets" className="hover:text-[#00E0FF] transition-colors">Gadgets</Link>
                </li>
                <li>
                  <Link to="/stocks" className="hover:text-[#00E0FF] transition-colors">Stocks</Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-[#00E0FF] font-medium mb-6 text-lg">Company</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/about" className="hover:text-[#00E0FF] transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-[#00E0FF] transition-colors">Contact Us</Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[#00E0FF] transition-colors">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[#00E0FF] transition-colors">Terms & Conditions</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section with Social Links and Copyright */}
        <div className="border-t border-white/10 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Social Links */}
            <div className="flex gap-4">
              <Link 
                to="#" 
                className="hover:text-[#00E0FF] transition-colors p-2 hover:bg-white/5 rounded-full"
                aria-label="Instagram"
                onClick={() => handleSocialClick('instagram')}
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                className="hover:text-[#00E0FF] transition-colors p-2 hover:bg-white/5 rounded-full"
                aria-label="Facebook"
                onClick={() => handleSocialClick('facebook')}
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                className="hover:text-[#00E0FF] transition-colors p-2 hover:bg-white/5 rounded-full"
                aria-label="LinkedIn"
                onClick={() => handleSocialClick('linkedin')}
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link 
                to="#" 
                className="hover:text-[#00E0FF] transition-colors p-2 hover:bg-white/5 rounded-full"
                aria-label="Twitter"
                onClick={() => handleSocialClick('twitter')}
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-sm text-gray-400">
              @2024 -25 Technikaz All Rights Reserved
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
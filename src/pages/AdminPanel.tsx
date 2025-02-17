import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { BlogForm } from "@/components/admin/BlogForm";
import { ProductForm } from "@/components/admin/ProductForm";
import { BlogAnalytics } from "@/components/admin/BlogAnalytics";
import { BlogManager } from "@/components/admin/BlogManager";
import { ProductManager } from "@/components/admin/ProductManager";
import { MaintenanceControl } from "@/components/admin/MaintenanceControl";
import { NewsletterSubscribers } from "@/components/admin/NewsletterSubscribers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Folders, Smartphone, Star } from "lucide-react";
import { type Category, categories } from "@/types/blog";
import { LogsSection } from "@/components/admin/LogsSection";
import { AmazonAdManager } from "@/components/admin/AmazonAdManager";

export default function AdminPanel() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRole, setUserRole] = useState<'admin' | 'content_creator' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCategories, setShowCategories] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [productType, setProductType] = useState<'mobile' | 'laptop' | null>(null);

  const checkUserRole = useCallback(async (email: string) => {
    if (email === 'user1@admin.com') {
      return 'content_creator';
    }
    return 'admin';
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/admin/login");
        return;
      }

      const role = await checkUserRole(session.user.email);
      setUserRole(role);
      setIsLoading(false);
    };

    initializeAuth();
  }, [navigate, checkUserRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Content creator only sees the blog creation tab
  if (userRole === 'content_creator') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Content Creator Panel</h1>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-6 text-left">Create New Blog Post</h2>
            <BlogForm />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-left">Admin Panel</h1>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowCategories(!showCategories);
                setShowProducts(false);
                setSelectedCategory(null);
                setProductType(null);
              }}
            >
              <Folders className="h-4 w-4" />
              Manage All Categories
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                setShowProducts(!showProducts);
                setShowCategories(false);
                setSelectedCategory(null);
                setProductType(null);
              }}
            >
              <Smartphone className="h-4 w-4" />
              Manage Products
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/admin/popular-products')}
            >
              <Star className="h-4 w-4" />
              Popular Products
            </Button>
          </div>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        
        {showCategories ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-left">
                {selectedCategory ? `${selectedCategory} Category Management` : 'Category Management'}
              </h2>
              {selectedCategory ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                    Back to Categories
                  </Button>
                  <Button variant="outline" onClick={() => setShowCategories(false)}>
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowCategories(false)}>
                  Back to Dashboard
                </Button>
              )}
            </div>
            
            {selectedCategory ? (
              <BlogManager selectedCategory={selectedCategory} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(Object.keys(categories) as Category[]).map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-24 text-lg font-semibold text-left"
                    onClick={() => setSelectedCategory(category)}
                  >
                    Manage {category}
                  </Button>
                ))}
              </div>
            )}
          </div>
        ) : showProducts ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-left">
                {productType ? `${productType === 'mobile' ? 'Mobile Phones' : 'Laptops'} Management` : 'Product Management'}
              </h2>
              {productType ? (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setProductType(null)}>
                    Back to Products
                  </Button>
                  <Button variant="outline" onClick={() => setShowProducts(false)}>
                    Back to Dashboard
                  </Button>
                </div>
              ) : (
                <Button variant="outline" onClick={() => setShowProducts(false)}>
                  Back to Dashboard
                </Button>
              )}
            </div>
            
            {productType ? (
              <ProductManager productType={productType} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-24 text-lg font-semibold text-left"
                  onClick={() => setProductType('mobile')}
                >
                  Manage Mobile Phones
                </Button>
                <Button
                  variant="outline"
                  className="h-24 text-lg font-semibold text-left"
                  onClick={() => setProductType('laptop')}
                >
                  Manage Laptops
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Tabs defaultValue="analytics" className="space-y-6">
            <TabsList className="justify-start">
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="create-blog">Create Blog</TabsTrigger>
              <TabsTrigger value="add-product">Add Product</TabsTrigger>
              <TabsTrigger value="expert-reviews">Expert Reviews</TabsTrigger>
              <TabsTrigger value="amazon-ads">Amazon Ads</TabsTrigger>
              <TabsTrigger value="newsletter">Newsletter</TabsTrigger>
              <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
              <TabsTrigger value="logs">Logs</TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Blog Analytics</h2>
              <BlogAnalytics />
            </TabsContent>

            <TabsContent value="create-blog" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Create New Blog Post</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <BlogForm />
              </div>
            </TabsContent>

            <TabsContent value="add-product" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Add New Product</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <ProductForm />
              </div>
            </TabsContent>

            <TabsContent value="expert-reviews" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Manage Expert Reviews</h2>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Mobile Reviews</h3>
                    <ProductManager productType="mobile" />
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Laptop Reviews</h3>
                    <ProductManager productType="laptop" />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="amazon-ads" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Amazon Product Advertising</h2>
              <AmazonAdManager />
            </TabsContent>

            <TabsContent value="newsletter" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Newsletter Subscribers</h2>
              <NewsletterSubscribers />
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Site Maintenance</h2>
              <MaintenanceControl />
            </TabsContent>

            <TabsContent value="logs" className="space-y-4">
              <h2 className="text-xl font-semibold text-left">Activity Logs</h2>
              <LogsSection />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
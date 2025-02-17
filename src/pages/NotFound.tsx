import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <Layout>
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <img
              src="/lovable-uploads/8ab86c2e-aa15-4f34-83bb-77020393dbea.png"
              alt="404 Error"
              className="w-64 mx-auto mb-8 animate-bounce"
            />
            <h1 className="text-3xl font-bold mb-4">
              Ouch, looks like you found our 404 page
            </h1>
            <p className="text-gray-600 mb-8">
              This is not an error, just an unintentional accident. So, we're pretty sure that this is not the page that you were looking for. Apologies from Team Technikaz.
            </p>
            <Button asChild>
              <Link to="/">
                Go to homepage
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </Layout>
  );
}
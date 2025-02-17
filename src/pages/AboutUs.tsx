import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6">We are a team of content writers who share their learnings</h1>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <div className="relative">
              <img 
                src="/lovable-uploads/ff33cfce-1cae-4840-a5f3-dd58a9c83b89.png"
                alt="Team together"
                className="w-full rounded-lg mb-8"
              />
              {/* Stats overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-primary bg-opacity-90 text-white p-6 flex justify-around items-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">100+</div>
                  <div className="text-sm">Blogs Published</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">18K+</div>
                  <div className="text-sm">Views on Freewet</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">30K+</div>
                  <div className="text-sm">Total active Users</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div>
                <h3 className="text-xl font-bold mb-4">OUR MISSION</h3>
                <h2 className="text-3xl font-bold mb-4">Creating valuable content for creatives all around the world</h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">OUR VISION</h3>
                <h2 className="text-3xl font-bold mb-4">A platform that empowers individuals to improve</h2>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our team of creatives</h2>
              <p className="text-gray-600 mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
              </p>
              <p className="text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>
            <div>
              <img 
                src="/lovable-uploads/65c084cf-741d-447d-b97c-8ab1210f5cd4.png" 
                alt="Team hands together" 
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </section>

        {/* Why we started */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <div>
                <img 
                  src="/lovable-uploads/b3c28543-1867-465f-87ad-2cb22320d66b.png" 
                  alt="Team discussion" 
                  className="rounded-lg w-full"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4">Why we started this Blog</h2>
                <p className="text-gray-600 mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
                </p>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Team Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Join our team to be a part of our story</h2>
            <p className="text-gray-600 mb-8">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.
            </p>
            <Button className="bg-primary text-white px-8 py-2">Join Now</Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
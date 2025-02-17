import { Layout } from "@/components/Layout";

export default function TermsAndConditions() {
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section with Light Blue Background */}
        <div className="bg-[#E5F3F3] py-16 mb-12">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-center text-gray-600">Last Updated on 27th January 2022</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 max-w-4xl mb-20">
          <div className="space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Lorem ipsum dolor sit amet</h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut 
                aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum 
                dolore eu fugiat nulla pariatur Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra 
                mauris in aliquam sem. At risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis 
                parturient montes. Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas 
                diam. Risus in hendrerit gravida rutrum quisque non. Sit amet nulla facilisi morbi tempus iaculis urna. 
                Lorem sed risus ultricies tristique nulla aliquet enim. Volutpat blandit aliquam etiam erat velit. Orci eu 
                lobortis elementum nibh. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla. 
                Neque convallis a cras semper auctor neque vitae tempus quam.
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At 
                risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes. 
                Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas diam. Risus in 
                hendrerit gravida rutrum quisque non. Sit amet nulla facilisi morbi tempus iaculis urna. Lorem sed 
                risus ultricies tristique nulla aliquet enim. Volutpat blandit aliquam etiam erat velit. Orci eu lobortis 
                elementum nibh. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Neque 
                convallis a cras semper auctor neque vitae tempus quam.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore 
                et dolore magna aliqua. Non blandit massa enim nec. Scelerisque viverra mauris in aliquam sem. At 
                risus viverra adipiscing at in tellus. Sociis natoque penatibus et magnis dis parturient montes. 
                Ridiculus mus mauris vitae ultricies leo. Neque egestas congue quisque egestas diam. Risus in 
                hendrerit gravida rutrum quisque non. Sit amet nulla facilisi morbi tempus iaculis urna. Lorem sed 
                risus ultricies tristique nulla aliquet enim. Volutpat blandit aliquam etiam erat velit. Orci eu lobortis 
                elementum nibh. Ipsum suspendisse ultrices gravida dictum fusce ut placerat orci nulla. Neque 
                convallis a cras semper auctor neque vitae tempus quam.
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
}
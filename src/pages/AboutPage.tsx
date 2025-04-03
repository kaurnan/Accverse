
import { CheckCircle, Users, Lightbulb, Handshake } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Accverse</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eius veniam hic illum dolorum eveniet, maxime perferendis corporis quisquam tenetur voluptate!        
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat saepe consequatur, assumenda perspiciatis maiores nihil vero? Optio minus earum magnam dolorum aut harum quae voluptate sequi, sit pariatur incidunt labore, animi commodi corrupti? Eius, nostrum sit.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ex adipisci voluptatibus veniam sint distinctio eligendi quidem est obcaecati dignissimos! Totam incidunt facere tenetur repellat nihil alias ex ut temporibus, doloremque illum odio!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Quality */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality</h3>
            <p className="text-gray-600">
              We provide premium quality services that add value to your business.
            </p>
          </div>

          {/* Teamwork */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Users className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Teamwork</h3>
            <p className="text-gray-600">
              “Together we are strong” – we work closely with you as your own team to grow together.
            </p>
          </div>

          {/* Innovation */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Lightbulb className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              We understand the ever-changing needs of your business, embrace them, and constantly learn & innovate.
            </p>
          </div>

          {/* Customer Experience */}
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <div className="flex justify-center mb-4">
              <Handshake className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Experience</h3>
            <p className="text-gray-600">
              We are open and honest in our communication and committed to our customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;

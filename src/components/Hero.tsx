import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from './AuthContext';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="relative bg-gradient-to-r from-blue-900 to-blue-700 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              Expert Accounting & Tax Solutions for Your Financial Success
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              We provide comprehensive accounting and tax services to help individuals and businesses navigate financial complexities with confidence.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-2 mt-0.5" />
                <p className="text-blue-100">Personalized tax strategies to minimize liabilities</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-2 mt-0.5" />
                <p className="text-blue-100">Virtual CFO services for business growth</p>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-blue-300 mr-2 mt-0.5" />
                <p className="text-blue-100">Secure client portal for document management</p>
              </div>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/booking" 
                    className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
                  >
                    Book New Appointment
                  </Link>
                </>
              ) : (
                <>
                  <Link 
                    to="/booking" 
                    className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors flex items-center justify-center"
                  >
                    Book a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors flex items-center justify-center"
                  >
                    View Pricing Plans
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden lg:block">
            <img 
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="Professional accounting services" 
              className="rounded-lg shadow-2xl object-cover h-[500px] w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;

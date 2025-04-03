import React from 'react';
// import { Link } from 'react-router-dom';
import { Calculator, Shield } from 'lucide-react';
import LoginForm from '../components/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="hidden lg:block">
            <div className="bg-blue-700 rounded-xl p-12 text-white relative overflow-hidden">
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
              
              <div className="relative z-10">
                <div className="flex items-center mb-8">
                  <Calculator className="h-10 w-10 text-blue-300" />
                  <span className="ml-3 text-2xl font-bold">Accverse</span>
                </div>
                
                <h2 className="text-3xl font-bold mb-6">Client Portal Access</h2>
                <p className="text-xl text-blue-100 mb-8">
                  Securely access your financial documents, track your tax returns, and communicate with your accountant.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-blue-300 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg">Secure Document Storage</h3>
                      <p className="text-blue-100">Upload and store your financial documents securely in one place.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-blue-300 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg">Real-time Updates</h3>
                      <p className="text-blue-100">Track the status of your tax returns and accounting work in real-time.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Shield className="h-6 w-6 text-blue-300 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-lg">Secure Messaging</h3>
                      <p className="text-blue-100">Communicate directly with your accountant through our secure platform.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white py-8 px-6 shadow-lg sm:rounded-lg sm:px-10 max-w-md mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                <p className="mt-2 text-gray-600">
                  Access your documents, messages, and account information
                </p>
              </div>
              
              <LoginForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

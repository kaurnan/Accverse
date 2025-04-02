import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, Calculator } from 'lucide-react';
import { useAuth } from './AuthContext';

const Footer = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Calculator className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">TaxPro Solutions</span>
            </div>
            <p className="text-gray-400 mb-4">
              Professional accounting and tax services for individuals and businesses. We help you navigate the complex world of finance with ease.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-blue-400" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-blue-400" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-blue-400" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-blue-400" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-blue-400">About Us</Link>
              </li>
              <li>
                <Link to="/accounting-services" className="text-gray-400 hover:text-blue-400">Accounting Solutions</Link>
              </li>
              <li>
                <Link to="/tax-services" className="text-gray-400 hover:text-blue-400">Tax Solutions</Link>
              </li>
              <li>
                <Link to="/training" className="text-gray-400 hover:text-blue-400">Online Training</Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-blue-400">Pricing</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-blue-400">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/insights?type=blogs" className="text-gray-400 hover:text-blue-400">Blogs</Link>
              </li>
              <li>
                <Link to="/insights?type=newsletters" className="text-gray-400 hover:text-blue-400">Newsletters</Link>
              </li>
              <li>
                <Link to="/insights?type=podcasts" className="text-gray-400 hover:text-blue-400">Podcasts</Link>
              </li>
              <li>
                <Link to="/insights?type=webinars" className="text-gray-400 hover:text-blue-400">Webinars</Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-blue-400">Book Appointment</Link>
              </li>
              <li>
                {isAuthenticated ? (
                  <Link to="/dashboard" className="text-gray-400 hover:text-blue-400">Client Dashboard</Link>
                ) : (
                  <Link to="/login" className="text-gray-400 hover:text-blue-400">Client Portal</Link>
                )}
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-blue-400 mr-2 mt-0.5" />
                <span className="text-gray-400">123 Finance Street, Sydney NSW 2000, Australia</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-400">+61 2 1234 5678</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-400 mr-2" />
                <span className="text-gray-400">info@taxprosolutions.com.au</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} TaxPro Solutions. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6 text-sm">
                <li>
                  <Link to="/privacy-policy" className="text-gray-400 hover:text-blue-400">Privacy Policy</Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="text-gray-400 hover:text-blue-400">Terms of Service</Link>
                </li>
                <li>
                  <Link to="/sitemap" className="text-gray-400 hover:text-blue-400">Sitemap</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

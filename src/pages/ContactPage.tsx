import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactPage = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions or need assistance? Our team is here to help. Reach out to us through any of the channels below.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <ContactForm />
            </div>
            
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
              <h3 className="text-lg font-medium text-blue-800 mb-4">Our Response Commitment</h3>
              <p className="text-blue-700">
                We aim to respond to all inquiries within 24 business hours. For urgent matters, please call us directly.
              </p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Office Location</h3>
                    <p className="mt-2 text-gray-600">
                      123 Finance Street<br />
                      Sydney NSW 2000<br />
                      Australia
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Phone className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                    <p className="mt-2 text-gray-600">
                      Main: +61 2 1234 5678<br />
                      Toll-free: 1800 TAX PRO
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email</h3>
                    <p className="mt-2 text-gray-600">
                      General Inquiries: info@Accverse.com.au<br />
                      Support: support@Accverse.com.au<br />
                      New Business: sales@Accverse.com.au
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                    <p className="mt-2 text-gray-600">
                      Monday - Friday: 9:00 AM - 5:30 PM<br />
                      Saturday: 10:00 AM - 2:00 PM (by appointment)<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Connect With Us</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <a 
                  href="https://facebook.com" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Facebook className="h-6 w-6 text-blue-600 mr-3" />
                  <span className="text-gray-700">Facebook</span>
                </a>
                
                <a 
                  href="https://twitter.com" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Twitter className="h-6 w-6 text-blue-400 mr-3" />
                  <span className="text-gray-700">Twitter</span>
                </a>
                
                <a 
                  href="https://instagram.com" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Instagram className="h-6 w-6 text-pink-600 mr-3" />
                  <span className="text-gray-700">Instagram</span>
                </a>
                
                <a 
                  href="https://linkedin.com" 
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Linkedin className="h-6 w-6 text-blue-700 mr-3" />
                  <span className="text-gray-700">LinkedIn</span>
                </a>
              </div>
              
              <div className="mt-6">
                <p className="text-gray-600">
                  Follow us on social media for tax tips, financial insights, and company updates.
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="aspect-w-16 aspect-h-9 h-64">
                {/* This would be replaced with an actual Google Maps embed */}
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                  Google Maps Embed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
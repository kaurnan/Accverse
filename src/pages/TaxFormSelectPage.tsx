import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/card';

const TaxFormSelectPage = () => {
  const formTemplates = [
    {
      id: 'individual',
      title: 'NEW CLIENT TAX CHECKLIST',
      subtitle: 'For Individuals & Sole Traders',
      description: 'Complete this form if you are an individual or sole trader requiring tax return services.',
      path: '/tax-solutions'
    },
    {
      id: 'business',
      title: 'NEW BUSINESS CLIENT FORM',
      subtitle: 'For Companies, Trusts & Partnerships',
      description: 'Complete this form if you have a business entity such as a company, trust, or partnership.',
      path: '/tax-solutions/business'
    },
    {
      id: 'smsf',
      title: 'NEW SMSF CLIENT FORM',
      subtitle: 'For Self-Managed Superannuation Funds',
      description: 'Complete this form if you have a self-managed superannuation fund requiring compliance services.',
      path: '/tax-solutions/smsf'
    },
    {
      id: 'engagement',
      title: 'ENGAGEMENT LETTER',
      subtitle: 'For All Business Clients',
      description: 'Required engagement letter for all business clients to formalize our services.',
      path: '/tax-solutions/engagement'
    },
    {
      id: 'smsf-establishment',
      title: 'SMSF ESTABLISHMENT FORM',
      subtitle: 'Set up a new Self-Managed Superannuation Fund',
      description: 'Complete this form to establish a new Self-Managed Superannuation Fund.',
      path: '/tax-solutions/smsf-establishment'
    },
    {
      id: 'company-registration',
      title: 'COMPANY REGISTRATION CHECKLIST',
      subtitle: 'Register a new company',
      description: 'Complete this checklist to register a new company.',
      path: '/tax-solutions/company-registration'
    }
  ];

  return (
    <div className="container my-8 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Tax Solutions</h1>
      <p className="text-center text-gray-600 mb-8">Select the appropriate form for your tax needs</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {formTemplates.map((template) => (
          <Link to={template.path} key={template.id} className="block">
            <Card className="h-full hover:shadow-lg transition-shadow duration-300">
              <div className="p-6 flex flex-col h-full">
                <div className="bg-blue-600 text-white p-3 rounded-t-lg -mt-6 -mx-6 mb-4">
                  <h2 className="text-lg font-semibold">{template.title}</h2>
                </div>
                <h3 className="font-medium text-gray-700 mb-2">{template.subtitle}</h3>
                <p className="text-gray-600 text-sm flex-grow">{template.description}</p>
                <div className="mt-4">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded transition-colors">
                    Select Form
                  </button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TaxFormSelectPage;
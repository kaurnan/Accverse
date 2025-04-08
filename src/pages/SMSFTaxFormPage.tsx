import React from 'react';
import { Link } from 'react-router-dom';
import SMSFTaxForm from '../components/tax-form/SMSFTaxForm';
import { Button } from '../components/ui/button';

const SMSFTaxFormPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4 flex items-center">
        <Link to="/tax-forms">
          <Button variant="outline" className="mr-4">
            ← Back to Forms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">New SMSF Client Form</h1>
          <p className="text-gray-600">Self-Managed Superannuation Fund</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to complete this form</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <p className="mb-4">The following tips help you complete this form correctly & efficiently:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Complete this form for each entity if you need us to act for multiple SMSFs.</li>
              <li>Answer all applicable questions by selecting "Yes" or "No" in the dropbox, provide details & upload supporting documents. Drag & drop if you're using a desktop computer, otherwise, locate relevant files & upload via mobile or desktop.</li>
              <li>Identify and provide the information we need to prepare your SMSF Financial Statements.</li>
              <li>Minimise the queries from us during the preparation of your Financial Statements.</li>
              <li>Please send us the relevant documents for all the investments in your SMSF.</li>
            </ul>
          </div>
        </div>
        
        <SMSFTaxForm />
      </div>
    </div>
  );
};

export default SMSFTaxFormPage;
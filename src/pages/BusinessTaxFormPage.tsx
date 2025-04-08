import React from 'react';
import { Link } from 'react-router-dom';
import BusinessTaxForm from '../components/tax-form/BusinessTaxForm';
import { Button } from '../components/ui/button';

const BusinessTaxFormPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4 flex items-center">
        <Link to="/tax-forms">
          <Button variant="outline" className="mr-4">
            ← Back to Forms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">New Business Client Form</h1>
          <p className="text-gray-600">For Companies, Trusts & Partnerships</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to complete this form</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <ol className="list-decimal pl-5 space-y-2">
              <li>New Business Client? Kindly Nominate us as your Tax & GST agent by following the steps via this link. It is an ATO requirement effective from 13/11/2023.</li>
              <li>The following guide helps you complete this form correctly & efficiently. Please Do not rush/submit insufficient information. You can 'SAVE' and 'RESUME' the form anytime.</li>
              <li>Complete this form for each entity per financial year, if you need us to act for multiple entities.</li>
              <li>Answer all applicable questions by selecting "Yes" or "No" in the dropbox, provide details & upload supporting documents.</li>
              <li>This letter is to be submitted in conjunction with our Engagement Letter.</li>
            </ol>
          </div>
        </div>
        
        <BusinessTaxForm />
      </div>
    </div>
  );
};

export default BusinessTaxFormPage;
import React from 'react';
import { Link } from 'react-router-dom';
import CompanyRegistrationForm from '../components/tax-form/CompanyRegistrationForm';
import { Button } from '../components/ui/button';

const CompanyRegistrationPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4 flex items-center">
        <Link to="/tax-forms">
          <Button variant="outline" className="mr-4">
            ← Back to Forms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Company Registration Checklist</h1>
          <p className="text-gray-600">Register a new company</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to completing this form</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <p className="mb-4">This form collects the information needed to register a new company with ASIC and apply for an ABN.</p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Provide complete and accurate information for all company details.</li>
              <li>Ensure you include all required officeholder and shareholder information.</li>
              <li>Upload identification documents for all directors and shareholders.</li>
              <li>Review all information carefully before submission to avoid processing delays.</li>
            </ol>
          </div>
        </div>
        
        <CompanyRegistrationForm />
      </div>
    </div>
  );
};

export default CompanyRegistrationPage;
import React from 'react';
import { Link } from 'react-router-dom';
import EngagementLetterForm from '../components/tax-form/EngagementLetterForm';
import { Button } from '../components/ui/button';

const EngagementLetterPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4 flex items-center">
        <Link to="/tax-forms">
          <Button variant="outline" className="mr-4">
            ← Back to Forms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Engagement Letter</h1>
          <p className="text-gray-600">For All Business Clients</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Important Information</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <p className="mb-4">This letter is to be submitted in conjunction with our Sole Trader / Business clients Intake Tax Checklist Forms.</p>
            <p>By signing this letter, you acknowledge and agree to the terms of engagement with Accverse for tax and accounting services.</p>
          </div>
        </div>
        
        <EngagementLetterForm />
      </div>
    </div>
  );
};

export default EngagementLetterPage;
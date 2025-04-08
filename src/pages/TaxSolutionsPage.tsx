import React from 'react';
import { Link } from 'react-router-dom';
import TaxSolutionsForm from '../components/TaxSolutionsForm';
import { Button } from '../components/ui/button';

const TaxSolutionsPage = () => {
  return (
    <div className="container my-8 max-w-4xl mx-auto px-4">
      <div className="mb-4 flex items-center">
        <Link to="/tax-forms">
          <Button variant="outline" className="mr-4">
            ← View All Tax Forms
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold mb-2">Tax Checklist</h1>
          <p className="text-gray-600">New Client Information Form - For Individuals & Sole Traders</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-t-lg">
            <h2 className="text-xl font-semibold">Guide to complete this form</h2>
          </div>
          <div className="bg-white border border-gray-200 border-t-0 p-4 rounded-b-lg">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Gather all income & proof of paid work-related expenses for the FY.</li>
              <li>Complete this checklist for each FY, starting with the oldest FY if you have overdue tax lodgements. Do not provide data for multiple people & FYs in 1 submission.</li>
              <li>Kindly be honest & provide proof of the following, if applicable:
                <ul className="list-disc pl-8 mt-1">
                  <li>Sale of cryptos, shares, ETFs, bonds, & investment properties, etc.</li>
                  <li>Contracting services: Sole trader or personal services income etc.</li>
                  <li>Investment income: Dividends, rental, interest, crypto rewards, etc.</li>
                  <li>Sharing economy income: Airbnb, Uber, Ola, Deliveroo, etc.</li>
                </ul>
              </li>
              <li>Click 'Save & Continue Later' to save your progress.</li>
              <li>Upon submission, your data will be securely stored in our database and our tax consultants will contact you within 24-48 business hours.</li>
            </ol>
          </div>
        </div>
        
        <TaxSolutionsForm />
      </div>
    </div>
  );
};

export default TaxSolutionsPage;

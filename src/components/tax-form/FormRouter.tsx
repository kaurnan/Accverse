import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import TaxSolutionsForm from '../TaxSolutionsForm';
import BusinessTaxForm from './BusinessTaxForm';
import SMSFTaxForm from './SMSFTaxForm';
import EngagementLetterForm from './EngagementLetterForm';
import SMSFEstablishmentForm from './SMSFEstablishmentForm';
import CompanyRegistrationForm from './CompanyRegistrationForm';

/**
 * Form router component that renders the appropriate form based on the form type parameter
 */
const FormRouter: React.FC = () => {
  const { formType } = useParams<{ formType: string }>();
  const navigate = useNavigate();
  
  // Render the appropriate form based on the formType
  const renderForm = () => {
    switch (formType) {
      case 'individual':
        return <TaxSolutionsForm />;
      case 'business':
        return <BusinessTaxForm />;
      case 'smsf':
        return <SMSFTaxForm />;
      case 'engagement':
        return <EngagementLetterForm />;
      case 'smsf-establishment':
        return <SMSFEstablishmentForm />;
      case 'company-registration':
        return <CompanyRegistrationForm />;
      // Additional form types can be added here
      default:
        // If no valid form type is provided, render a message and return to form selection
        return (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Invalid Form Type</h2>
            <p className="text-gray-600 mb-6">The requested form type is not available.</p>
            <Button onClick={() => navigate('/tax-forms')}>
              Return to Form Selection
            </Button>
          </div>
        );
    }
  };
  
  return renderForm();
};

export default FormRouter;
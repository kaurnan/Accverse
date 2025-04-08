import React, { useState } from 'react';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';
import FormStep1SMSF from './smsf/FormStep1SMSF';
import FormStep2SMSF from './smsf/FormStep2SMSF';
import FormStep3SMSF from './smsf/FormStep3SMSF';
import FormStep4SMSF from './smsf/FormStep4SMSF';
import FormStep5SMSF from './smsf/FormStep5SMSF';
import apiClient from '../../services/api';

// Define the form data interface for SMSF
interface SMSFFormData {
  // Part 1: SMSF Details
  smsfName: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  postcode: string;
  contactName: string;
  contactPosition: string;
  contactPhone: string;
  contactMobile: string;
  contactEmail: string;
  trusteeType: string;
  financialYear: string;
  updateAtoDetails: string;
  bankBsb: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  electronicServiceAddress: string;

  // Part 2: Member Details
  memberCount: string;
  prevAccountantName: string;
  prevAccountantContact: string;
  prevAccountantPhone: string;
  prevAccountantMobile: string;
  prevAccountantEmail: string;
  lastFinancialStatements: File | null;
  lastTaxReturn: File | null;

  // Part 3: Fund Records
  trustDeeds: File | null;
  originalFundRecords: File | null;
  memberApplication: File | null;
  trusteeConsent: File | null;
  fundInvestmentStrategy: File | null;
  rolloverStatements: File | null;

  // Part 3: Assets Details
  bankAccountCount: string;
  termDeposits: string;
  shares: string;
  shareRegistryCount: string;
  srn: string;
  unlistedShares: string;
  unlistedShareCertificate: string;
  unlistedShareFinancials: string;
  property: string;
  propertyLoanAgreement: string;
  propertyLoanStatements: string;
  propertyTitleDeed: string;
  propertySettlementStatement: string;
  propertyLeaseAgreement: string;
  propertyInsurancePolicy: string;
  propertyContractOfSale: string;
  propertyDeclarationOfCustody: string;
  preciousMetals: string;
  preciousMetalsPurchase: string;
  preciousMetalsStatements: string;
  preciousMetalsStorage: string;
  preciousMetalsInsurance: string;
  preciousMetalsBullions: string;
  preciousMetalsPhotos: string;
  cryptoCurrency: string;
  cryptoStatements: string;
  cryptoTrading: string;

  // Part 4: Income and Expense Details
  capitalGains: string;
  propertyCapitalGains: string;
  rentalIncome: string;
  trustDistribution: string;
  partnershipDistribution: string;
  dividendIncome: string;
  investmentExpenses: string;
  managementExpenses: string;
  expenseInvoices: File | null;

  // Part 5: Declaration
  signature: string;

  // Other
  formType: string;
  
  [key: string]: string | File | null;
}

const SMSFTaxForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SMSFFormData>({
    // Part 1: SMSF Details
    smsfName: '',
    streetAddress: '',
    streetAddress2: '',
    city: '',
    state: '',
    postcode: '',
    contactName: '',
    contactPosition: '',
    contactPhone: '',
    contactMobile: '',
    contactEmail: '',
    trusteeType: '',
    financialYear: '',
    updateAtoDetails: '',
    bankBsb: '',
    bankAccountNo: '',
    bankAccountName: '',
    bankName: '',
    electronicServiceAddress: '',

    // Part 2: Member Details
    memberCount: '',
    prevAccountantName: '',
    prevAccountantContact: '',
    prevAccountantPhone: '',
    prevAccountantMobile: '',
    prevAccountantEmail: '',
    lastFinancialStatements: null,
    lastTaxReturn: null,

    // Part 3: Fund Records
    trustDeeds: null,
    originalFundRecords: null,
    memberApplication: null,
    trusteeConsent: null,
    fundInvestmentStrategy: null,
    rolloverStatements: null,

    // Part 3: Assets Details
    bankAccountCount: '',
    termDeposits: '',
    shares: '',
    shareRegistryCount: '',
    srn: '',
    unlistedShares: '',
    unlistedShareCertificate: '',
    unlistedShareFinancials: '',
    property: '',
    propertyLoanAgreement: '',
    propertyLoanStatements: '',
    propertyTitleDeed: '',
    propertySettlementStatement: '',
    propertyLeaseAgreement: '',
    propertyInsurancePolicy: '',
    propertyContractOfSale: '',
    propertyDeclarationOfCustody: '',
    preciousMetals: '',
    preciousMetalsPurchase: '',
    preciousMetalsStatements: '',
    preciousMetalsStorage: '',
    preciousMetalsInsurance: '',
    preciousMetalsBullions: '',
    preciousMetalsPhotos: '',
    cryptoCurrency: '',
    cryptoStatements: '',
    cryptoTrading: '',

    // Part 4: Income and Expense Details
    capitalGains: '',
    propertyCapitalGains: '',
    rentalIncome: '',
    trustDistribution: '',
    partnershipDistribution: '',
    dividendIncome: '',
    investmentExpenses: '',
    managementExpenses: '',
    expenseInvoices: null,

    // Part 5: Declaration
    signature: '',
    
    // Other
    formType: 'smsf'
  });

  const [submitting, setSubmitting] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      // Save progress to backend
      if (formData.contactEmail) {
        handleSaveProgress();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: e.target.files ? e.target.files[0] : null
      }));
      console.log(`File selected for ${fieldName}:`, e.target.files[0]);
    }
  };

  const handleSaveProgress = async () => {
    try {
      // Create a JSON representation of the form data (without files)
      const formDataForSaving = { ...formData };
      
      // Remove file objects which can't be stringified
      Object.keys(formDataForSaving).forEach(key => {
        if (formDataForSaving[key] instanceof File) {
          formDataForSaving[key] = null;
        }
      });
      
      // Add saved form ID if available
      if (savedFormId) {
        formDataForSaving.id = savedFormId;
      }

      // Send save request to backend
      const response = await apiClient.post('/tax-solutions/save-progress', formDataForSaving);
      
      if (response.data && response.data.id) {
        setSavedFormId(response.data.id);
        toast.success('Progress saved successfully!');
      }
      
    } catch (error) {
      console.error('Error saving progress:', error);
      toast.error('Failed to save progress');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validation
      if (!formData.smsfName || !formData.contactEmail || !formData.signature) {
        toast.error('Please fill in all required fields');
        setSubmitting(false);
        return;
      }

      // Create a FormData object to handle file uploads
      const submissionData = new FormData();
      
      // Add all form fields to the FormData object
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          console.log(`Appending file for ${key}:`, value);
          submissionData.append(key, value);
        } else if (value !== null && value !== undefined) {
          submissionData.append(key, value.toString());
        }
      });
      
      console.log('About to submit SMSF form data');
      
      // Send data to backend API
      const response = await apiClient.post('/tax-solutions/submit', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('SMSF form submission response:', response.data);
      toast.success('SMSF tax form submitted successfully! We will contact you soon.');
      
      // Reset form after successful submission
      setFormData({
        // Reset to initial state
        smsfName: '',
        streetAddress: '',
        streetAddress2: '',
        city: '',
        state: '',
        postcode: '',
        contactName: '',
        contactPosition: '',
        contactPhone: '',
        contactMobile: '',
        contactEmail: '',
        trusteeType: '',
        financialYear: '',
        updateAtoDetails: '',
        bankBsb: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        electronicServiceAddress: '',
        memberCount: '',
        prevAccountantName: '',
        prevAccountantContact: '',
        prevAccountantPhone: '',
        prevAccountantMobile: '',
        prevAccountantEmail: '',
        lastFinancialStatements: null,
        lastTaxReturn: null,
        trustDeeds: null,
        originalFundRecords: null,
        memberApplication: null,
        trusteeConsent: null,
        fundInvestmentStrategy: null,
        rolloverStatements: null,
        bankAccountCount: '',
        termDeposits: '',
        shares: '',
        shareRegistryCount: '',
        srn: '',
        unlistedShares: '',
        unlistedShareCertificate: '',
        unlistedShareFinancials: '',
        property: '',
        propertyLoanAgreement: '',
        propertyLoanStatements: '',
        propertyTitleDeed: '',
        propertySettlementStatement: '',
        propertyLeaseAgreement: '',
        propertyInsurancePolicy: '',
        propertyContractOfSale: '',
        propertyDeclarationOfCustody: '',
        preciousMetals: '',
        preciousMetalsPurchase: '',
        preciousMetalsStatements: '',
        preciousMetalsStorage: '',
        preciousMetalsInsurance: '',
        preciousMetalsBullions: '',
        preciousMetalsPhotos: '',
        cryptoCurrency: '',
        cryptoStatements: '',
        cryptoTrading: '',
        capitalGains: '',
        propertyCapitalGains: '',
        rentalIncome: '',
        trustDistribution: '',
        partnershipDistribution: '',
        dividendIncome: '',
        investmentExpenses: '',
        managementExpenses: '',
        expenseInvoices: null,
        signature: '',
        formType: 'smsf'
      });
      
      // Return to first step
      setCurrentStep(1);
      setSavedFormId(null);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error submitting form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Render the appropriate step component based on current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FormStep1SMSF 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange} 
          />
        );
      case 2:
        return (
          <FormStep2SMSF 
            formData={formData} 
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
          />
        );
      case 3:
        return (
          <FormStep3SMSF 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
          />
        );
      case 4:
        return (
          <FormStep4SMSF 
            formData={formData}
            handleChange={handleChange}
            handleRadioChange={handleRadioChange}
            handleFileChange={handleFileChange}
          />
        );
      case 5:
        return (
          <FormStep5SMSF 
            formData={formData}
            handleChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Step {currentStep} of 5</h2>
          {currentStep < 5 && (
            <Button variant="outline" onClick={handleSaveProgress} type="button">
              Save & Continue Later
            </Button>
          )}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${currentStep * 20}%` }}
          ></div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {renderCurrentStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              type="button"
            >
              Previous
            </Button>
          )}
          
          <div className="ml-auto">
            {currentStep < 5 && (
              <Button 
                onClick={handleNext}
                type="button"
              >
                Next
              </Button>
            )}
            
            {currentStep === 5 && (
              <Button 
                type="submit"
                disabled={submitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {submitting ? 'Submitting...' : 'Submit Form'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default SMSFTaxForm;
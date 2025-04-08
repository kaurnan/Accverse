import React, { useState } from 'react';
import { Button } from './ui/button';
import { toast } from 'react-toastify';
import FormStep1 from './tax-form/FormStep1';
import FormStep2 from './tax-form/FormStep2';
import FormStep3 from './tax-form/FormStep3';
import FormStep4 from './tax-form/FormStep4';
import FormStep5 from './tax-form/FormStep5';
import apiClient from '../services/api';

// Define the form data interface
interface FormData {
  // Part 1: Personal Details
  taxpayerType: string;
  prefix: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: string;
  mobile: string;
  email: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  tfn: string;
  abn: string;
  gstRequired: string;
  otherServices: string;
  fiscalYear: string;
  bankBsb: string;
  bankAccountNo: string;
  bankAccountName: string;
  bankName: string;
  updateAtoDetails: string;
  identification: File | null;

  // Part 2: Tax Residency & Offsets
  citizenStatus: string;
  spouse: string;
  dependents: string;
  medicare: string;
  privateHealth: string;
  hecsDebt: string;
  privateHealthFile: File | null;

  // Part 3: Taxable Income
  salary: string;
  interest: string;
  dividends: string;
  partnership: string;
  personalServiceIncome: string;
  soleTraderIncome: string;
  soldInvestments: string;
  soldRental: string;
  foreignIncome: string;
  rentalIncome: string;
  sharingEconomyIncome: string;
  pensionIncome: string;
  employeeShareScheme: string;
  otherIncome: string;

  // Part 4: Expenses
  carExpense: string;
  uniformExpense: string;
  travelExpense: string;
  educationExpense: string;
  phoneExpense: string;
  toolsExpense: string;
  otherWorkExpenses: string;
  incomeProtectionInsurance: string;
  donations: string;
  taxAgentFees: string;
  superContribution: string;
  interestExpense: string;
  workFromHome: string;
  
  // Part 5: Declaration
  signature: string;
  supportingDocs: File | null;
  
  [key: string]: string | string[] | boolean | File | null;
}

const TaxSolutionsForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Part 1: Personal Details
    taxpayerType: '',
    prefix: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    maritalStatus: '',
    mobile: '',
    email: '',
    address: '',
    suburb: '',
    state: '',
    postcode: '',
    tfn: '',
    abn: '',
    gstRequired: '',
    otherServices: '',
    fiscalYear: '',
    bankBsb: '',
    bankAccountNo: '',
    bankAccountName: '',
    bankName: '',
    updateAtoDetails: '',
    identification: null,

    // Part 2: Tax Residency & Offsets
    citizenStatus: '',
    spouse: '',
    dependents: '',
    medicare: '',
    privateHealth: '',
    hecsDebt: '',
    privateHealthFile: null,

    // Part 3: Taxable Income
    salary: '',
    interest: '',
    dividends: '',
    partnership: '',
    personalServiceIncome: '',
    soleTraderIncome: '',
    soldInvestments: '',
    soldRental: '',
    foreignIncome: '',
    rentalIncome: '',
    sharingEconomyIncome: '',
    pensionIncome: '',
    employeeShareScheme: '',
    otherIncome: '',

    // Part 4: Expenses
    carExpense: '',
    uniformExpense: '',
    travelExpense: '',
    educationExpense: '',
    phoneExpense: '',
    toolsExpense: '',
    otherWorkExpenses: '',
    incomeProtectionInsurance: '',
    donations: '',
    taxAgentFees: '',
    superContribution: '',
    interestExpense: '',
    workFromHome: '',

    // Part 5: Declaration
    signature: '',
    supportingDocs: null
  });

  const [submitting, setSubmitting] = useState(false);
  const [savedFormId, setSavedFormId] = useState<string | null>(null);

  const handleNext = () => {
    // Basic validation could be added here
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      // Save progress to backend
      if (formData.email) {
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

  const handleCheckboxChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: prev[name] === 'yes' ? 'no' : 'yes'
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
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.signature) {
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
      console.log('About to submit form data:');
      
      // Send data to backend API
      const response = await apiClient.post('/tax-solutions/submit', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Form submission response:', response.data);
      toast.success('Tax form submitted successfully! We will contact you soon.');
      
      // Reset form after successful submission
      setFormData({
        // Reset to initial state
        taxpayerType: '',
        prefix: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        maritalStatus: '',
        mobile: '',
        email: '',
        address: '',
        suburb: '',
        state: '',
        postcode: '',
        tfn: '',
        abn: '',
        gstRequired: '',
        otherServices: '',
        fiscalYear: '',
        bankBsb: '',
        bankAccountNo: '',
        bankAccountName: '',
        bankName: '',
        updateAtoDetails: '',
        identification: null,
    
        // Part 2: Tax Residency & Offsets
        citizenStatus: '',
        spouse: '',
        dependents: '',
        medicare: '',
        privateHealth: '',
        hecsDebt: '',
        privateHealthFile: null,
    
        // Part 3: Taxable Income
        salary: '',
        interest: '',
        dividends: '',
        partnership: '',
        personalServiceIncome: '',
        soleTraderIncome: '',
        soldInvestments: '',
        soldRental: '',
        foreignIncome: '',
        rentalIncome: '',
        sharingEconomyIncome: '',
        pensionIncome: '',
        employeeShareScheme: '',
        otherIncome: '',
    
        // Part 4: Expenses
        carExpense: '',
        uniformExpense: '',
        travelExpense: '',
        educationExpense: '',
        phoneExpense: '',
        toolsExpense: '',
        otherWorkExpenses: '',
        incomeProtectionInsurance: '',
        donations: '',
        taxAgentFees: '',
        superContribution: '',
        interestExpense: '',
        workFromHome: '',
        
        // Part 5: Declaration
        signature: '',
        supportingDocs: null
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
          <FormStep1 
            formData={formData} 
            handleChange={handleChange} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange} 
          />
        );
      case 2:
        return (
          <FormStep2 
            formData={formData} 
            handleRadioChange={handleRadioChange} 
            handleFileChange={handleFileChange} 
          />
        );
      case 3:
        return (
          <FormStep3 
            formData={formData} 
            handleRadioChange={handleRadioChange} 
          />
        );
      case 4:
        return (
          <FormStep4 
            formData={formData} 
            handleRadioChange={handleRadioChange}
          />
        );
      case 5:
        return (
          <FormStep5 
            formData={formData}
            handleChange={handleChange}
            handleFileChange={handleFileChange}
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

export default TaxSolutionsForm;

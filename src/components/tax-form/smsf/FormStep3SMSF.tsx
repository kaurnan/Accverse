import React from 'react';
import { Label } from '../../ui/label';

interface FormStep3SMSFProps {
  formData: {
    trustDeeds: File | null;
    originalFundRecords: File | null;
    memberApplication: File | null;
    trusteeConsent: File | null;
    fundInvestmentStrategy: File | null;
    rolloverStatements: File | null;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep3SMSF: React.FC<FormStep3SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 3: Fund Records</h2>
      </div>
      
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Please upload any of the following records that you have:</p>

        {/* Trust Deeds */}
        <div className="form-group mb-6">
          <Label htmlFor="trustDeeds" className="block text-gray-700 font-medium mb-2">Trust Deeds of the Fund:</Label>
          <p className="text-sm text-gray-500 mb-2">Upload Trust Deeds of the fund & any Deeds of Variation.</p>
          <input
            type="file"
            id="trustDeeds"
            name="trustDeeds"
            onChange={(e) => handleFileChange(e, 'trustDeeds')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.trustDeeds ? `Selected file: ${formData.trustDeeds.name}` : 'No file selected'}
          </p>
        </div>

        {/* Original Fund Records */}
        <div className="form-group mb-6">
          <Label htmlFor="originalFundRecords" className="block text-gray-700 font-medium mb-2">Original Fund Records:</Label>
          <p className="text-sm text-gray-500 mb-2">Upload Minutes of Meetings</p>
          <input
            type="file"
            id="originalFundRecords"
            name="originalFundRecords"
            onChange={(e) => handleFileChange(e, 'originalFundRecords')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.originalFundRecords ? `Selected file: ${formData.originalFundRecords.name}` : 'No file selected'}
          </p>
        </div>

        {/* Member Application */}
        <div className="form-group mb-6">
          <Label htmlFor="memberApplication" className="block text-gray-700 font-medium mb-2">Members Application</Label>
          <input
            type="file"
            id="memberApplication"
            name="memberApplication"
            onChange={(e) => handleFileChange(e, 'memberApplication')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.memberApplication ? `Selected file: ${formData.memberApplication.name}` : 'No file selected'}
          </p>
        </div>

        {/* Trustee Consent */}
        <div className="form-group mb-6">
          <Label htmlFor="trusteeConsent" className="block text-gray-700 font-medium mb-2">Consent to act as Trustees</Label>
          <input
            type="file"
            id="trusteeConsent"
            name="trusteeConsent"
            onChange={(e) => handleFileChange(e, 'trusteeConsent')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.trusteeConsent ? `Selected file: ${formData.trusteeConsent.name}` : 'No file selected'}
          </p>
        </div>

        {/* Fund Investment Strategy */}
        <div className="form-group mb-6">
          <Label htmlFor="fundInvestmentStrategy" className="block text-gray-700 font-medium mb-2">Fund Investment Strategy</Label>
          <input
            type="file"
            id="fundInvestmentStrategy"
            name="fundInvestmentStrategy"
            onChange={(e) => handleFileChange(e, 'fundInvestmentStrategy')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.fundInvestmentStrategy ? `Selected file: ${formData.fundInvestmentStrategy.name}` : 'No file selected'}
          </p>
        </div>

        {/* Rollover Statements */}
        <div className="form-group">
          <Label htmlFor="rolloverStatements" className="block text-gray-700 font-medium mb-2">Rollover Statements from other Super funds</Label>
          <input
            type="file"
            id="rolloverStatements"
            name="rolloverStatements"
            onChange={(e) => handleFileChange(e, 'rolloverStatements')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.rolloverStatements ? `Selected file: ${formData.rolloverStatements.name}` : 'No file selected'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormStep3SMSF;

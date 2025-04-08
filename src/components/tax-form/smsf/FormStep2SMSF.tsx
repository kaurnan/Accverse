import React from 'react';
import { Label } from '../../ui/label';

interface FormStep2SMSFProps {
  formData: {
    memberCount: string;
    prevAccountantName: string;
    prevAccountantContact: string;
    prevAccountantPhone: string;
    prevAccountantMobile: string;
    prevAccountantEmail: string;
    lastFinancialStatements: File | null;
    lastTaxReturn: File | null;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep2SMSF: React.FC<FormStep2SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 2: Member Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Member Count */}
        <div className="form-group">
          <Label htmlFor="memberCount" className="block text-gray-700 font-medium mb-2">How many members does the SMSF have? <span className="text-red-500">*</span></Label>
          <div className="flex flex-wrap gap-4">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <label key={num} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-600"
                  name="memberCount"
                  checked={formData.memberCount === num.toString()}
                  onChange={() => handleRadioChange('memberCount', num.toString())}
                />
                <span className="ml-2">{num}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Previous Accountant */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold mb-4">Previous Accountant's Details:</h3>
          
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantName" className="block text-gray-700 font-medium mb-2">Name of Firm / Responsible Individual</Label>
            <input
              type="text"
              id="prevAccountantName"
              name="prevAccountantName"
              value={formData.prevAccountantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantContact" className="block text-gray-700 font-medium mb-2">Contact Name</Label>
            <input
              type="text"
              id="prevAccountantContact"
              name="prevAccountantContact"
              value={formData.prevAccountantContact}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <Label htmlFor="prevAccountantPhone" className="block text-gray-700 font-medium mb-2">Telephone No.</Label>
              <input
                type="tel"
                id="prevAccountantPhone"
                name="prevAccountantPhone"
                value={formData.prevAccountantPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div className="form-group">
              <Label htmlFor="prevAccountantMobile" className="block text-gray-700 font-medium mb-2">Mobile No.</Label>
              <input
                type="tel"
                id="prevAccountantMobile"
                name="prevAccountantMobile"
                value={formData.prevAccountantMobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="form-group mb-6">
            <Label htmlFor="prevAccountantEmail" className="block text-gray-700 font-medium mb-2">Email Address</Label>
            <input
              type="email"
              id="prevAccountantEmail"
              name="prevAccountantEmail"
              value={formData.prevAccountantEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Last Financial Statements */}
        <div className="form-group mb-4">
          <Label htmlFor="lastFinancialStatements" className="block text-gray-700 font-medium mb-2">Last Financial Statements</Label>
          <p className="text-sm text-gray-500 mb-2">Upload the most recent Financial Statements & Members Statements.</p>
          <input
            type="file"
            id="lastFinancialStatements"
            name="lastFinancialStatements"
            onChange={(e) => handleFileChange(e, 'lastFinancialStatements')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.lastFinancialStatements ? `Selected file: ${formData.lastFinancialStatements.name}` : 'No file selected'}
          </p>
        </div>

        {/* Last Tax Return */}
        <div className="form-group">
          <Label htmlFor="lastTaxReturn" className="block text-gray-700 font-medium mb-2">Last Income Tax Return</Label>
          <p className="text-sm text-gray-500 mb-2">Upload the most recent Income Tax Return.</p>
          <input
            type="file"
            id="lastTaxReturn"
            name="lastTaxReturn"
            onChange={(e) => handleFileChange(e, 'lastTaxReturn')}
            className="w-full border border-gray-300 rounded px-3 py-2"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.lastTaxReturn ? `Selected file: ${formData.lastTaxReturn.name}` : 'No file selected'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormStep2SMSF;
import React from 'react';
import { Label } from '../../ui/label';

interface FormStep2Props {
  formData: {
    bankBsb: string;
    bankAccountNo: string;
    bankAccountName: string;
    bankName: string;
    prevAccountantName: string;
    prevAccountantAddress: string;
    prevAccountantCity: string;
    prevAccountantState: string;
    prevAccountantPhone: string;
    financialYear: string;
    updateAtoDetails: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
}

const FormStep2Business: React.FC<FormStep2Props> = ({ formData, handleChange, handleRadioChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Business Bank & Previous Accountant Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Bank Account Details */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Business Bank Account for TAX REFUND</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* BSB */}
            <div className="form-group">
              <Label htmlFor="bankBsb" className="block text-gray-700 font-medium mb-2">BSB</Label>
              <input
                type="text"
                id="bankBsb"
                name="bankBsb"
                value={formData.bankBsb}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., 123-456"
              />
            </div>

            {/* Account Number */}
            <div className="form-group">
              <Label htmlFor="bankAccountNo" className="block text-gray-700 font-medium mb-2">Account Number</Label>
              <input
                type="text"
                id="bankAccountNo"
                name="bankAccountNo"
                value={formData.bankAccountNo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Name */}
            <div className="form-group">
              <Label htmlFor="bankAccountName" className="block text-gray-700 font-medium mb-2">Account Name</Label>
              <input
                type="text"
                id="bankAccountName"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Bank Name */}
            <div className="form-group">
              <Label htmlFor="bankName" className="block text-gray-700 font-medium mb-2">Bank Name</Label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="e.g., Commonwealth Bank"
              />
            </div>
          </div>
        </div>

        {/* Previous Accountant */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Previous Accountant's Details, if had one.</h3>
          
          {/* Accountant Name */}
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantName" className="block text-gray-700 font-medium mb-2">Full Name / Business Name</Label>
            <input
              type="text"
              id="prevAccountantName"
              name="prevAccountantName"
              value={formData.prevAccountantName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* Address */}
          <div className="form-group mb-4">
            <Label htmlFor="prevAccountantAddress" className="block text-gray-700 font-medium mb-2">Street Address Line 1</Label>
            <input
              type="text"
              id="prevAccountantAddress"
              name="prevAccountantAddress"
              value={formData.prevAccountantAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* City */}
            <div className="form-group">
              <Label htmlFor="prevAccountantCity" className="block text-gray-700 font-medium mb-2">City</Label>
              <input
                type="text"
                id="prevAccountantCity"
                name="prevAccountantCity"
                value={formData.prevAccountantCity}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* State */}
            <div className="form-group">
              <Label htmlFor="prevAccountantState" className="block text-gray-700 font-medium mb-2">State</Label>
              <select
                id="prevAccountantState"
                name="prevAccountantState"
                value={formData.prevAccountantState}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                <option value="">Select a state</option>
                <option value="ACT">Australian Capital Territory</option>
                <option value="NSW">New South Wales</option>
                <option value="NT">Northern Territory</option>
                <option value="QLD">Queensland</option>
                <option value="SA">South Australia</option>
                <option value="TAS">Tasmania</option>
                <option value="VIC">Victoria</option>
                <option value="WA">Western Australia</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div className="form-group">
            <Label htmlFor="prevAccountantPhone" className="block text-gray-700 font-medium mb-2">Telephone Number</Label>
            <input
              type="tel"
              id="prevAccountantPhone"
              name="prevAccountantPhone"
              value={formData.prevAccountantPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Financial Year */}
        <div className="form-group">
          <Label htmlFor="financialYear" className="block text-gray-700 font-medium mb-2">Tax Return for Financial Year Ended 30 June</Label>
          <p className="text-sm text-gray-500 mb-2">State the Financial Year End you require the accounts and tax return to be prepared.</p>
          <select
            id="financialYear"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select a financial year</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>

        {/* Update ATO Details */}
        <div className="form-group">
          <Label htmlFor="updateAtoDetails" className="block text-gray-700 font-medium mb-2">Would you authorise us to update your business address and contact details with the ATO?</Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'yes'}
                onChange={() => handleRadioChange('updateAtoDetails', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="updateAtoDetails"
                checked={formData.updateAtoDetails === 'no'}
                onChange={() => handleRadioChange('updateAtoDetails', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep2Business;
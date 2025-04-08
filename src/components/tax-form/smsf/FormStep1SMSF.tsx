import React from 'react';
import { Label } from '../../ui/label';

interface FormStep1SMSFProps {
  formData: {
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
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
}

const FormStep1SMSF: React.FC<FormStep1SMSFProps> = ({ formData, handleChange, handleRadioChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 1: SMSF Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* SMSF Name */}
        <div className="form-group">
          <Label htmlFor="smsfName" className="block text-gray-700 font-medium mb-2">Name</Label>
          <input
            type="text"
            id="smsfName"
            name="smsfName"
            value={formData.smsfName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        {/* SMSF Address */}
        <div className="form-group">
          <Label htmlFor="streetAddress" className="block text-gray-700 font-medium mb-2">Address <span className="text-red-500">*</span></Label>
          <input
            type="text"
            id="streetAddress"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Street Address"
            required
          />
          <input
            type="text"
            id="streetAddress2"
            name="streetAddress2"
            value={formData.streetAddress2}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Street Address Line 2"
          />
          <div className="grid grid-cols-2 gap-2 mb-2">
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="City"
              required
            />
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            >
              <option value="">Select State</option>
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
          <input
            type="text"
            id="postcode"
            name="postcode"
            value={formData.postcode}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Postcode"
            required
          />
        </div>

        {/* Contact Details */}
        <div className="form-group border-t border-gray-200 pt-6">
          <Label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">Contact <span className="text-red-500">*</span></Label>
          <input
            type="text"
            id="contactName"
            name="contactName"
            value={formData.contactName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Full Name"
            required
          />
          <input
            type="text"
            id="contactPosition"
            name="contactPosition"
            value={formData.contactPosition}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-2"
            placeholder="Position Held"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
            <input
              type="tel"
              id="contactPhone"
              name="contactPhone"
              value={formData.contactPhone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Phone No."
            />
            <input
              type="tel"
              id="contactMobile"
              name="contactMobile"
              value={formData.contactMobile}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Mobile No."
            />
          </div>
          <input
            type="email"
            id="contactEmail"
            name="contactEmail"
            value={formData.contactEmail}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Email Address"
            required
          />
        </div>

        {/* Trustee Type */}
        <div className="form-group border-t border-gray-200 pt-6">
          <Label htmlFor="trusteeType" className="block text-gray-700 font-medium mb-2">SMSF Trustee Type <span className="text-red-500">*</span></Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trusteeType"
                checked={formData.trusteeType === 'company'}
                onChange={() => handleRadioChange('trusteeType', 'company')}
              />
              <span className="ml-2">Company</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trusteeType"
                checked={formData.trusteeType === 'individual_1'}
                onChange={() => handleRadioChange('trusteeType', 'individual_1')}
              />
              <span className="ml-2">1 Individual Trustee</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trusteeType"
                checked={formData.trusteeType === 'individual_2'}
                onChange={() => handleRadioChange('trusteeType', 'individual_2')}
              />
              <span className="ml-2">2 Individual Trustees</span>
            </label>
          </div>
        </div>

        {/* Year of return */}
        <div className="form-group">
          <Label htmlFor="financialYear" className="block text-gray-700 font-medium mb-2">Year of annual return</Label>
          <p className="text-sm text-gray-500 mb-2">Which financial year do you require the accounts & tax return to be prepared?</p>
          <select
            id="financialYear"
            name="financialYear"
            value={formData.financialYear}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
          >
            <option value="">Select financial year</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
          </select>
        </div>

        {/* Update ATO Details */}
        <div className="form-group">
          <Label htmlFor="updateAtoDetails" className="block text-gray-700 font-medium mb-2">Would you authorise us to update your business contact details with the ATO? <span className="text-red-500">*</span></Label>
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

        {/* Bank Account Details */}
        <div className="form-group border-t border-gray-200 pt-6">
          <Label htmlFor="bankBsb" className="block text-gray-700 font-medium mb-2">SMSF Bank Account for TAX REFUND</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="form-group">
              <Label htmlFor="bankBsb" className="block text-gray-700 text-sm mb-1">BSB</Label>
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
            <div className="form-group">
              <Label htmlFor="bankAccountNo" className="block text-gray-700 text-sm mb-1">Account Number</Label>
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
            <div className="form-group">
              <Label htmlFor="bankAccountName" className="block text-gray-700 text-sm mb-1">Account Name</Label>
              <input
                type="text"
                id="bankAccountName"
                name="bankAccountName"
                value={formData.bankAccountName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
            <div className="form-group">
              <Label htmlFor="bankName" className="block text-gray-700 text-sm mb-1">Bank Name</Label>
              <input
                type="text"
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Electronic Service Address */}
        <div className="form-group">
          <Label htmlFor="electronicServiceAddress" className="block text-gray-700 font-medium mb-2">Electronic service address alias</Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'none'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'none')}
              />
              <span className="ml-2">None</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'auspostsmsf'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'auspostsmsf')}
              />
              <span className="ml-2">AUSPOSTSMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'cfscssmsf'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'cfscssmsf')}
              />
              <span className="ml-2">CFSCSSMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'clearviewsmsf'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'clearviewsmsf')}
              />
              <span className="ml-2">ClearviewSMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'clicksuper'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'clicksuper')}
              />
              <span className="ml-2">CLICKSUPER</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'computershare'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'computershare')}
              />
              <span className="ml-2">Computershare</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'esuperfund'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'esuperfund')}
              />
              <span className="ml-2">ESUPERFUND</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'macquariesmsf'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'macquariesmsf')}
              />
              <span className="ml-2">MACQUARIESMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'mercersmsf'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'mercersmsf')}
              />
              <span className="ml-2">MercerSMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="electronicServiceAddress"
                checked={formData.electronicServiceAddress === 'mysmsfmailbox'}
                onChange={() => handleRadioChange('electronicServiceAddress', 'mysmsfmailbox')}
              />
              <span className="ml-2">MySMSFMailbox</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1SMSF;
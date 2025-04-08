import React from 'react';
import { Label } from '../../ui/label';

interface FormStep1Props {
  formData: {
    taxLodgement: string;
    entityType: string;
    entityName: string;
    abn: string;
    acn: string;
    tfn: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    contactMobile: string;
    contactPosition: string;
    streetAddress: string;
    streetAddress2: string;
    city: string;
    state: string;
    postcode: string;
    gstRegistered: string;
    asicAgent: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep1Business: React.FC<FormStep1Props> = ({ formData, handleChange, handleRadioChange, handleFileChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 1: Business Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Tax Lodgement Service */}
        <div className="form-group">
          <Label htmlFor="taxLodgement" className="block text-gray-700 font-medium mb-2">Do you require tax lodgement services? <span className="text-red-500">*</span></Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="taxLodgement"
                checked={formData.taxLodgement === 'yes'}
                onChange={() => handleRadioChange('taxLodgement', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="taxLodgement"
                checked={formData.taxLodgement === 'no'}
                onChange={() => handleRadioChange('taxLodgement', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
        
        {/* Entity Type */}
        <div className="form-group">
          <Label htmlFor="entityType" className="block text-gray-700 font-medium mb-2">Entity Type</Label>
          <div className="flex flex-wrap space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="entityType"
                checked={formData.entityType === 'company'}
                onChange={() => handleRadioChange('entityType', 'company')}
              />
              <span className="ml-2">Company</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="entityType"
                checked={formData.entityType === 'trust'}
                onChange={() => handleRadioChange('entityType', 'trust')}
              />
              <span className="ml-2">Trust</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="entityType"
                checked={formData.entityType === 'smsf'}
                onChange={() => handleRadioChange('entityType', 'smsf')}
              />
              <span className="ml-2">SMSF</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="entityType"
                checked={formData.entityType === 'partnership'}
                onChange={() => handleRadioChange('entityType', 'partnership')}
              />
              <span className="ml-2">Partnership</span>
            </label>
          </div>
        </div>

        {/* Entity Name */}
        <div className="form-group">
          <Label htmlFor="entityName" className="block text-gray-700 font-medium mb-2">Entity Name <span className="text-red-500">*</span></Label>
          <input
            type="text"
            id="entityName"
            name="entityName"
            value={formData.entityName}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>

        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg font-semibold mb-4">Business Registration Details</h3>
          
          {/* ABN */}
          <div className="form-group mb-4">
            <Label htmlFor="abn" className="block text-gray-700 font-medium mb-2">Australian Business Number (ABN)</Label>
            <input
              type="text"
              id="abn"
              name="abn"
              value={formData.abn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* ACN */}
          <div className="form-group mb-4">
            <Label htmlFor="acn" className="block text-gray-700 font-medium mb-2">Australian Company Number (ACN)</Label>
            <input
              type="text"
              id="acn"
              name="acn"
              value={formData.acn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          {/* TFN */}
          <div className="form-group">
            <Label htmlFor="tfn" className="block text-gray-700 font-medium mb-2">Tax File Number (TFN)</Label>
            <input
              type="text"
              id="tfn"
              name="tfn"
              value={formData.tfn}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg font-semibold mb-4">Business Contact Details <span className="text-red-500">*</span></h3>
          
          {/* Contact Name */}
          <div className="form-group mb-4">
            <Label htmlFor="contactName" className="block text-gray-700 font-medium mb-2">Director / Trustee / Partner</Label>
            <input
              type="text"
              id="contactName"
              name="contactName"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Email */}
          <div className="form-group mb-4">
            <Label htmlFor="contactEmail" className="block text-gray-700 font-medium mb-2">Email</Label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Phone */}
            <div className="form-group">
              <Label htmlFor="contactPhone" className="block text-gray-700 font-medium mb-2">Phone No.</Label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Mobile */}
            <div className="form-group">
              <Label htmlFor="contactMobile" className="block text-gray-700 font-medium mb-2">Mobile No.</Label>
              <input
                type="tel"
                id="contactMobile"
                name="contactMobile"
                value={formData.contactMobile}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Position */}
          <div className="form-group">
            <Label htmlFor="contactPosition" className="block text-gray-700 font-medium mb-2">Position Held</Label>
            <input
              type="text"
              id="contactPosition"
              name="contactPosition"
              value={formData.contactPosition}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="border-t border-gray-300 pt-6">
          <h3 className="text-lg font-semibold mb-4">Business Address <span className="text-red-500">*</span></h3>
          
          {/* Street Address */}
          <div className="form-group mb-4">
            <Label htmlFor="streetAddress" className="block text-gray-700 font-medium mb-2">Street Address</Label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>

          {/* Street Address Line 2 */}
          <div className="form-group mb-4">
            <Label htmlFor="streetAddress2" className="block text-gray-700 font-medium mb-2">Street Address Line 2</Label>
            <input
              type="text"
              id="streetAddress2"
              name="streetAddress2"
              value={formData.streetAddress2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* City */}
            <div className="form-group">
              <Label htmlFor="city" className="block text-gray-700 font-medium mb-2">City</Label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>

            {/* State */}
            <div className="form-group">
              <Label htmlFor="state" className="block text-gray-700 font-medium mb-2">State</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
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

            {/* Postcode */}
            <div className="form-group">
              <Label htmlFor="postcode" className="block text-gray-700 font-medium mb-2">Postcode</Label>
              <input
                type="text"
                id="postcode"
                name="postcode"
                value={formData.postcode}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                required
              />
            </div>
          </div>
        </div>

        {/* GST Registration */}
        <div className="border-t border-gray-300 pt-6">
          <Label htmlFor="gstRegistered" className="block text-gray-700 font-medium mb-2">Is the entity Registered for GST? <span className="text-red-500">*</span></Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="gstRegistered"
                checked={formData.gstRegistered === 'yes'}
                onChange={() => handleRadioChange('gstRegistered', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="gstRegistered"
                checked={formData.gstRegistered === 'no'}
                onChange={() => handleRadioChange('gstRegistered', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="gstRegistered"
                checked={formData.gstRegistered === 'requires_application'}
                onChange={() => handleRadioChange('gstRegistered', 'requires_application')}
              />
              <span className="ml-2">Requires GST Application</span>
            </label>
          </div>
        </div>

        {/* ASIC Agent */}
        <div className="form-group">
          <Label htmlFor="asicAgent" className="block text-gray-700 font-medium mb-2">Do you agree for us to act as the company's ASIC Registered Agent? <span className="text-red-500">*</span></Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="asicAgent"
                checked={formData.asicAgent === 'yes'}
                onChange={() => handleRadioChange('asicAgent', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="asicAgent"
                checked={formData.asicAgent === 'no'}
                onChange={() => handleRadioChange('asicAgent', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1Business;
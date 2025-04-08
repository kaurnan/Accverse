import React from 'react';
import { Label } from '../../ui/label';

interface FormStep3Props {
  formData: {
    accountingSoftware: string;
    motorVehicles: string;
    fbtRegistered: string;
    employeeCount: string;
    relatedEntityName: string;
    relatedEntitySoftware: string;
    relatedEntityTFN: string;
    relatedEntityABN: string;
    div7aLoans: string;
    trustType: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
}

const FormStep3Business: React.FC<FormStep3Props> = ({ formData, handleChange, handleRadioChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 2 & 3: Income, Expenses & Payroll</h2>
      </div>
      
      <div className="space-y-6">
        {/* Accounting Software */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Have Accounting Software?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'xero'}
                onChange={() => handleRadioChange('accountingSoftware', 'xero')}
              />
              <span className="ml-2">Yes: Xero - online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'myob_accountright'}
                onChange={() => handleRadioChange('accountingSoftware', 'myob_accountright')}
              />
              <span className="ml-2">Yes: MYOB AccountRight - online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'myob_essentials'}
                onChange={() => handleRadioChange('accountingSoftware', 'myob_essentials')}
              />
              <span className="ml-2">Yes: MYOB Essentials - online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'quickbooks'}
                onChange={() => handleRadioChange('accountingSoftware', 'quickbooks')}
              />
              <span className="ml-2">Yes: QuickBooks - online</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'other'}
                onChange={() => handleRadioChange('accountingSoftware', 'other')}
              />
              <span className="ml-2">OTHER / OFFLINE / DESKTOP files</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="accountingSoftware"
                checked={formData.accountingSoftware === 'none'}
                onChange={() => handleRadioChange('accountingSoftware', 'none')}
              />
              <span className="ml-2">NO</span>
            </label>
          </div>
        </div>

        {/* Motor Vehicles */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">MOTOR VEHICLES / ASSETS?</h3>
          <p className="text-sm text-gray-500 mb-4">Does the Business have any Motor Vehicles/ Cars / Assets in its own Name?</p>
          
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="motorVehicles"
                checked={formData.motorVehicles === 'under_finance'}
                onChange={() => handleRadioChange('motorVehicles', 'under_finance')}
              />
              <span className="ml-2">Yes: under Finance</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="motorVehicles"
                checked={formData.motorVehicles === 'owned_outright'}
                onChange={() => handleRadioChange('motorVehicles', 'owned_outright')}
              />
              <span className="ml-2">Yes: owned Outright</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="motorVehicles"
                checked={formData.motorVehicles === 'no'}
                onChange={() => handleRadioChange('motorVehicles', 'no')}
              />
              <span className="ml-2">NO</span>
            </label>
          </div>
          
          {formData.motorVehicles === 'under_finance' && (
            <p className="mt-2 text-sm text-gray-600 italic">
              If the answer is YES for the question on asset under Finance, a copy of the repayment schedule is to be called for. Additionally, need to also add the logbook/declaration for the private usage portion as long as the Vehicle owned is not a Utility (UTE) or Electric Vehicle.
            </p>
          )}
        </div>

        {/* FBT Registration */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">FRINGE BENEFITS TAX REGISTERED?</h3>
          <p className="text-sm text-gray-500 mb-4">Is the Business registered for Fringe Benefits Tax (FBT)?</p>
          
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="fbtRegistered"
                checked={formData.fbtRegistered === 'yes'}
                onChange={() => handleRadioChange('fbtRegistered', 'yes')}
              />
              <span className="ml-2">Yes: FBT Registered</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="fbtRegistered"
                checked={formData.fbtRegistered === 'not_required'}
                onChange={() => handleRadioChange('fbtRegistered', 'not_required')}
              />
              <span className="ml-2">No: Not required</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="fbtRegistered"
                checked={formData.fbtRegistered === 'unsure'}
                onChange={() => handleRadioChange('fbtRegistered', 'unsure')}
              />
              <span className="ml-2">No: Unsure</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="fbtRegistered"
                checked={formData.fbtRegistered === 'required_to_register'}
                onChange={() => handleRadioChange('fbtRegistered', 'required_to_register')}
              />
              <span className="ml-2">No: Required to Register</span>
            </label>
          </div>
        </div>

        {/* Part 3: Payroll / Employees */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Part 3: Payroll / Employees</h3>
          
          {/* Employee Count */}
          <div className="form-group mb-6">
            <Label htmlFor="employeeCount" className="block text-gray-700 font-medium mb-2">How many employees/directors receiving Salary/Wages? <span className="text-red-500">*</span></Label>
            <input
              type="number"
              id="employeeCount"
              name="employeeCount"
              min="0"
              value={formData.employeeCount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
            />
          </div>
        </div>

        {/* Related Entities */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Additional Related Entities</h3>
          <p className="text-sm text-gray-500 mb-4">Related Entities for new client form</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Entity Name */}
            <div className="form-group">
              <Label htmlFor="relatedEntityName" className="block text-gray-700 font-medium mb-2">Name</Label>
              <input
                type="text"
                id="relatedEntityName"
                name="relatedEntityName"
                value={formData.relatedEntityName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* Accounting Software */}
            <div className="form-group">
              <Label htmlFor="relatedEntitySoftware" className="block text-gray-700 font-medium mb-2">Accounting Software</Label>
              <input
                type="text"
                id="relatedEntitySoftware"
                name="relatedEntitySoftware"
                value={formData.relatedEntitySoftware}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* TFN */}
            <div className="form-group">
              <Label htmlFor="relatedEntityTFN" className="block text-gray-700 font-medium mb-2">TFN</Label>
              <input
                type="text"
                id="relatedEntityTFN"
                name="relatedEntityTFN"
                value={formData.relatedEntityTFN}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            {/* ABN */}
            <div className="form-group">
              <Label htmlFor="relatedEntityABN" className="block text-gray-700 font-medium mb-2">ABN</Label>
              <input
                type="text"
                id="relatedEntityABN"
                name="relatedEntityABN"
                value={formData.relatedEntityABN}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Div 7A Loans */}
        <div className="form-group mb-6">
          <Label htmlFor="div7aLoans" className="block text-gray-700 font-medium mb-2">Div. 7A Loans?</Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="div7aLoans"
                checked={formData.div7aLoans === 'yes'}
                onChange={() => handleRadioChange('div7aLoans', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="div7aLoans"
                checked={formData.div7aLoans === 'no'}
                onChange={() => handleRadioChange('div7aLoans', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {formData.div7aLoans === 'yes' && (
            <p className="mt-2 text-sm text-gray-600 italic">
              If the answer is YES, please provide the copies of signed loan agreements specifying the terms & conditions of the loan.
            </p>
          )}
        </div>

        {/* Trust Type */}
        <div className="form-group">
          <Label htmlFor="trustType" className="block text-gray-700 font-medium mb-2">In case of Trust (other than Unit Trust)?</Label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trustType"
                checked={formData.trustType === 'yes'}
                onChange={() => handleRadioChange('trustType', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="trustType"
                checked={formData.trustType === 'no'}
                onChange={() => handleRadioChange('trustType', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
          </div>
          {formData.trustType === 'yes' && (
            <p className="mt-2 text-sm text-gray-600 italic">
              A copy of the signed Trust Resolution/Minute confirming the distribution ratio of profits between the beneficiaries. The resolution/minute is to be signed dated on or before 30th June to avoid the application of S100A anti-tax avoidance rules.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormStep3Business;
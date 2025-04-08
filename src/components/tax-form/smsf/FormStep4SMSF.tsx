import React from 'react';
import { Label } from '../../ui/label';

interface FormStep4SMSFProps {
  formData: {
    bankAccountCount: string;
    termDeposits: string;
    shares: string;
    shareRegistryCount: string;
    srn: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep4SMSF: React.FC<FormStep4SMSFProps> = ({ formData, handleChange, handleRadioChange, handleFileChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 3: Assets Details</h2>
      </div>
      
      <div className="space-y-6">
        {/* Bank Accounts */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Bank Accounts</h3>
          
          <div className="form-group mb-4">
            <Label htmlFor="bankAccountCount" className="block text-gray-700 font-medium mb-2">HOW MANY BANK ACCOUNTS DOES THE SMSF HAVE?</Label>
            <select
              id="bankAccountCount"
              name="bankAccountCount"
              value={formData.bankAccountCount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              <option value="">Select number of accounts</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5+">5+</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            For each bank account please upload every page of bank statements, its cheque butts & deposit books or a list of the cheques written & deposits made, for the full financial year e.g. 01/07/20xx to 30/06/20xx.
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Please send us the PDF / scanned copy of the 30 June statement to confirm ownership by the SMSF and closing balance for audit file completeness.
          </p>
          
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="bankStatements"
                value="yes"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="bankStatements"
                value="no"
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="bankStatements"
                value="na"
              />
              <span className="ml-2">N/A</span>
            </label>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            If there are Term Deposits, please send us all Term Deposit statements from 1 July to 30 June.
          </p>
          
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="termDeposits"
                checked={formData.termDeposits === 'yes'}
                onChange={() => handleRadioChange('termDeposits', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="termDeposits"
                checked={formData.termDeposits === 'no'}
                onChange={() => handleRadioChange('termDeposits', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="termDeposits"
                checked={formData.termDeposits === 'na'}
                onChange={() => handleRadioChange('termDeposits', 'na')}
              />
              <span className="ml-2">N/A</span>
            </label>
          </div>
        </div>

        {/* Listed Shares */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Listed Shares & Listed Unit Trust Investments</h3>
          
          <p className="text-sm text-gray-600 mb-2">
            Financial Year summary statement as at 30 June to confirm units held and market value as at 30 June.
          </p>
          
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shares"
                checked={formData.shares === 'yes'}
                onChange={() => handleRadioChange('shares', 'yes')}
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shares"
                checked={formData.shares === 'no'}
                onChange={() => handleRadioChange('shares', 'no')}
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shares"
                checked={formData.shares === 'na'}
                onChange={() => handleRadioChange('shares', 'na')}
              />
              <span className="ml-2">N/A</span>
            </label>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Transaction summary statement for the period from 1 July to 30 June.
          </p>
          
          <div className="flex space-x-4 mb-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shareTransactions"
                value="yes"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shareTransactions"
                value="no"
              />
              <span className="ml-2">No</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="shareTransactions"
                value="na"
              />
              <span className="ml-2">N/A</span>
            </label>
          </div>
          
          <div className="form-group">
            <Label htmlFor="shareRegistryCount" className="block text-gray-700 font-medium mb-2">HOW MANY SHARE REGISTRY DOES THE SMSF HAVE? PROVIDE SRN, HIN BELOW:</Label>
            <select
              id="shareRegistryCount"
              name="shareRegistryCount"
              value={formData.shareRegistryCount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
            >
              <option value="">Select number of registries</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="none">None</option>
            </select>
            
            {formData.shareRegistryCount && formData.shareRegistryCount !== 'none' && (
              <input
                type="text"
                id="srn"
                name="srn"
                value={formData.srn}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2"
                placeholder="Enter SRN, HIN details"
              />
            )}
          </div>
        </div>

        {/* This section shows a condensed version of the remaining fields */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Unlisted Shares and Unlisted Unit Trusts</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide details about unlisted shares and unit trusts. Upload relevant documents as required.
          </p>
        </div>

        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Property</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide details about any property investments. Upload property documents and agreements as required.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Other Investments</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please provide details about any precious metals, collectibles, cryptocurrency, or other investments held by the SMSF.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormStep4SMSF;
import React from 'react';
import { Label } from '../../ui/label';

interface FormStep5SMSFProps {
  formData: {
    signature: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const FormStep5SMSF: React.FC<FormStep5SMSFProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 5: Declaration</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-6">
          <h3 className="text-lg font-semibold mb-4">Declaration</h3>
          
          <p className="text-sm mb-2">
            <strong>You hereby appoint Accverse (Tax Agent Reg. No 26274335) to act as your accountant &/or tax agent.</strong> We will add you to our tax agent portal and liaise with the ATO on your behalf as required.
          </p>
          <p className="text-sm mb-2">
            You declare that all the information you have provided to us are correct and complete to the best of your knowledge.
          </p>
          <p className="text-sm mb-2">
            As Trustee of the Fund, you understand your obligations under self assessment to keep full and proper records for minimum 5 years
          </p>
          <p className="text-sm mb-2">
            <strong>Internet Transfer:</strong> You understand that once you transfer our SMSF accounting and tax fees into our bank account, your tax return will be lodged with the ATO and any refund due will be deposited directly into your nominated bank account by the ATO.
          </p>
          <p className="text-sm mb-2">
            <strong>Important note:</strong>
          </p>
          <p className="text-sm mb-2">
            We will send all the Financial Reports via docusign for digital signature. This eliminates the need for printing and scanning signed pages back to us. An email will be sent to you to notify once the reports are sent. Please look out for the email from Docusign.
          </p>
          <p className="text-sm mb-2">
            As per the section 35B of the SIS acts, the accounts and the financial statements must be signed by at least two Trustees. Please remember to provide us with at least two email addresses of the Trustees. We will send out the Docusign emails to those Trustees for digital signatures.
          </p>
        </div>

        <div className="form-group">
          <Label htmlFor="signature" className="block text-gray-700 font-medium mb-2">
            Trustee Signature <span className="text-red-500">*</span>
          </Label>
          <input
            type="text"
            id="signature"
            name="signature"
            value={formData.signature}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Type your full name as signature"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default FormStep5SMSF;
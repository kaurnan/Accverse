import React from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface FormStep5Props {
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
  formData: any;
}

const FormStep5: React.FC<FormStep5Props> = ({ handleChange, handleFileChange, formData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Part 5: Declaration</h2>
      <p className="text-gray-600 mb-6">Please review the checklist to ensure all information is provided and supporting documents uploaded using the 'browse files' buttons. This checklist is not exhaustive, please email us any additional relevant information.</p>
      
      <div className="bg-gray-50 p-6 rounded-md mb-6">
        <h3 className="font-semibold mb-4">DECLARATION:</h3>
        <p className="mb-4">You declare all information is correct and complete to the best of your knowledge.</p>
        <p className="mb-4">You appoint Accverse as your tax agent and accountant (Agent No: 26274335). We will add you to our tax agent portal and liaise with the ATO on your behalf.</p>
        
        <h3 className="font-semibold mt-6 mb-2">Internet Transfer:</h3>
        <ul className="list-disc pl-5 space-y-2 mb-4">
          <li>Individual Clients: You understand that after transferring our fees we will prepare and lodge your tax return with the ATO, and any refund will go directly to your nominated bank account.</li>
          <li>Business & Sole Trader Clients: Kindly submit this form with our Engagement Letter. Read, complete, sign, and submit the last page of the Engagement Letter via the hyperlink.</li>
        </ul>
      </div>
      
      <div className="mt-6">
        <Label className="block mb-2">Supporting Documents (optional)</Label>
        <p className="text-sm text-gray-500 mb-2">Upload relevant tax documents (Group certificates, receipts, etc.)</p>
        <Input 
          id="supportingDocs"
          type="file"
          onChange={(e) => handleFileChange(e, 'supportingDocs')}
          className="cursor-pointer mb-6"
          // multiple
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
        />
        
        <Label className="block mb-2">Signature</Label>
        <Input 
          type="text"
          name="signature"
          value={formData.signature || ''}
          placeholder="Type your full name as signature"
          className="mb-6"
          onChange={handleChange}
          required
        />
      </div>
    </div>
  );
};

export default FormStep5;

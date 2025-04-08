import React from 'react';
import { Label } from '../../ui/label';

interface FormStep4Props {
  formData: {
    entityDocument: File | null;
    ownerIdDocument: File | null;
    signature: string;
    signature2: string;
    [key: string]: string | File | null;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep4Business: React.FC<FormStep4Props> = ({ formData, handleChange, handleFileChange }) => {
  return (
    <div>
      <div className="bg-blue-600 text-white p-4 rounded-t-lg mb-4">
        <h2 className="text-xl font-semibold">Part 4: Documents & Declaration</h2>
      </div>
      
      <div className="space-y-6">
        {/* Upload Documents */}
        <div className="border-b border-gray-200 pb-6">
          <h3 className="text-lg font-semibold mb-4">Upload Required Documents</h3>
          
          <div className="form-group mb-6">
            <Label htmlFor="entityDocument" className="block text-gray-700 font-medium mb-2">
              Upload a Current Company Information / Trust Deed / Partnership Agreement
            </Label>
            <input
              type="file"
              id="entityDocument"
              name="entityDocument"
              onChange={(e) => handleFileChange(e, 'entityDocument')}
              className="w-full border border-gray-300 rounded px-3 py-2"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <p className="text-sm text-gray-500 mt-1">
              {formData.entityDocument ? `Selected file: ${formData.entityDocument.name}` : 'No file selected'}
            </p>
          </div>

          <div className="form-group">
            <Label htmlFor="ownerIdDocument" className="block text-gray-700 font-medium mb-2">
              Upload Photo IDs for each of the business' director / owner/ shareholder <span className="text-red-500">*</span>
            </Label>
            <input
              type="file"
              id="ownerIdDocument"
              name="ownerIdDocument"
              onChange={(e) => handleFileChange(e, 'ownerIdDocument')}
              className="w-full border border-gray-300 rounded px-3 py-2"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload a copy of your Passport or Drivers License for verification purposes.
              {formData.ownerIdDocument ? ` Selected file: ${formData.ownerIdDocument.name}` : ''}
            </p>
          </div>

          {/* Director ID */}
          <div className="form-group mt-4">
            <Label htmlFor="directorId" className="block text-gray-700 font-medium mb-2">Director ID:</Label>
            <input
              type="text"
              id="directorId"
              name="directorId"
              value={formData.directorId}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter Director ID number"
            />
          </div>
        </div>
        
        {/* Declaration */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Part 4: Declaration</h3>
          
          <div className="bg-gray-100 border border-gray-300 rounded p-4 mb-6">
            <p className="text-sm">
              You hereby appoint Accverse to act as your bookkeeper, accountant &/or tax agent. We will add you to our tax agent portal and liaise with the ATO on your behalf regarding the specific service, as required.
            </p>
            <p className="text-sm mt-2">
              You declare that all the information you have provided to us is correct and complete to the best of your knowledge.
            </p>
            <p className="text-sm mt-2">
              Internet Transfer: You understand that once you transfer your accounting fees into our bank account, the specific service requested will be prepared and or lodged with the ATO and any refund due will be deposited directly into your nominated bank account by the ATO.
            </p>
            <p className="text-sm mt-2">
              Business Clients: You are required to submit this form in conjunction with our Engagement Letter. Please read our Engagement Letter, complete, sign and submit the last page of the Engagement Letter via this link.
            </p>
          </div>

          {/* Signature 1 */}
          <div className="form-group mb-6">
            <Label htmlFor="signature" className="block text-gray-700 font-medium mb-2">
              Owner / Director / Manager 1 Signature <span className="text-red-500">*</span>
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

          {/* Signature 2 */}
          <div className="form-group">
            <Label htmlFor="signature2" className="block text-gray-700 font-medium mb-2">
              Owner / Director / Manager 2 Signature
            </Label>
            <input
              type="text"
              id="signature2"
              name="signature2"
              value={formData.signature2}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Type your full name as signature (if applicable)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep4Business;
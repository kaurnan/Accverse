import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FormStep1Props {
  formData: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep1: React.FC<FormStep1Props> = ({ 
  formData, 
  handleChange, 
  handleRadioChange,
  handleFileChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Part 1: Personal Details</h2>
      <p className="text-gray-600 mb-6">If you're an existing client, you'll only need to complete the questions marked with a red asterisk, unless the information requires an update.</p>
      
      <div className="space-y-6">
        <div>
          <Label>Taxpayer Type</Label>
          <RadioGroup 
            value={formData.taxpayerType} 
            onValueChange={(value: string) => handleRadioChange('taxpayerType', value)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="soleTrader" id="soleTrader" />
              <Label htmlFor="soleTrader">Sole Trader with ABN</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="prefix">Prefix</Label>
            <Input 
              id="prefix" 
              name="prefix" 
              value={formData.prefix}
              onChange={handleChange}
              placeholder="Mr/Ms/Dr"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="firstName">First & Middle Name</Label>
            <Input 
              id="firstName" 
              name="firstName" 
              value={formData.firstName}
              onChange={handleChange}
              placeholder="First and middle names"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            name="lastName" 
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last name"
            required
          />
        </div>

        <div>
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input 
            id="dateOfBirth" 
            name="dateOfBirth" 
            type="date" 
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label>Marital Status</Label>
          <RadioGroup 
            value={formData.maritalStatus} 
            onValueChange={(value: string) => handleRadioChange('maritalStatus', value)}
            className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single">Single</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="defacto" id="defacto" />
              <Label htmlFor="defacto">Defacto Partner</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="married" id="married" />
              <Label htmlFor="married">Married</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="divorced" id="divorced" />
              <Label htmlFor="divorced">Divorced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="widower" id="widower" />
              <Label htmlFor="widower">Widow(er)</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="mobile">Mobile Phone</Label>
          <Input 
            id="mobile" 
            name="mobile" 
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile number"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email address"
            required
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input 
            id="address" 
            name="address" 
            value={formData.address}
            onChange={handleChange}
            placeholder="Street address"
            required
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="suburb">Suburb</Label>
            <Input 
              id="suburb" 
              name="suburb" 
              value={formData.suburb}
              onChange={handleChange}
              placeholder="Suburb"
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input 
              id="state" 
              name="state" 
              value={formData.state}
              onChange={handleChange}
              placeholder="State"
              required
            />
          </div>
          <div>
            <Label htmlFor="postcode">Postcode</Label>
            <Input 
              id="postcode" 
              name="postcode" 
              value={formData.postcode}
              onChange={handleChange}
              placeholder="Postcode"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="tfn">TFN</Label>
          <Input 
            id="tfn" 
            name="tfn" 
            value={formData.tfn}
            onChange={handleChange}
            placeholder="Tax File Number"
          />
        </div>

        <div>
          <Label htmlFor="abn">ABN if Sole Trader</Label>
          <Input 
            id="abn" 
            name="abn" 
            value={formData.abn}
            onChange={handleChange}
            placeholder="ABN"
          />
        </div>

        <div>
          <Label>GST Services Required?</Label>
          <RadioGroup 
            value={formData.gstRequired} 
            onValueChange={(value: string) => handleRadioChange('gstRequired', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="gstYes" />
              <Label htmlFor="gstYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="gstNo" />
              <Label htmlFor="gstNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">Select Yes if you require our GST/BAS Lodgement services.</p>
        </div>

        <div>
          <Label htmlFor="fiscalYear">Fiscal Year Ended</Label>
          <Input 
            id="fiscalYear" 
            name="fiscalYear" 
            type="date"
            value={formData.fiscalYear}
            onChange={handleChange}
            placeholder="Do not insert multiple years"
            required
          />
        </div>

        <div>
          <h3 className="font-semibold mb-2">BANK ACCOUNT for TAX REFUND</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankBsb">BSB No</Label>
              <Input 
                id="bankBsb" 
                name="bankBsb" 
                value={formData.bankBsb}
                onChange={handleChange}
                placeholder="BSB Number"
              />
            </div>
            <div>
              <Label htmlFor="bankAccountNo">Account No</Label>
              <Input 
                id="bankAccountNo" 
                name="bankAccountNo" 
                value={formData.bankAccountNo}
                onChange={handleChange}
                placeholder="Account Number"
              />
            </div>
            <div>
              <Label htmlFor="bankAccountName">Account Name</Label>
              <Input 
                id="bankAccountName" 
                name="bankAccountName" 
                value={formData.bankAccountName}
                onChange={handleChange}
                placeholder="Account Name"
              />
            </div>
            <div>
              <Label htmlFor="bankName">Name of your Bank</Label>
              <Input 
                id="bankName" 
                name="bankName" 
                value={formData.bankName}
                onChange={handleChange}
                placeholder="Bank Name"
              />
            </div>
          </div>
        </div>

        <div>
          <Label>Would you authorise us to update your contact details with the ATO?</Label>
          <RadioGroup 
            value={formData.updateAtoDetails} 
            onValueChange={(value: string) => handleRadioChange('updateAtoDetails', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="updateAtoYes" />
              <Label htmlFor="updateAtoYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="updateAtoNo" />
              <Label htmlFor="updateAtoNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="identification">Upload a Photo Identification</Label>
          <div className="mt-2">
            <Input 
              id="identification"
              type="file"
              onChange={(e) => handleFileChange(e, 'identification')}
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-500 mt-1">Applicable for New Clients: Passport, Driver or Learner's License for verification purposes.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep1;

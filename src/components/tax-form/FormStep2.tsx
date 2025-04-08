import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FormStep2Props {
  formData: any;
  handleRadioChange: (name: string, value: string) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => void;
}

const FormStep2: React.FC<FormStep2Props> = ({ 
  formData, 
  handleRadioChange,
  handleFileChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Part 2: Tax Residency & Offsets</h2>
      <p className="text-gray-600 mb-6">Provide details of Medicare, Private Health Insurance, Spouse, Dependents, if applicable.</p>
      
      <div className="space-y-6">
        <div>
          <Label>An Aussie Citizen / Permanent Resident for Immigration Purposes?</Label>
          <RadioGroup 
            value={formData.citizenStatus || ''} 
            onValueChange={(value: string) => handleRadioChange('citizenStatus', value)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesDuringYear" id="yesDuringYear" />
              <Label htmlFor="yesDuringYear">YES: in Aus during the financial year.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesReturned" id="yesReturned" />
              <Label htmlFor="yesReturned">YES: returned during the financial year from working abroad.</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="noArrived" id="noArrived" />
              <Label htmlFor="noArrived">NO: arrived in Aus during the financial year.</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">For that specific financial year ending 30 June.</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">TAX OFFSETS</h3>
          <p className="text-sm text-gray-600 mb-4">Please provide the information below so we can calculate your tax offsets to reduce your liability.</p>
          
          <div className="space-y-4">
            <div>
              <Label>Have a Spouse during the FY? i.e: husband, de-facto partner, wife?</Label>
              <RadioGroup 
                value={formData.spouse || ''} 
                onValueChange={(value: string) => handleRadioChange('spouse', value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="spouseYes" />
                  <Label htmlFor="spouseYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="spouseNo" />
                  <Label htmlFor="spouseNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Did you have any Dependents during the Financial Year?</Label>
              <RadioGroup 
                value={formData.dependents || ''} 
                onValueChange={(value: string) => handleRadioChange('dependents', value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dependentsYes" />
                  <Label htmlFor="dependentsYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dependentsNo" />
                  <Label htmlFor="dependentsNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Have Medicare card?</Label>
              <RadioGroup 
                value={formData.medicare || ''} 
                onValueChange={(value: string) => handleRadioChange('medicare', value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="medicareYes" />
                  <Label htmlFor="medicareYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="medicareNo" />
                  <Label htmlFor="medicareNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Have Private Health Insurance?</Label>
              <RadioGroup 
                value={formData.privateHealth || ''} 
                onValueChange={(value: string) => handleRadioChange('privateHealth', value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="privateHealthYes" />
                  <Label htmlFor="privateHealthYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="privateHealthNo" />
                  <Label htmlFor="privateHealthNo">No</Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-gray-500 mt-1">If Yes, you must upload the Private Health Insurance Statement. This statement can be obtained via your Insurer's website, phone, or email.</p>
              {formData.privateHealth === 'yes' && (
                <div className="mt-2">
                  <Input 
                    id="privateHealthFile"
                    type="file"
                    onChange={(e) => handleFileChange(e, 'privateHealthFile')}
                    className="cursor-pointer"
                  />
                </div>
              )}
            </div>

            <div>
              <Label>HECS/HELP Debt?</Label>
              <RadioGroup 
                value={formData.hecsDebt || ''} 
                onValueChange={(value: string) => handleRadioChange('hecsDebt', value)}
                className="flex flex-row space-x-4 mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="hecsDebtYes" />
                  <Label htmlFor="hecsDebtYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="hecsDebtNo" />
                  <Label htmlFor="hecsDebtNo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStep2;

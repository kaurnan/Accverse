import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FormStep3Props {
  formData: any;
  handleRadioChange: (name: string, value: string) => void;
}

const FormStep3: React.FC<FormStep3Props> = ({ 
  formData, 
  handleRadioChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Part 3: Taxable Income</h2>
      <p className="text-gray-600 mb-6">Answer to applicable questions only, otherwise, disregard....</p>
      
      <div className="space-y-6">
        <div>
          <Label>SALARY/WAGES?</Label>
          <RadioGroup 
            value={formData.salary} 
            onValueChange={(value: string) => handleRadioChange('salary', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="salaryYes" />
              <Label htmlFor="salaryYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="salaryNo" />
              <Label htmlFor="salaryNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">Income: wages, salaries, commission, retainers, tips etc</p>
        </div>

        <div>
          <Label>INTEREST INCOME?</Label>
          <RadioGroup 
            value={formData.interest} 
            onValueChange={(value: string) => handleRadioChange('interest', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="interestYes" />
              <Label htmlFor="interestYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="interestNo" />
              <Label htmlFor="interestNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>DIVIDENDS / DIVIDEND RE-INVESTMENTS INCOME?</Label>
          <RadioGroup 
            value={formData.dividends} 
            onValueChange={(value: string) => handleRadioChange('dividends', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="dividendsYes" />
              <Label htmlFor="dividendsYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="dividendsNo" />
              <Label htmlFor="dividendsNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">Upload Dividend Statements, or Broker Statement for the FY, if you do not want to complete the table below.</p>
        </div>

        <div>
          <Label>PARTNERSHIP / DECEASED ESTATE OR TRUST INCOME?</Label>
          <RadioGroup 
            value={formData.partnership} 
            onValueChange={(value: string) => handleRadioChange('partnership', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="partnershipYes" />
              <Label htmlFor="partnershipYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="partnershipNo" />
              <Label htmlFor="partnershipNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>PERSONAL SERVICE INCOME?</Label>
          <RadioGroup 
            value={formData.personalServiceIncome} 
            onValueChange={(value: string) => handleRadioChange('personalServiceIncome', value)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesWithVehicle" id="psiWithVehicle" />
              <Label htmlFor="psiWithVehicle">Yes with Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesNoVehicle" id="psiNoVehicle" />
              <Label htmlFor="psiNoVehicle">Yes with NO Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="psiNo" />
              <Label htmlFor="psiNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">If yes with Motor Vehicle, please provide copies of the latest logbook (not more than 4 years old) and a signed declaration confirming the estimated Business/Private usage portion for the year.</p>
        </div>

        <div>
          <Label>SOLE TRADER INCOME?</Label>
          <RadioGroup 
            value={formData.soleTraderIncome} 
            onValueChange={(value: string) => handleRadioChange('soleTraderIncome', value)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesWithVehicle" id="soleTraderWithVehicle" />
              <Label htmlFor="soleTraderWithVehicle">Yes with Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yesNoVehicle" id="soleTraderNoVehicle" />
              <Label htmlFor="soleTraderNoVehicle">Yes with No Motor Vehicle(s)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="soleTraderNo" />
              <Label htmlFor="soleTraderNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>SOLD SHARES, CRYPTO, ETFS, BONDS, OPTIONS etc?</Label>
          <RadioGroup 
            value={formData.soldInvestments} 
            onValueChange={(value: string) => handleRadioChange('soldInvestments', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="soldInvestmentsYes" />
              <Label htmlFor="soldInvestmentsYes">Yes - UPLOAD BUY & SELL ORDERS HISTORY</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="soldInvestmentsNo" />
              <Label htmlFor="soldInvestmentsNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">Do not hide as the ATO already collected data from Brokers/Exchanges.</p>
        </div>

        <div>
          <Label>SOLD RENTAL PROPERTIES?</Label>
          <RadioGroup 
            value={formData.soldRental} 
            onValueChange={(value: string) => handleRadioChange('soldRental', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="soldRentalYes" />
              <Label htmlFor="soldRentalYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="soldRentalNo" />
              <Label htmlFor="soldRentalNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>FOREIGN INCOME SOURCES?</Label>
          <RadioGroup 
            value={formData.foreignIncome} 
            onValueChange={(value: string) => handleRadioChange('foreignIncome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="foreignIncomeYes" />
              <Label htmlFor="foreignIncomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="foreignIncomeNo" />
              <Label htmlFor="foreignIncomeNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">Include income: rental, business, jobs, partnership, trust. dividend, sale of business etc.</p>
        </div>

        <div>
          <Label>INCOME FROM RENTAL PROPERTY YOU OWNED?</Label>
          <RadioGroup 
            value={formData.rentalIncome} 
            onValueChange={(value: string) => handleRadioChange('rentalIncome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="rentalIncomeYes" />
              <Label htmlFor="rentalIncomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="rentalIncomeNo" />
              <Label htmlFor="rentalIncomeNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>SHARING ECONOMY INCOME? e.g. Uber / Airbnb / Ola etc.</Label>
          <RadioGroup 
            value={formData.sharingEconomyIncome} 
            onValueChange={(value: string) => handleRadioChange('sharingEconomyIncome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="sharingEconomyIncomeYes" />
              <Label htmlFor="sharingEconomyIncomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="sharingEconomyIncomeNo" />
              <Label htmlFor="sharingEconomyIncomeNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>PENSION / ANNUITY INCOME FROM SUPERFUND?</Label>
          <RadioGroup 
            value={formData.pensionIncome} 
            onValueChange={(value: string) => handleRadioChange('pensionIncome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="pensionIncomeYes" />
              <Label htmlFor="pensionIncomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="pensionIncomeNo" />
              <Label htmlFor="pensionIncomeNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>RECEIVED SHARES UNDER EMPLOYEE SHARE SCHEMES (ESS)?</Label>
          <RadioGroup 
            value={formData.employeeShareScheme} 
            onValueChange={(value: string) => handleRadioChange('employeeShareScheme', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="essYes" />
              <Label htmlFor="essYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="essNo" />
              <Label htmlFor="essNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>OTHER INCOME NOT LISTED e.g. Centrelink income etc.</Label>
          <RadioGroup 
            value={formData.otherIncome} 
            onValueChange={(value: string) => handleRadioChange('otherIncome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="otherIncomeYes" />
              <Label htmlFor="otherIncomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="otherIncomeNo" />
              <Label htmlFor="otherIncomeNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default FormStep3;

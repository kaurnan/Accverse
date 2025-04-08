import React from 'react';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';

interface FormStep4Props {
  formData: any;
  handleRadioChange: (name: string, value: string) => void;
}

const FormStep4: React.FC<FormStep4Props> = ({ 
  formData, 
  handleRadioChange 
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Part 4: Expenses related Salary/Wages only</h2>
      <p className="text-gray-600 mb-6">Answer applicable questions only, otherwise disregard.</p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-6">
        <h3 className="font-semibold mb-2">To claim a deduction for work-related expenses YOU MUST MEET ALL OF THE ATO'S 3 GOLD RULES:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>You must have spent the money and not been reimbursed,</li>
          <li>The claim must be directly related to earning your taxable income,</li>
          <li>You must have records to prove it.</li>
        </ol>
        <p className="text-sm text-gray-600 mt-2">Please provide details and upload proof of claims for total claims of $300 or more per tax return (not per item).</p>
      </div>
      
      <div className="space-y-6">
        <div>
          <Label>CAR / MOTOR VEHICLE WORK-RELATED EXPENSE?</Label>
          <RadioGroup 
            value={formData.carExpense} 
            onValueChange={(value: string) => handleRadioChange('carExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="carExpenseYes" />
              <Label htmlFor="carExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="carExpenseNo" />
              <Label htmlFor="carExpenseNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">if you use your personal vehicle.</p>
        </div>

        <div>
          <Label>UNIFORM, PROTECTIVE CLOTHING & DRY CLEANING?</Label>
          <RadioGroup 
            value={formData.uniformExpense} 
            onValueChange={(value: string) => handleRadioChange('uniformExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="uniformExpenseYes" />
              <Label htmlFor="uniformExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="uniformExpenseNo" />
              <Label htmlFor="uniformExpenseNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>TRAVEL EXPENSE?</Label>
          <RadioGroup 
            value={formData.travelExpense} 
            onValueChange={(value: string) => handleRadioChange('travelExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="travelExpenseYes" />
              <Label htmlFor="travelExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="travelExpenseNo" />
              <Label htmlFor="travelExpenseNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">This is NOT WORK-RELATED CAR EXPENSE or RELOCATION EXPENSE.</p>
        </div>

        <div>
          <Label>SELF-EDUCATION EXPENSE?</Label>
          <RadioGroup 
            value={formData.educationExpense} 
            onValueChange={(value: string) => handleRadioChange('educationExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="educationExpenseYes" />
              <Label htmlFor="educationExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="educationExpenseNo" />
              <Label htmlFor="educationExpenseNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">the course must directly related to occupation.</p>
        </div>

        <div>
          <Label>PHONE & DATA EXPENSE?</Label>
          <RadioGroup 
            value={formData.phoneExpense} 
            onValueChange={(value: string) => handleRadioChange('phoneExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="phoneExpenseYes" />
              <Label htmlFor="phoneExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="phoneExpenseNo" />
              <Label htmlFor="phoneExpenseNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">If you are required to use personal devices, you can claim the work-related portion of internet & data expenses.</p>
        </div>

        <div>
          <Label>TOOLS & EQUIPMENT?</Label>
          <RadioGroup 
            value={formData.toolsExpense} 
            onValueChange={(value: string) => handleRadioChange('toolsExpense', value)}
            className="flex flex-col space-y-1 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upTo5Items" id="toolsUpTo5" />
              <Label htmlFor="toolsUpTo5">Yes: up to 5 Items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upTo10Items" id="toolsUpTo10" />
              <Label htmlFor="toolsUpTo10">Yes: up to 10 Items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upTo20Items" id="toolsUpTo20" />
              <Label htmlFor="toolsUpTo20">Yes: up to 20 Items</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="toolsNo" />
              <Label htmlFor="toolsNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">e.g. laptop, computer, hand-tools, goggles, calculator etc....</p>
        </div>

        <div>
          <Label>OTHER WORK-RELATED EXPENSES THAT AREN'T LISTED ABOVE?</Label>
          <RadioGroup 
            value={formData.otherWorkExpenses} 
            onValueChange={(value: string) => handleRadioChange('otherWorkExpenses', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="otherWorkExpensesYes" />
              <Label htmlFor="otherWorkExpensesYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="otherWorkExpensesNo" />
              <Label htmlFor="otherWorkExpensesNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>PAID FOR INCOME PROTECTION INSURANCE?</Label>
          <RadioGroup 
            value={formData.incomeProtectionInsurance} 
            onValueChange={(value: string) => handleRadioChange('incomeProtectionInsurance', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="incomeProtectionYes" />
              <Label htmlFor="incomeProtectionYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="incomeProtectionNo" />
              <Label htmlFor="incomeProtectionNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>DONATIONS of $2+?</Label>
          <RadioGroup 
            value={formData.donations} 
            onValueChange={(value: string) => handleRadioChange('donations', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="donationsYes" />
              <Label htmlFor="donationsYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="donationsNo" />
              <Label htmlFor="donationsNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">must be made 'only' to Registered Charities & DGRs. e.g Red Cross, St Vincent DePaul, Bushfire Relief. Not to friends, families, non-DGR churches & schools.</p>
        </div>

        <div>
          <Label>TAX AGENT FEES PAID?</Label>
          <RadioGroup 
            value={formData.taxAgentFees} 
            onValueChange={(value: string) => handleRadioChange('taxAgentFees', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="taxAgentFeesYes" />
              <Label htmlFor="taxAgentFeesYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="taxAgentFeesNo" />
              <Label htmlFor="taxAgentFeesNo">No</Label>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label>PERSONAL SUPER CONTRIBUTION?</Label>
          <RadioGroup 
            value={formData.superContribution} 
            onValueChange={(value: string) => handleRadioChange('superContribution', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="superContributionYes" />
              <Label htmlFor="superContributionYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="superContributionNo" />
              <Label htmlFor="superContributionNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">(NOT EMPLOYER CONTRIBUTION).</p>
        </div>

        <div>
          <Label>INTEREST EXPENSE?</Label>
          <RadioGroup 
            value={formData.interestExpense} 
            onValueChange={(value: string) => handleRadioChange('interestExpense', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="interestExpenseYes" />
              <Label htmlFor="interestExpenseYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="interestExpenseNo" />
              <Label htmlFor="interestExpenseNo">No</Label>
            </div>
          </RadioGroup>
          <p className="text-sm text-gray-500 mt-1">for interest & /or borrowing expenses relating to income earned. DO NOT INCLUDE THE LOAN AMOUNT.</p>
        </div>

        <div>
          <Label>DID YOU WORK FROM HOME?</Label>
          <RadioGroup 
            value={formData.workFromHome} 
            onValueChange={(value: string) => handleRadioChange('workFromHome', value)}
            className="flex flex-row space-x-4 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="workFromHomeYes" />
              <Label htmlFor="workFromHomeYes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="workFromHomeNo" />
              <Label htmlFor="workFromHomeNo">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
};

export default FormStep4;

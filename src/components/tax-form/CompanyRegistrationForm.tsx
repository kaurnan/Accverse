import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { taxSolutionsService } from '../../services/api';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';

const CompanyRegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Company Details
    preferredCompanyName: '',
    identicalToBN: false,
    businessNameABN: '',
    businessNameIdentifier: '',
    reservedName: false,
    trusteeType: 'none',
    stateOfRegistration: 'NSW',
    registeredOfficeAddress: '',
    registeredOfficeOccupier: '',
    occupierConsent: false,
    principalPlaceOfBusiness: '',
    businessActivity: '',
    
    // Officeholder Details
    fullName: '',
    residentialAddress: '',
    dateOfBirth: '',
    placeOfBirth: '',
    officeHeld: 'Director',
    
    // Shareholder Details
    shareholderName: '',
    shareholderACN: '',
    shareholderAddress: '',
    numberOfShares: '100',
    classOfShares: 'Ordinary',
    pricePerShare: '1.00',
    beneficiallyHeld: 'yes',
    
    // Identification Documents
    idDocuments: null as File | null,
    
    // ABN Registration
    isResident: 'yes',
    abnReason: 'new-business',
    abnReasonOther: '',
    firstBusinessInAus: 'yes',
    registrationDate: new Date().toISOString().split('T')[0],
    lessThanThreeMonths: 'no',
    ceaseActivityDate: '',
    multipleLocations: 'no',
    additionalLocations: [],
    governmentOwned: 'no',
    mainIndustry: '',
    mainActivity: '',
    agriculturalProperty: 'no'
  });
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        idDocuments: e.target.files?.[0] || null
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Remove the file from JSON data
      const { idDocuments, ...jsonData } = formData;
      
      const payload = {
        formType: 'company-registration',
        formData: JSON.stringify(jsonData),
        status: 'progress'
      };
      
      const response = await taxSolutionsService.saveProgress(payload);
      setFormId(response.formId);
      
      toast({
        title: "Progress Saved",
        description: "You can continue later using the form ID: " + response.formId,
      });
    } catch (error) {
      console.error('Error saving form:', error);
      toast({
        title: "Error",
        description: "There was a problem saving your progress",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Remove the file from JSON data
      const { idDocuments, ...jsonData } = formData;
      
      const formDataObj = new FormData();
      formDataObj.append('formType', 'company-registration');
      formDataObj.append('formData', JSON.stringify(jsonData));
      
      // Append file if available
      if (formData.idDocuments) {
        formDataObj.append('idDocuments', formData.idDocuments);
      }
      
      await taxSolutionsService.submitTaxForm(formDataObj);
      
      toast({
        title: "Form Submitted",
        description: "Your company registration form has been submitted successfully",
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your form",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-4">Company Registration Checklist</h2>
          <p className="text-gray-600 mb-4">Outlined below is a checklist of the information needed to complete a Company Registration application.</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">COMPANY DETAILS</h3>
          
          <div>
            <Label htmlFor="preferredCompanyName">Preferred company name</Label>
            <Input
              id="preferredCompanyName"
              name="preferredCompanyName"
              required
              value={formData.preferredCompanyName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="identicalToBN" 
                checked={formData.identicalToBN}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, identicalToBN: checked as boolean }));
                }}
              />
              <Label htmlFor="identicalToBN">
                The company name is identical to a registered business name
              </Label>
            </div>
            
            {formData.identicalToBN && (
              <div className="pl-6 space-y-2">
                <div>
                  <Label htmlFor="businessNameABN">ABN of the business name holder</Label>
                  <Input
                    id="businessNameABN"
                    name="businessNameABN"
                    value={formData.businessNameABN}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="businessNameIdentifier">Business name identifier (if registered prior to 28th May 2012)</Label>
                  <Input
                    id="businessNameIdentifier"
                    name="businessNameIdentifier"
                    value={formData.businessNameIdentifier}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="reservedName" 
                checked={formData.reservedName}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, reservedName: checked as boolean }));
                }}
              />
              <Label htmlFor="reservedName">
                The company name has been reserved
              </Label>
            </div>
            
            {formData.reservedName && (
              <div className="pl-6">
                <p className="text-sm text-gray-600">You will need to provide a signed name reservation withdrawal letter signed by the applicant of the initial reservation form.</p>
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="trusteeType">Will the company act solely as the Trustee of a Self-Managed Super Fund, or as a Home Unit company?</Label>
            <Select name="trusteeType" id="trusteeType" value={formData.trusteeType} onChange={handleChange}>
              <option value="none">No</option>
              <option value="smsf">Yes - Trustee of SMSF</option>
              <option value="home-unit">Yes - Home Unit company</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="stateOfRegistration">State of registration</Label>
            <Select name="stateOfRegistration" id="stateOfRegistration" value={formData.stateOfRegistration} onChange={handleChange}>
              <option value="NSW">NSW</option>
              <option value="VIC">VIC</option>
              <option value="QLD">QLD</option>
              <option value="WA">WA</option>
              <option value="SA">SA</option>
              <option value="TAS">TAS</option>
              <option value="ACT">ACT</option>
              <option value="NT">NT</option>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="registeredOfficeAddress">Registered office address (must be located in Australia; PO boxes are not acceptable)</Label>
            <Input
              id="registeredOfficeAddress"
              name="registeredOfficeAddress"
              required
              value={formData.registeredOfficeAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registeredOfficeOccupier">The occupier of the registered office (if not the company)</Label>
            <Input
              id="registeredOfficeOccupier"
              name="registeredOfficeOccupier"
              value={formData.registeredOfficeOccupier}
              onChange={handleChange}
            />
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="occupierConsent" 
                checked={formData.occupierConsent}
                onCheckedChange={(checked) => {
                  setFormData(prev => ({ ...prev, occupierConsent: checked as boolean }));
                }}
              />
              <Label htmlFor="occupierConsent">
                I confirm that the occupier has provided consent in writing
              </Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="principalPlaceOfBusiness">Principal place of business (where the primary business activities will take place; PO boxes are not acceptable)</Label>
            <Input
              id="principalPlaceOfBusiness"
              name="principalPlaceOfBusiness"
              required
              value={formData.principalPlaceOfBusiness}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="businessActivity">What is the nature of your business activity?</Label>
            <Textarea
              id="businessActivity"
              name="businessActivity"
              required
              rows={2}
              value={formData.businessActivity}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">OFFICEHOLDER DETAILS</h3>
          
          <div>
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="residentialAddress">Residential address</Label>
            <Input
              id="residentialAddress"
              name="residentialAddress"
              required
              value={formData.residentialAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth">Date of birth</Label>
              <Input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="placeOfBirth">Place of birth (town and state)</Label>
              <Input
                id="placeOfBirth"
                name="placeOfBirth"
                required
                value={formData.placeOfBirth}
                onChange={handleChange}
                placeholder="e.g. Sydney, NSW"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="officeHeld">Office held</Label>
            <Select name="officeHeld" id="officeHeld" value={formData.officeHeld} onChange={handleChange}>
              <option value="Director">Director</option>
              <option value="Secretary">Secretary</option>
              <option value="Public Officer">Public Officer</option>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">SHAREHOLDER DETAILS</h3>
          
          <div>
            <Label htmlFor="shareholderName">Full Name</Label>
            <Input
              id="shareholderName"
              name="shareholderName"
              required
              value={formData.shareholderName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="shareholderACN">A.C.N. if company</Label>
            <Input
              id="shareholderACN"
              name="shareholderACN"
              value={formData.shareholderACN}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="shareholderAddress">Address</Label>
            <Input
              id="shareholderAddress"
              name="shareholderAddress"
              required
              value={formData.shareholderAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="numberOfShares">Number of shares</Label>
              <Input
                id="numberOfShares"
                name="numberOfShares"
                required
                value={formData.numberOfShares}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="classOfShares">Class of shares</Label>
              <Input
                id="classOfShares"
                name="classOfShares"
                required
                value={formData.classOfShares}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="pricePerShare">Price paid per share</Label>
              <Input
                id="pricePerShare"
                name="pricePerShare"
                required
                value={formData.pricePerShare}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label>Whether the shares are beneficially held or not i.e. are they held in Trust for another party?</Label>
            <RadioGroup
              name="beneficiallyHeld"
              value={formData.beneficiallyHeld}
              onValueChange={(value) => handleRadioChange('beneficiallyHeld', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="beneficially-yes" />
                <Label htmlFor="beneficially-yes">Yes - Beneficially held</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="beneficially-no" />
                <Label htmlFor="beneficially-no">No - Held in trust</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="idDocuments">Attach ID of the shareholders and directors</Label>
            <Input
              id="idDocuments"
              name="idDocuments"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold border-b pb-2">ABN REGISTRATION CHECKLIST</h3>
          
          <div>
            <Label>Is the applicant a resident of Australia for tax purposes?</Label>
            <RadioGroup
              name="isResident"
              value={formData.isResident}
              onValueChange={(value) => handleRadioChange('isResident', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="resident-yes" />
                <Label htmlFor="resident-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="resident-no" />
                <Label htmlFor="resident-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="abnReason">Why is the applicant applying for an ABN?</Label>
            <Select name="abnReason" id="abnReason" value={formData.abnReason} onChange={handleChange}>
              <option value="new-business">Starting a new business</option>
              <option value="takeover">Taking over an existing business</option>
              <option value="change-structure">Changing business structure</option>
              <option value="investment">Investment purposes</option>
              <option value="other">Other</option>
            </Select>
            
            {formData.abnReason === 'other' && (
              <div className="mt-2">
                <Input
                  id="abnReasonOther"
                  name="abnReasonOther"
                  placeholder="Please specify"
                  required
                  value={formData.abnReasonOther}
                  onChange={handleChange}
                />
              </div>
            )}
          </div>
          
          <div>
            <Label>Is this the first time they have had a business in Australia?</Label>
            <RadioGroup
              name="firstBusinessInAus"
              value={formData.firstBusinessInAus}
              onValueChange={(value) => handleRadioChange('firstBusinessInAus', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="first-business-yes" />
                <Label htmlFor="first-business-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="first-business-no" />
                <Label htmlFor="first-business-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="registrationDate">From what date does the applicant require these registrations?</Label>
            <Input
              id="registrationDate"
              name="registrationDate"
              type="date"
              required
              value={formData.registrationDate}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label>Will the applicant will be in business for less than 3 months?</Label>
            <RadioGroup
              name="lessThanThreeMonths"
              value={formData.lessThanThreeMonths}
              onValueChange={(value) => handleRadioChange('lessThanThreeMonths', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="less-than-three-yes" />
                <Label htmlFor="less-than-three-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="less-than-three-no" />
                <Label htmlFor="less-than-three-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.lessThanThreeMonths === 'yes' && (
            <div>
              <Label htmlFor="ceaseActivityDate">What date do they expect to cease activity?</Label>
              <Input
                id="ceaseActivityDate"
                name="ceaseActivityDate"
                type="date"
                required
                value={formData.ceaseActivityDate}
                onChange={handleChange}
              />
            </div>
          )}
          
          <div>
            <Label>Does the applicant have more than one business location in Australia?</Label>
            <RadioGroup
              name="multipleLocations"
              value={formData.multipleLocations}
              onValueChange={(value) => handleRadioChange('multipleLocations', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="multiple-locations-yes" />
                <Label htmlFor="multiple-locations-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="multiple-locations-no" />
                <Label htmlFor="multiple-locations-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Is the applicant owned or controlled by Commonwealth, State, Territory or Local Government?</Label>
            <RadioGroup
              name="governmentOwned"
              value={formData.governmentOwned}
              onValueChange={(value) => handleRadioChange('governmentOwned', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="government-owned-yes" />
                <Label htmlFor="government-owned-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="government-owned-no" />
                <Label htmlFor="government-owned-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="mainIndustry">What is the main Industry in which the applicant operates?</Label>
            <Input
              id="mainIndustry"
              name="mainIndustry"
              required
              value={formData.mainIndustry}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="mainActivity">What is the main activity from which the applicant derives its income?</Label>
            <Input
              id="mainActivity"
              name="mainActivity"
              required
              value={formData.mainActivity}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label>Does the applicant operate an agricultural property?</Label>
            <RadioGroup
              name="agriculturalProperty"
              value={formData.agriculturalProperty}
              onValueChange={(value) => handleRadioChange('agriculturalProperty', value)}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="agricultural-yes" />
                <Label htmlFor="agricultural-yes">YES</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="agricultural-no" />
                <Label htmlFor="agricultural-no">NO</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Form"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CompanyRegistrationForm;

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

const SMSFEstablishmentForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    contactName: '',
    firmName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Australia',
    mobile: '',
    workPhone: '',
    homePhone: '',
    email: '',
    hasFinancialPlanner: 'no',
    receivedAdvice: 'no',
    adviceDocument: null as File | null,
    proposedCompanyName1: '',
    proposedCompanyName2: '',
    sharesPerDirector: '6',
    stateOfRegistration: 'NSW',
    actAsASICAgent: 'yes',
    registeredOfficeAddress: '',
    registeredOfficeCity: '',
    registeredOfficeState: '',
    registeredOfficePostalCode: '',
    registeredOfficeCountry: 'Australia',
    sameAsPrincipalPlace: 'yes',
    principalPlaceOfBusiness: '',
    principalPlaceCity: '',
    principalPlaceState: '',
    principalPlacePostalCode: '',
    principalPlaceCountry: 'Australia',
    proposedFundName: '',
    directorCount: '2',
    openMacquarieCMA: 'yes',
    deliveryMethod: 'electronic',
    additionalInformation: '',
    trusteeDeclaration: false,
  });
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.files?.[0] || null
      }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        formType: 'smsf-establishment',
        formData: JSON.stringify(formData),
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
    
    if (!formData.trusteeDeclaration) {
      toast({
        title: "Error",
        description: "You must agree to the trustee declaration",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('formType', 'smsf-establishment');
      formDataObj.append('formData', JSON.stringify(formData));
      
      // Append file if available
      if (formData.adviceDocument) {
        formDataObj.append('adviceDocument', formData.adviceDocument);
      }
      
      await taxSolutionsService.submitTaxForm(formDataObj);
      
      toast({
        title: "Form Submitted",
        description: "Your SMSF establishment form has been submitted successfully",
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
          <h2 className="text-2xl font-bold mb-4">SMSF Establishment Form</h2>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Customer Details</h3>
          
          <div>
            <Label htmlFor="contactName">Contact Name of person submitting this application</Label>
            <Input
              id="contactName"
              name="contactName"
              required
              value={formData.contactName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="firmName">Firm Name</Label>
            <Input
              id="firmName"
              name="firmName"
              value={formData.firmName}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              placeholder="Address"
              required
              value={formData.address}
              onChange={handleChange}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Select name="state" id="state" value={formData.state} onChange={handleChange}>
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
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div>
              <Label htmlFor="mobile">Mobile</Label>
              <Input
                id="mobile"
                name="mobile"
                required
                value={formData.mobile}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="workPhone">Work Phone</Label>
              <Input
                id="workPhone"
                name="workPhone"
                value={formData.workPhone}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Label htmlFor="homePhone">Home Phone</Label>
              <Input
                id="homePhone"
                name="homePhone"
                value={formData.homePhone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label>Do you have a Financial Planner?</Label>
            <RadioGroup
              name="hasFinancialPlanner"
              value={formData.hasFinancialPlanner}
              onValueChange={(value) => setFormData(prev => ({ ...prev, hasFinancialPlanner: value }))}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="financial-planner-yes" />
                <Label htmlFor="financial-planner-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="financial-planner-no" />
                <Label htmlFor="financial-planner-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.hasFinancialPlanner === 'yes' && (
            <div>
              <Label>Did you receive an advice from your Financial Planner to establish the SMSF?</Label>
              <RadioGroup
                name="receivedAdvice"
                value={formData.receivedAdvice}
                onValueChange={(value) => setFormData(prev => ({ ...prev, receivedAdvice: value }))}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="received-advice-yes" />
                  <Label htmlFor="received-advice-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="received-advice-no" />
                  <Label htmlFor="received-advice-no">No</Label>
                </div>
              </RadioGroup>
              
              {formData.receivedAdvice === 'yes' && (
                <div className="mt-2">
                  <Label htmlFor="adviceDocument">If yes, please upload the advice document</Label>
                  <Input
                    id="adviceDocument"
                    name="adviceDocument"
                    type="file"
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Corporate Trustee Name (subject to availability)</h3>
          
          <div>
            <Label htmlFor="proposedCompanyName1">Proposed Company Name 1</Label>
            <Input
              id="proposedCompanyName1"
              name="proposedCompanyName1"
              required
              value={formData.proposedCompanyName1}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="proposedCompanyName2">Proposed Company Name 2</Label>
            <Input
              id="proposedCompanyName2"
              name="proposedCompanyName2"
              value={formData.proposedCompanyName2}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="sharesPerDirector">Number of shares to be allocated per director</Label>
            <Select name="sharesPerDirector" id="sharesPerDirector" value={formData.sharesPerDirector} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="5">5</option>
              <option value="6">6 (Default)</option>
              <option value="10">10</option>
            </Select>
            <p className="text-sm text-gray-500 mt-1">Our default position is to allocate 6 Ordinary shares per director of the corporate trustee.</p>
          </div>
          
          <div>
            <Label htmlFor="stateOfRegistration">State of Registration</Label>
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
            <Label>Will Accverse Act as ASIC Agent for the Corporate Trustee</Label>
            <RadioGroup
              name="actAsASICAgent"
              value={formData.actAsASICAgent}
              onValueChange={(value) => setFormData(prev => ({ ...prev, actAsASICAgent: value }))}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="asic-agent-yes" />
                <Label htmlFor="asic-agent-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="asic-agent-no" />
                <Label htmlFor="asic-agent-no">No</Label>
              </div>
            </RadioGroup>
            <p className="text-sm text-gray-500 mt-1">(Note: An additional fee of $100.00 plus GST per annum will apply if you appoint us as ASIC agent)</p>
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Registered Office Address</h3>
          <p className="text-sm text-gray-500">(can be your residential address)</p>
          
          <div>
            <Input
              id="registeredOfficeAddress"
              name="registeredOfficeAddress"
              placeholder="Street Address"
              required
              value={formData.registeredOfficeAddress}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="registeredOfficeCity"
                name="registeredOfficeCity"
                placeholder="City"
                required
                value={formData.registeredOfficeCity}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Select name="registeredOfficeState" id="registeredOfficeState" value={formData.registeredOfficeState} onChange={handleChange}>
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
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Input
                id="registeredOfficePostalCode"
                name="registeredOfficePostalCode"
                placeholder="Postal Code"
                required
                value={formData.registeredOfficePostalCode}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <Input
                id="registeredOfficeCountry"
                name="registeredOfficeCountry"
                placeholder="Country"
                required
                value={formData.registeredOfficeCountry}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div>
            <Label>Is the Principal Place of Business the same as the Registered Office Address above?</Label>
            <RadioGroup
              name="sameAsPrincipalPlace"
              value={formData.sameAsPrincipalPlace}
              onValueChange={(value) => setFormData(prev => ({ ...prev, sameAsPrincipalPlace: value }))}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="same-address-yes" />
                <Label htmlFor="same-address-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="same-address-no" />
                <Label htmlFor="same-address-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          {formData.sameAsPrincipalPlace === 'no' && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Principal Place of Business</h3>
              
              <div>
                <Input
                  id="principalPlaceOfBusiness"
                  name="principalPlaceOfBusiness"
                  placeholder="Street Address"
                  required
                  value={formData.principalPlaceOfBusiness}
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="principalPlaceCity"
                    name="principalPlaceCity"
                    placeholder="City"
                    required
                    value={formData.principalPlaceCity}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Select name="principalPlaceState" id="principalPlaceState" value={formData.principalPlaceState} onChange={handleChange}>
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
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    id="principalPlacePostalCode"
                    name="principalPlacePostalCode"
                    placeholder="Postal Code"
                    required
                    value={formData.principalPlacePostalCode}
                    onChange={handleChange}
                  />
                </div>
                
                <div>
                  <Input
                    id="principalPlaceCountry"
                    name="principalPlaceCountry"
                    placeholder="Country"
                    required
                    value={formData.principalPlaceCountry}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="proposedFundName">Proposed Superannuation Fund Name</Label>
            <Input
              id="proposedFundName"
              name="proposedFundName"
              required
              value={formData.proposedFundName}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <Label htmlFor="directorCount">How many directors will the fund have on establishment?</Label>
            <Select name="directorCount" id="directorCount" value={formData.directorCount} onChange={handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
            </Select>
          </div>
          
          <div>
            <Label>Would you like for us to submit an application with Macquarie to open a Macquarie CMA?</Label>
            <RadioGroup
              name="openMacquarieCMA"
              value={formData.openMacquarieCMA}
              onValueChange={(value) => setFormData(prev => ({ ...prev, openMacquarieCMA: value }))}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="macquarie-cma-yes" />
                <Label htmlFor="macquarie-cma-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="macquarie-cma-no" />
                <Label htmlFor="macquarie-cma-no">No</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label>Method of Delivery</Label>
            <RadioGroup
              name="deliveryMethod"
              value={formData.deliveryMethod}
              onValueChange={(value) => setFormData(prev => ({ ...prev, deliveryMethod: value }))}
              className="flex items-center space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="electronic" id="delivery-electronic" />
                <Label htmlFor="delivery-electronic">Electronic</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hardcopy" id="delivery-hardcopy" />
                <Label htmlFor="delivery-hardcopy">Hard Copy - additional charges will apply</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div>
            <Label htmlFor="additionalInformation">Additional Information / Special instructions</Label>
            <Textarea
              id="additionalInformation"
              name="additionalInformation"
              rows={4}
              value={formData.additionalInformation}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Input
              id="trusteeDeclaration"
              name="trusteeDeclaration"
              type="checkbox"
              className="mt-1"
              checked={formData.trusteeDeclaration}
              onChange={handleChange}
            />
            <Label htmlFor="trusteeDeclaration" className="font-semibold">
              Trustee Declaration (required)
            </Label>
          </div>
          <p className="ml-6 mt-2">I hereby authorise Accverse to complete and lodge the ABN and TFN application for this Fund on behalf of the trustees, and declare that all information provided in this application form is true and correct. The ATO may contact you as a trustee of the fund to confirm that you understand their duties and obligations as a trustee.</p>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Progress"}
          </Button>
          <Button type="submit" disabled={loading || !formData.trusteeDeclaration}>
            {loading ? "Submitting..." : "Submit and Proceed to Payment"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SMSFEstablishmentForm;

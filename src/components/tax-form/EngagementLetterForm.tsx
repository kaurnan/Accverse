import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { taxSolutionsService } from '../../services/api';

const EngagementLetterForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    entityType: 'individual',
    streetAddress: '',
    streetAddressLine2: '',
    suburb: '',
    state: '',
    postcode: '',
  });
  const [loading, setLoading] = useState(false);
  const [formId, setFormId] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        formType: 'engagement',
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
    setLoading(true);
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('formType', 'engagement');
      formDataObj.append('formData', JSON.stringify(formData));
      
      await taxSolutionsService.submitTaxForm(formDataObj);
      
      toast({
        title: "Form Submitted",
        description: "Your engagement letter has been submitted successfully",
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
          <h2 className="text-2xl font-bold mb-4">ENGAGEMENT LETTER</h2>
          <p className="text-gray-600 mb-4">FOR SOLE TRADER | COMPANY | TRUST | PARTNERSHIP | SMSF</p>
          <p className="mb-4">Please thoroughly read, fill out and then sign the last page of this letter. This letter is to be submitted in conjunction with our Sole Trader / Business clients Intake Tax Checklist Forms.</p>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="date">Today's Date*</Label>
            <Input
              id="date"
              name="date"
              type="date"
              required
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label htmlFor="entityType">Entity Structure*</Label>
            <Select name="entityType" id="entityType" value={formData.entityType} onChange={handleSelectChange}>
              <option value="individual">Individual / Sole Trader</option>
              <option value="company">Company</option>
              <option value="partnership">Partnership</option>
              <option value="trust">Trust</option>
              <option value="smsf">SMSF</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="streetAddress">Address*</Label>
            <Input
              id="streetAddress"
              name="streetAddress"
              placeholder="Street Address"
              required
              value={formData.streetAddress}
              onChange={handleChange}
            />
            <Input
              id="streetAddressLine2"
              name="streetAddressLine2"
              placeholder="Street Address Line 2"
              value={formData.streetAddressLine2}
              onChange={handleChange}
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                id="suburb"
                name="suburb"
                placeholder="Suburb"
                required
                value={formData.suburb}
                onChange={handleChange}
              />
              <Input
                id="state"
                name="state"
                placeholder="State"
                required
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <Input
              id="postcode"
              name="postcode"
              placeholder="Postcode"
              required
              value={formData.postcode}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-bold mb-2">ENGAGEMENT LETTER – Income Tax Return, Financial Statements Preparation</h3>
          <p>As our newest client, we would like to officially welcome you to Accverse. The following outlines the services that we provide in our role and more importantly our understanding of your requirements from us.</p>
          <div className="mt-4">
            <p className="font-semibold">Declaration:</p>
            <p>You hereby appoint Accverse to act as your accountant &/or tax agent. We will add you to our tax agent portal and liaise with the ATO on your behalf as required.</p>
            <p>You declare that all the information you have provided to us is correct and complete to the best of your knowledge.</p>
          </div>
        </div>

        <div>
          <Label htmlFor="signature">Owner / Director / Partner / Trustee / Manager 1 Signature*</Label>
          <div className="h-32 border border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Signature capture will be implemented here</p>
          </div>
        </div>

        <div className="flex space-x-4">
          <Button type="button" variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EngagementLetterForm;

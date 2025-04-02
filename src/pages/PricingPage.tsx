import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, HelpCircle } from 'lucide-react';
import PricingCard from '../components/PricingCard';

const PricingPage = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  
  const individualPlans = [
    {
      title: "Basic Tax Return",
      price: billingPeriod === 'monthly' ? "$66" : "$66",
      period: "per return",
      description: "Simple tax return for individuals with salary/wages and basic deductions.",
      features: [
        "Income from salary and wages",
        "Basic deductions",
        "Tax offsets and rebates",
        "Email and phone support",
        "Secure document upload",
        "14-day turnaround"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    },
    {
      title: "Standard Tax Return",
      price: billingPeriod === 'monthly' ? "$132" : "$132",
      period: "per return",
      description: "Comprehensive tax return for individuals with multiple income sources.",
      features: [
        "All Basic features",
        "Investment income",
        "Rental properties (1 property)",
        "Capital gains",
        "Work-related expenses",
        "7-day turnaround"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: true
    },
    {
      title: "Premium Tax Return",
      price: billingPeriod === 'monthly' ? "$220" : "$220",
      period: "per return",
      description: "Complex tax return for individuals with extensive investments and deductions.",
      features: [
        "All Standard features",
        "Multiple rental properties",
        "Complex investments",
        "Foreign income",
        "Priority processing",
        "3-day turnaround",
        "Year-round tax support"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    }
  ];
  
  const businessPlans = [
    {
      title: "Sole Trader",
      price: billingPeriod === 'monthly' ? "$999" : "$999",
      period: "per year",
      description: "Tax and accounting services for sole traders and freelancers.",
      features: [
        "Business tax return",
        "Personal tax return",
        "BAS/IAS preparation (4 per year)",
        "Basic bookkeeping",
        "Tax planning advice",
        "Email and phone support"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    },
    {
      title: "Small Business",
      price: billingPeriod === 'monthly' ? "$1,999" : "$1,999",
      period: "per year",
      description: "Comprehensive accounting and tax services for small businesses.",
      features: [
        "Company tax return",
        "Financial statements",
        "BAS/IAS preparation (4 per year)",
        "Payroll processing (up to 5 employees)",
        "Tax planning strategies",
        "Dedicated accountant",
        "Quarterly review meetings"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: true
    },
    {
      title: "Growing Business",
      price: billingPeriod === 'monthly' ? "$3,499" : "$3,499",
      period: "per year",
      description: "Advanced accounting and tax services for growing businesses.",
      features: [
        "All Small Business features",
        "Payroll processing (up to 15 employees)",
        "Monthly financial reporting",
        "Cash flow forecasting",
        "Business advisory services",
        "Monthly review meetings",
        "Priority support"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    }
  ];
  
  const vcfoPlans = [
    {
      title: "Startup VCFO",
      price: billingPeriod === 'monthly' ? "$499" : "$5,988",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "Virtual CFO services for startups and early-stage businesses.",
      features: [
        "Monthly financial statements",
        "Cash flow management",
        "Basic financial analysis",
        "Quarterly strategy sessions",
        "Email and phone support",
        "Annual budget preparation"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    },
    {
      title: "Growth VCFO",
      price: billingPeriod === 'monthly' ? "$999" : "$11,988",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "Comprehensive VCFO services for growing businesses.",
      features: [
        "All Startup features",
        "KPI development and tracking",
        "Monthly strategy sessions",
        "Financial modeling",
        "Investor reporting",
        "Dedicated financial advisor",
        "Priority support"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: true
    },
    {
      title: "Enterprise VCFO",
      price: billingPeriod === 'monthly' ? "$1,999" : "$23,988",
      period: billingPeriod === 'monthly' ? "per month" : "per year",
      description: "Advanced VCFO services for established businesses.",
      features: [
        "All Growth features",
        "Weekly financial updates",
        "Advanced financial analysis",
        "Strategic planning",
        "Board meeting preparation",
        "M&A support",
        "24/7 priority access"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    }
  ];
  
  const smsfPlans = [
    {
      title: "SMSF Basic",
      price: billingPeriod === 'monthly' ? "$900" : "$900",
      period: "per year",
      description: "Essential SMSF administration and compliance services.",
      features: [
        "Annual financial statements",
        "SMSF tax return",
        "Member statements",
        "Compliance monitoring",
        "ATO correspondence handling",
        "Email and phone support"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    },
    {
      title: "SMSF Standard",
      price: billingPeriod === 'monthly' ? "$1,500" : "$1,500",
      period: "per year",
      description: "Comprehensive SMSF management for funds with diverse investments.",
      features: [
        "All Basic features",
        "Quarterly reporting",
        "Investment strategy review",
        "Pension calculations",
        "Contribution monitoring",
        "Dedicated SMSF specialist",
        "Online access to fund information"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: true
    },
    {
      title: "SMSF Premium",
      price: billingPeriod === 'monthly' ? "$2,200" : "$2,200",
      period: "per year",
      description: "Advanced SMSF management for complex funds with property and other assets.",
      features: [
        "All Standard features",
        "Monthly reporting",
        "Property investment support",
        "Estate planning assistance",
        "Strategic advice",
        "Priority processing",
        "Annual strategy meeting"
      ],
      buttonText: "Get Started",
      buttonLink: "/booking",
      highlighted: false
    }
  ];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Transparent Pricing Plans</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include our expert service and support.
          </p>
          
          {/* Toggle for VCFO and SMSF plans */}
          <div className="mt-8 inline-flex items-center p-1 bg-gray-100 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-4 py-2 text-sm font-medium rounded-md ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Yearly <span className="text-xs text-green-600 ml-1">(Save 15%)</span>
            </button>
          </div>
        </div>
        
        {/* Individual Tax Returns */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Tax Returns</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Professional tax preparation services for individuals at competitive rates.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {individualPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
        
        {/* Business Tax & Accounting */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Tax & Accounting</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive tax and accounting solutions for businesses of all sizes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {businessPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
        
        {/* Virtual CFO Services */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Virtual CFO Services</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Strategic financial guidance and support without the cost of a full-time CFO.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {vcfoPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
        
        {/* SMSF Management */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">SMSF Management</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Expert administration and compliance services for self-managed super funds.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {smsfPlans.map((plan, index) => (
              <PricingCard key={index} {...plan} />
            ))}
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-md p-8 mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                What's included in the tax return services?
              </h3>
              <p className="mt-2 text-gray-600">
                Our tax return services include a comprehensive review of your financial information, identification of all eligible deductions and credits, preparation and lodgment of your tax return, and ongoing support for any ATO inquiries.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                How does the Virtual CFO service work?
              </h3>
              <p className="mt-2 text-gray-600">
                Our Virtual CFO service provides you with a dedicated financial advisor who works with you remotely to manage your financial operations, provide strategic guidance, and help you make informed business decisions. We schedule regular meetings and provide ongoing support based on your chosen plan.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                Can I upgrade or downgrade my plan later?
              </h3>
              <p className="mt-2 text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. If you upgrade, we'll prorate the difference. If you downgrade, the changes will take effect at the start of your next billing cycle.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                Do you offer custom packages for specific needs?
              </h3>
              <p className="mt-2 text-gray-600">
                Absolutely! We understand that every business and individual has unique needs. Contact us to discuss your specific requirements, and we'll create a custom package tailored to your situation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <HelpCircle className="h-5 w-5 text-blue-500 mr-2" />
                What payment methods do you accept?
              </h3>
              <p className="mt-2 text-gray-600">
                We accept all major credit cards, direct bank transfers, and BPAY. For ongoing services, we offer convenient monthly payment plans.
              </p>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-blue-700 rounded-xl shadow-md p-8 mt-16 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still have questions?</h2>
          <p className="text-lg text-blue-100 mb-6">
            Our team is ready to help you find the perfect solution for your accounting and tax needs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/contact" 
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md hover:bg-blue-50 transition-colors"
            >
              Contact Us
            </Link>
            <Link 
              to="/booking" 
              className="px-6 py-3 bg-transparent border border-white text-white font-medium rounded-md hover:bg-blue-800 transition-colors"
            >
              Schedule a Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
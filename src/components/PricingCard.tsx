import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

interface PricingCardProps {
  title: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  buttonText?: string;
  buttonLink: string;
}

const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  period,
  description,
  features,
  highlighted = false,
  buttonText = 'Get Started',
  buttonLink,
}) => {
  return (
    <div 
      className={`rounded-xl p-6 border-2 ${
        highlighted 
          ? 'border-blue-500 bg-blue-50 relative overflow-hidden' 
          : 'border-gray-200 bg-white'
      } h-full flex flex-col`}
    >
      {highlighted && (
        <div className="absolute top-0 right-0">
          <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 transform rotate-45 translate-x-2 -translate-y-1">
            Popular
          </div>
        </div>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-gray-500 ml-1">{period}</span>
      </div>
      
      <p className="text-gray-600 mb-6">{description}</p>
      
      <ul className="space-y-3 mb-8 flex-grow">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className={`h-5 w-5 mr-2 ${highlighted ? 'text-blue-500' : 'text-green-500'}`} />
            <span className="text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Link
        to={buttonLink}
        className={`py-3 px-4 rounded-md text-center font-medium transition-colors mt-auto ${
          highlighted
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
        }`}
      >
        {buttonText}
      </Link>
    </div>
  );
};

export default PricingCard;
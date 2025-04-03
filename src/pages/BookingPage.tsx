import React from 'react';
import { Calendar, Clock, CheckCircle, Users, Video } from 'lucide-react';
import TeamsBookingForm from '../components/TeamsBookingForm';
import { useNavigate } from "react-router-dom"
import {useAuth} from "../components/AuthContext"

const BookingPage = () => {
  const {isAuthenticated} = useAuth()
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Book a Consultation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Schedule a consultation with one of our experts using Microsoft Teams. Connect your Microsoft account to manage the meeting in your calendar.
          </p>
        </div>
        {isAuthenticated && (
        <div className="text-center py-8">
          <button
            onClick={() => navigate('/appointments')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Calendar className="mr-2 h-5 w-5" />
            View My Appointments
          </button>
        </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Microsoft Teams Meeting</h2>
              <TeamsBookingForm />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What to Expect</h2>
              
              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Video className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Microsoft Teams Meeting</h3>
                    <p className="mt-2 text-gray-600">
                      Connect your Microsoft account to create a Teams meeting that will be added directly to your calendar and sent to all attendees.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Calendar className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Outlook Calendar Integration</h3>
                    <p className="mt-2 text-gray-600">
                      Your appointment will be automatically added to your Outlook calendar with all the meeting details and a link to join.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Users className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Expert Matching</h3>
                    <p className="mt-2 text-gray-600">
                      We'll match you with the right specialist based on your needs, whether it's tax planning, business accounting, SMSF management, or other services.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Personalized Plan</h3>
                    <p className="mt-2 text-gray-600">
                      After the consultation, we'll provide a customized proposal outlining our recommended services, pricing, and next steps for your specific situation.
                    </p>
                  </div>
                </div>
                
                <div className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
                      <Clock className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Flexible Scheduling</h3>
                    <p className="mt-2 text-gray-600">
                      Choose a time that works for you. The meeting will sync with your Outlook calendar and provide automatic reminders.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 rounded-xl border border-blue-100 p-8">
              <h3 className="text-lg font-medium text-blue-800 mb-4">Prepare for Your Teams Meeting</h3>
              <p className="text-blue-700 mb-4">
                To make the most of your consultation, consider preparing the following:
              </p>
              <ul className="space-y-2 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>A list of your specific questions or concerns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Basic information about your financial situation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Any relevant financial documents you can share during the call</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Your goals and timeline for financial services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Test your Microsoft Teams setup before the meeting</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
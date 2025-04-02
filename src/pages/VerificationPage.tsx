import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as api from '../services/api';

const VerificationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email'); // Added to capture email from URL if available
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [emailForResend, setEmailForResend] = useState(email || '');
  const [isResending, setIsResending] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      if (!token) {
        toast.error('Invalid verification link');
        setVerifying(false);
        return;
      }

      try {
        await api.verifyAccount(token);
        setVerified(true);
        toast.success('Account verified successfully! You can now login.');
      } catch (error) {
        console.error('Verification error:', error);
        toast.error('Verification failed. Please try again or contact support.');
      } finally {
        setVerifying(false);
      }
    };

    verifyAccount();
  }, [token, navigate]);

  const handleResendVerification = async () => {
    if (!emailForResend) {
      toast.error('Please enter your email address');
      return;
    }

    setIsResending(true);

    try {
      await api.resendVerification(emailForResend);
      toast.success('Verification email has been resent. Please check your inbox.');
    } catch (error) {
      console.error('Resend verification error:', error);
      // Error toast is already shown by the API service
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {verifying ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mb-4"></div>
              <p className="text-gray-700">Verifying your account...</p>
            </div>
          ) : verified ? (
            <div className="text-center">
              <svg
                className="h-16 w-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Verification Successful</h3>
              <p className="mt-2 text-gray-600">Your account has been verified successfully.</p>
              <button
                onClick={() => navigate('/login')}
                className="mt-6 w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Go to Login
              </button>
            </div>
          ) : (
            <div className="text-center">
              <svg
                className="h-16 w-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <h3 className="mt-4 text-xl font-medium text-gray-900">Verification Failed</h3>
              <p className="mt-2 text-gray-600">
                Unable to verify your account. The link may be invalid or expired.
              </p>
              
              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 text-left mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={emailForResend}
                    onChange={(e) => setEmailForResend(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <button
                  onClick={handleResendVerification}
                  disabled={isResending || !emailForResend}
                  className="w-full px-4 py-2 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;

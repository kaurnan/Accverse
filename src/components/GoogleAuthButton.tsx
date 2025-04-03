"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { signInWithGoogle, signOutFromGoogle } from "../services/firebase"
import { useAuth } from "./AuthContext"
import { useNavigate } from "react-router-dom"
import { googleAuth } from "../services/api"

interface GoogleAuthButtonProps {
  className?: string
}

interface GoogleAuthError extends Error {
  message: string;
  code?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ className = "" }) => {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      console.log("Starting Google sign-in process...")
      const response = await signInWithGoogle()
      
      if (response && response.token && response.user) {
        console.log("Firebase authentication successful, proceeding with backend verification")
        // Store Firebase token temporarily
        const firebaseToken = response.token
        const googleUser = response.user
        
        // Check if user exists in our backend
        try {
          const backendResponse = await googleAuth({
            firebase_token: firebaseToken,
            email: googleUser.email || '',
            name: googleUser.name || '',
            firebase_uid: googleUser.id
          })
          
          console.log("Backend response:", backendResponse)
          
          if (backendResponse.isNewUser) {
            console.log("New user detected, redirecting to complete registration")
            // User doesn't exist in backend, navigate to complete registration
            // Store Google data temporarily for the registration form
            sessionStorage.setItem("googleAuthData", JSON.stringify({
              email: googleUser.email,
              name: googleUser.name,
              firebase_uid: googleUser.id,
              firebase_token: firebaseToken
            }))
            
            // Navigate to complete registration
            navigate("/complete-registration")
          } else {
            // User exists, authenticate normally
            localStorage.setItem("token", backendResponse.token)
            localStorage.setItem("user", JSON.stringify(backendResponse.user))
            
            // Update auth context
            login(backendResponse.user, backendResponse.token)
            
            toast.success("Successfully signed in with Google!")
            navigate("/")
          }
        } catch (error) {
          console.error("Backend authentication error:", error)
          const errorMessage = error instanceof Error ? error.message : "Failed to authenticate with backend"
          toast.error(errorMessage)
          // Sign out from Firebase to clean up state
          await signOutFromGoogle()
        }
      }
    } catch (error) {
      console.error("Google sign in error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in with Google"
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 ${className}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24">
            <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
              <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
              <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
              <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
              <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
            </g>
          </svg>
          Sign in with Google
        </>
      )}
    </button>
  )
}

export default GoogleAuthButton

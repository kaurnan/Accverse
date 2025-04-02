"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { ArrowLeft, Send, Check, KeyRound, Clock, Eye, EyeOff } from "lucide-react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import * as api from "../services/api"

interface RequestFormData {
  email: string
}

interface ResetFormData {
  password: string
  confirmPassword: string
}

const ForgotPasswordPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tokenExpiry, setTokenExpiry] = useState<number | null>(null)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  // Get token from URL query parameters
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get("token")
  const expiryParam = queryParams.get("expiry")
  const emailParam = queryParams.get("email")

  // Set email from URL if present
  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [emailParam])

  // Set up token expiry timer
  useEffect(() => {
    if (token && expiryParam) {
      console.log(`Token: ${token}, Expiry param: ${expiryParam}`)
      const expiryTime = parseInt(expiryParam, 10)
      setTokenExpiry(expiryTime)

      const calculateRemaining = () => {
        const now = Math.floor(Date.now() / 1000)
        console.log(`Current time: ${now}, Expiry time: ${expiryTime}, Difference: ${expiryTime - now}`)
        
        const remaining = expiryTime - now
        setRemainingTime(remaining > 0 ? remaining : 0)
        
        if (remaining <= 0) {
          setTokenExpired(true)
        }
        
        return remaining
      }

      // Initial calculation
      const remaining = calculateRemaining()
      console.log(`Initial remaining time: ${remaining} seconds`)

      // Set up interval to update remaining time
      if (remaining > 0) {
        const interval = setInterval(() => {
          const newRemaining = calculateRemaining()
          if (newRemaining <= 0) {
            clearInterval(interval)
            setTokenExpired(true)
            toast.error("Password reset link has expired. Please request a new one.")
          }
        }, 1000)

        return () => clearInterval(interval)
      } else {
        setTokenExpired(true)
        toast.error("Password reset link has expired. Please request a new one.")
      }
    }
  }, [token, expiryParam])

  // Format remaining time as MM:SS
  const formatTime = (seconds: number | null) => {
    if (seconds === null) return "--:--"
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const {
    register: registerRequest,
    handleSubmit: handleSubmitRequest,
    formState: { errors: requestErrors, isSubmitting: isRequestSubmitting },
    setValue: setRequestValue
  } = useForm<RequestFormData>({
    defaultValues: {
      email: email || ""
    }
  })

  // Update form value if email changes
  useEffect(() => {
    if (email) {
      setRequestValue("email", email)
    }
  }, [email, setRequestValue])

  const {
    register: registerReset,
    handleSubmit: handleSubmitReset,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
    watch,
  } = useForm<ResetFormData>()

  // Check if token is present in URL and show reset form
  useEffect(() => {
    if (token) {
      setIsResetting(true)
    }
  }, [token])

  const onSubmitRequest = async (data: RequestFormData) => {
    try {
      console.log("Submitting reset request for:", data.email)
      await api.resetPasswordRequest(data.email)
      setEmail(data.email)
      setIsSubmitted(true)
      toast.success("Password reset instructions sent to your email")
    } catch (error) {
      console.error("Password reset request error:", error)
      // We don't show specific errors for security reasons
      // Just show a generic success message even if the email doesn't exist
      setIsSubmitted(true)
      toast.success("If your email is registered, you will receive reset instructions")
    }
  }

  const onRequestNewLink = async () => {
    if (!email) return
    
    try {
      await api.resetPasswordRequest(email)
      toast.success("New password reset link sent to your email")
    } catch (error) {
      console.error("Error sending new reset link:", error)
      toast.error("Failed to send new reset link. Please try again.")
    }
  }

  const onSubmitReset = async (data: ResetFormData) => {
    if (!token) {
      toast.error("Invalid or missing reset token")
      return
    }

    try {
      console.log(`Submitting password reset with token: ${token}`)
      const response = await api.resetPassword(token, data.password)
      console.log("Reset password response:", response)
      setResetSuccess(true)
      toast.success("Password reset successful! You can now login with your new password.")
    } catch (error) {
      console.error("Password reset error:", error)
      if (error instanceof Error) {
        toast.error(`Failed to reset password: ${error.message}`)
      } else {
        toast.error("Failed to reset password. The link may be expired or invalid.")
      }
    }
  }

  // Render reset form if token is present
  if (isResetting) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-blue-600 px-6 py-4 text-center">
          <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mb-2">
            <KeyRound className="h-5 w-5 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
          <p className="text-blue-100 text-sm">Enter your new password below</p>

          {remainingTime !== null && !tokenExpired && (
            <div className="mt-2 flex items-center justify-center text-xs text-blue-100">
              <Clock className="h-3 w-3 mr-1" />
              <span>Link expires in {formatTime(remainingTime)}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-4">
          {resetSuccess ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Password Reset Successful</h3>
              <p className="text-sm text-gray-500 mb-4">
                Your password has been reset successfully. You can now login with your new password.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Go to Login
              </button>
            </div>
          ) : tokenExpired ? (
            <div className="text-center py-4">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-3">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Link Expired</h3>
              <p className="text-sm text-gray-500 mb-4">
                This password reset link has expired. Please request a new link.
              </p>
              <button
                onClick={onRequestNewLink}
                disabled={!email}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Request New Link
              </button>
              <div className="flex items-center justify-center mt-4">
                <Link to="/forgot-password" className="text-xs font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back to reset page
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmitReset(onSubmitReset)} className="space-y-4 py-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${resetErrors.password ? "border-red-500" : "border-gray-300"}`}
                    {...registerReset("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {resetErrors.password && <p className="mt-1 text-xs text-red-600">{resetErrors.password.message}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${resetErrors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                    {...registerReset("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) => value === watch("password") || "Passwords do not match",
                    })}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                  {resetErrors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{resetErrors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isResetSubmitting}
                  className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  {isResetSubmitting ? "Resetting..." : "Reset Password"}
                </button>
              </div>

              <div className="flex items-center justify-center mt-4">
                <Link to="/login" className="text-xs font-medium text-blue-600 hover:text-blue-500 flex items-center">
                  <ArrowLeft className="mr-1 h-3 w-3" /> Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }

  // Render request password reset form
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-center">
        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 mb-2">
          <KeyRound className="h-5 w-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-white">Reset Your Password</h2>
        <p className="text-blue-100 text-sm">
          Enter your email address and we'll send you instructions to reset your password
        </p>
      </div>

      <div className="px-6 py-4">
        {isSubmitted ? (
          <div className="text-center py-4">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-3">
              <Send className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Check Your Email</h3>
            <p className="text-sm text-gray-500 mb-4">
              We've sent password reset instructions to your email address. Please check your inbox.
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Didn't receive an email?
            </p>
            <button
              onClick={onRequestNewLink}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-3"
            >
              Resend Reset Link
            </button>
            <button
              onClick={() => navigate("/login")}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitRequest(onSubmitRequest)} className="space-y-4 py-2">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${requestErrors.email ? "border-red-500" : "border-gray-300"}`}
                {...registerRequest("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {requestErrors.email && <p className="mt-1 text-xs text-red-600">{requestErrors.email.message}</p>}
            </div>

            <div>
              <button
                type="submit"
                disabled={isRequestSubmitting}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isRequestSubmitting ? "Sending..." : "Send Reset Instructions"}
              </button>
            </div>

            <div className="flex items-center justify-center mt-4">
              <Link to="/login" className="text-xs font-medium text-blue-600 hover:text-blue-500 flex items-center">
                <ArrowLeft className="mr-1 h-3 w-3" /> Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, LogIn, AlertCircle } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useAuth } from "./AuthContext"
import * as api from "../services/api"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import GoogleAuthButton from "./GoogleAuthButton"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null)
  const [isResendingVerification, setIsResendingVerification] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    getValues,
  } = useForm<FormData>({
    defaultValues: {
      email: localStorage.getItem("rememberedEmail") || "",
      rememberMe: !!localStorage.getItem("rememberedEmail"),
    },
  })

  const handleResendVerification = async () => {
    const email = unverifiedEmail || getValues("email")
    if (!email) return

    try {
      setIsResendingVerification(true)
      await api.resendVerification(email)
      toast.success("Verification email resent! Please check your inbox.")
    } catch (error) {
      console.error("Resend verification error:", error)
      toast.error("Failed to resend verification email. Please try again.")
    } finally {
      setIsResendingVerification(false)
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.login(data.email, data.password)

      // Store token and user data
      localStorage.setItem("token", response.token)
      localStorage.setItem("user", JSON.stringify({...response.user, provider: 'api'}))

      // Remember me functionality
      if (data.rememberMe) {
        localStorage.setItem("rememberedEmail", data.email)
      } else {
        localStorage.removeItem("rememberedEmail")
      }

      // Update auth context
      login({...response.user, provider: 'api'}, response.token)

      toast.success("Login successful!")

      // Redirect to home page
      navigate("/")
    } catch (error) {
      console.error("Login error:", error)

      // Check if the error is about unverified account
      if (error instanceof Error && error.message.includes("not verified")) {
        setUnverifiedEmail(data.email)
      } else {
        toast.error("Invalid email or password. Please try again.")
      }
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-blue-600 px-6 py-4 text-center">
        <h2 className="text-xl font-bold text-white">Sign In</h2>
        <p className="text-blue-100 text-sm">Access your account</p>
      </div>

      <div className="px-6 py-4">
        {unverifiedEmail && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-4 w-4 text-yellow-400" />
              </div>
              <div className="ml-3">
                <p className="text-xs text-yellow-700">
                  Your account has not been verified. Please check your email for a verification link.
                </p>
                <button
                  type="button"
                  className="mt-1 text-xs font-medium text-yellow-700 hover:text-yellow-600 underline"
                  onClick={handleResendVerification}
                  disabled={isResendingVerification}
                >
                  {isResendingVerification ? "Sending..." : "Resend verification email"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Google Auth Button */}
        <div className="mb-4">
          <GoogleAuthButton />
        </div>

        <div className="relative flex py-3 items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-xs">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              className={errors.email ? "border-red-500" : ""}
              placeholder="john@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                className={errors.password ? "border-red-500" : ""}
                placeholder="••••••••"
                {...register("password", {
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
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                {...register("rememberMe")}
              />
              <label htmlFor="rememberMe" className="ml-2 block text-xs text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-xs">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Sign in <LogIn className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>

          <div className="text-center mt-4">
            <p className="text-xs text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Register now
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginForm

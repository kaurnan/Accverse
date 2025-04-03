import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    // Ensure content-type is set for all requests
    config.headers["Content-Type"] = "application/json"
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}: Status ${response.status}`)
    return response
  },
  async (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status, data, config } = error.response
      console.error(`Server error: ${status}`, data)

      // Handle 401 Unauthorized - Try to refresh token if not already trying to refresh
      if (status === 401 && !config.url.includes('/auth/refresh-token')) {
        try {
          console.log("Token expired, attempting to refresh...")
          // Get the current token from localStorage (don't use the one from closure)
          const currentToken = localStorage.getItem("token")

          // Only attempt refresh if we actually have a token
          if (currentToken) {
            const refreshResult = await refreshToken()
            if (refreshResult) {
              // Retry the original request with new token
              const newToken = localStorage.getItem("token")
              config.headers.Authorization = `Bearer ${newToken}`
              return axios(config)
            }
          } else {
            console.log("No token available for refresh")
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError)
          // Only redirect to login if we're not already there
          if (!window.location.pathname.includes('/login')) {
            console.log("Redirecting to login after failed token refresh")
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
          }
        }
      }

      // Create error with server message
      const errorMessage = data.error || "An error occurred"
      return Promise.reject(new Error(errorMessage))
    }

    // Network error or other issues
    console.error("Network or other error:", error.message)
    return Promise.reject(new Error("Network error. Please check your connection."))
  },
)

export const refreshToken = async (): Promise<string | null> => {
  try {
    console.log("Calling refresh token endpoint")
     // Get the current token (not from closure)
     const currentToken = localStorage.getItem("token")
    
     // Don't attempt to refresh if no token exists
     if (!currentToken) {
       console.log("No token to refresh")
       return null
     }
    const response = await apiClient.post("/auth/refresh-token", {})
    if (response.data && response.data.token) {
      console.log("Token refreshed successfully")
      localStorage.setItem("token", response.data.token)
      return response.data.token
    }
    return null
  } catch (error) {
    console.error("Error refreshing token:", error)
    throw error
  }
}

// Auth API calls
export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/auth/login", { email, password })
  return response.data
}

export const logout = async () => {
  try {
    // Send empty object to prevent 415 errors
    await apiClient.post("/auth/logout", {})
  } catch (error) {
    console.error("Logout error:", error)
  }
}

export const googleAuth = async (data: {
  firebase_token: string
  email: string
  name: string
  firebase_uid: string
}) => {
  console.log("Calling googleAuth with data:", {
    ...data,
    firebase_token: data.firebase_token ? "TOKEN_HIDDEN_FOR_SECURITY" : null
  })
  const response = await apiClient.post("/auth/google", data)
  return response.data
}

export const completeGoogleRegistration = async (userData: {
  firebase_uid: string
  firebase_token: string
  email: string
  name: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}) => {
  console.log("Completing Google registration:", {
    ...userData,
    firebase_token: "TOKEN_HIDDEN_FOR_SECURITY"
  })
  const response = await apiClient.post("/auth/google/complete-registration", userData)
  return response.data
}

export const verifyGoogleToken = async (token: string) => {
  const response = await apiClient.post("/auth/google/verify", { token })
  return response.data
}

export const linkGoogleAccount = async (token: string) => {
  const response = await apiClient.post("/auth/google/link", { token })
  return response.data
}

export const register = async (userData: {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}) => {
  try {
    const response = await apiClient.post("/auth/register", userData)
    return response.data
  } catch (error) {
    // If registration fails, throw the error to be handled by the component
    throw error
  }
}

export const sendVerificationOtp = async (email: string) => {
  console.log("Sending OTP to:", email, "API URL:", API_URL)
  try {
    const response = await apiClient.post("/auth/send-otp", { email })
    return response.data
  } catch (error) {
    console.error("Error sending OTP:", error)
    throw error
  }
}

export const verifyOtp = async (email: string, otp: string) => {
  console.log("Verifying OTP:", otp, "for email:", email)
  try {
    const response = await apiClient.post("/auth/verify-otp", { email, otp })
    return response.data
  } catch (error) {
    console.error("Error verifying OTP:", error)
    throw error
  }
}

export const verifyAccount = async (token: string) => {
  const response = await apiClient.get(`/auth/verify?token=${token}`)
  return response.data
}

export const resendVerification = async (email: string) => {
  const response = await apiClient.post("/auth/resend-verification", { email })
  return response.data
}

export const resetPasswordRequest = async (email: string) => {
  console.log("Sending password reset request for:", email)
  const response = await apiClient.post("/auth/reset-password-request", { email })
  console.log("Reset password request response:", response.data)
  return response.data
}

export const resetPassword = async (token: string, password: string) => {
  console.log("Resetting password with token:", token)
  const response = await apiClient.post("/auth/reset-password-complete", { token, password })
  console.log("Reset password response:", response.data)
  return response.data
}

// User API calls
export const getUserProfile = async () => {
  const response = await apiClient.get("/user/me")
  return response.data
}

export const updateUserProfile = async (userData: {
  name: string
  phone?: string
  address?: string
}) => {
  const response = await apiClient.put("/user/me", userData)
  return response.data
}

// Services API calls
export const getServices = async () => {
  const response = await apiClient.get("/services")
  return response.data
}

export const getServiceDetails = async (id: number) => {
  const response = await apiClient.get(`/services/${id}`)
  return response.data
}

export const getServiceCategories = async () => {
  const response = await apiClient.get("/services/categories")
  return response.data
}

// Appointment API calls
export const getAppointments = async () => {
  const response = await apiClient.get("/appointments")
  return response.data
}

export const createAppointment = async (appointmentData: {
  service_id: number
  date: string
  time: string
  notes?: string
}) => {
  const response = await apiClient.post("/appointments", appointmentData)
  return response.data
}

export const getAppointmentDetails = async (id: number) => {
  const response = await apiClient.get(`/appointments/${id}`)
  return response.data
}

export const updateAppointment = async (id: number, data: { notes?: string }) => {
  const response = await apiClient.put(`/appointments/${id}`, data)
  return response.data
}

export const cancelAppointment = async (id: number) => {
  const response = await apiClient.delete(`/appointments/${id}`)
  return response.data
}

export const getAvailableSlots = async (date: string, serviceId?: number) => {
  let url = `/appointments/available?date=${date}`
  if (serviceId) {
    url += `&service_id=${serviceId}`
  }
  const response = await apiClient.get(url)
  return response.data
}

// Microsoft Teams API calls
export const createTeamsMeeting = async (meetingData: {
  subject: string
  start_time: string
  end_time: string
  attendees: string[]
  content?: string
}) => {
  const response = await apiClient.post("/calendar/teams/meetings", meetingData)
  return response.data
}

export const getTeamsMeetings = async () => {
  const response = await apiClient.get("/calendar/events/teams")
  return response.data
}

export const serviceService = {
  getServices: async () => {
    const response = await apiClient.get("/services");
    return response.data;
  },
  getServiceDetails: async (id: number) => {
    const response = await apiClient.get(`/services/${id}`);
    return response.data;
  },
  getServiceCategories: async () => {
    const response = await apiClient.get("/services/categories");
    return response.data;
  },
};

// Appointment API endpoints
export const appointmentService = {
  getAppointments: async () => {
    const response = await apiClient.get("/appointments");
    return response.data;
  },
  createAppointment: async (appointmentData: {
    service_id: number;
    date: string;
    time: string;
    notes?: string;
  }) => {
    const response = await apiClient.post("/appointments", appointmentData);
    return response.data;
  },
  getAppointmentDetails: async (id: number) => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },
  updateAppointment: async (id: number, data: { notes?: string }) => {
    const response = await apiClient.put(`/appointments/${id}`, data);
    return response.data;
  },
  cancelAppointment: async (id: number) => {
    const response = await apiClient.delete(`/appointments/${id}`);
    return response.data;
  },
  getAvailableSlots: async (date: string, serviceId?: number) => {
    let url = `/appointments/available?date=${date}`;
    if (serviceId) {
      url += `&service_id=${serviceId}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },
};

// Payment API calls
export const getPayments = async () => {
  const response = await apiClient.get("/payments")
  return response.data
}

export const createPayment = async (paymentData: {
  amount: number
  payment_method: string
  description?: string
  invoice_id?: number
}) => {
  const response = await apiClient.post("/payments", paymentData)
  return response.data
}

export const getPaymentDetails = async (id: number) => {
  const response = await apiClient.get(`/payments/${id}`)
  return response.data
}

// Invoice API calls
export const getInvoices = async () => {
  const response = await apiClient.get("/invoices")
  return response.data
}

export const getInvoiceDetails = async (id: number) => {
  const response = await apiClient.get(`/invoices/${id}`)
  return response.data
}

export const payInvoice = async (id: number, paymentMethod: string) => {
  const response = await apiClient.post(`/invoices/${id}/pay`, { payment_method: paymentMethod })
  return response.data
}

// Notification API calls
export const getNotifications = async () => {
  const response = await apiClient.get("/notifications")
  return response.data
}

export const markNotificationRead = async (id: number) => {
  const response = await apiClient.put(`/notifications/${id}/read`)
  return response.data
}

export const updateNotificationPreferences = async (preferences: {
  email_notifications: boolean
  sms_notifications: boolean
  appointment_reminders: boolean
  payment_notifications: boolean
}) => {
  const response = await apiClient.post("/notifications/settings", preferences)
  return response.data
}

// Knowledge base API calls
export const getKnowledgeBase = async () => {
  const response = await apiClient.get("/content/knowledge-base")
  return response.data
}

export const getKnowledgeArticle = async (id: number) => {
  const response = await apiClient.get(`/content/knowledge-base/${id}`)
  return response.data
}

export default apiClient
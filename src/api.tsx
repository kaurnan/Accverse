import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Ensure content-type is set for all requests
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => Promise.reject(error),
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      const { status, data } = error.response;

      // Handle 401 Unauthorized
      if (status === 401) {
        // Clear local storage if token is invalid
        if (!window.location.pathname.includes("/login")) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      }

      // Create error with server message
      const errorMessage = data.error || "An error occurred";
      return Promise.reject(new Error(errorMessage));
    }

    // Network error or other issues
    return Promise.reject(new Error("Network error. Please check your connection."));
  },
);

// Auth API endpoints
export const authService = {
  login: async (email: string, password: string) => {
    const response = await apiClient.post("/auth/login", { email, password });
    return response.data;
  },
  logout: async () => {
    try {
      // Making sure we're sending an empty object to avoid 415 errors
      await apiClient.post("/auth/logout", {});
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }) => {
    const response = await apiClient.post("/auth/register", userData);
    return response.data;
  },
  verifyAccount: async (token: string) => {
    const response = await apiClient.get(`/auth/verify?token=${token}`);
    return response.data;
  },
  resendVerification: async (email: string) => {
    const response = await apiClient.post("/auth/resend-verification", { email });
    return response.data;
  },
  resetPasswordRequest: async (email: string) => {
    const response = await apiClient.post("/auth/reset-password-request", { email });
    return response.data;
  },
  resetPassword: async (token: string, password: string) => {
    const response = await apiClient.post("/auth/reset-password-complete", { token, password });
    return response.data;
  },
  sendOtp: async (email: string) => {
    const response = await apiClient.post("/auth/send-otp", { email });
    return response.data;
  },
  verifyOtp: async (email: string, otp: string) => {
    const response = await apiClient.post("/auth/verify-otp", { email, otp });
    return response.data;
  },
};

// User API endpoints
export const userService = {
  getUserProfile: async () => {
    const response = await apiClient.get("/user/me");
    return response.data;
  },
  updateUserProfile: async (userData: {
    name: string;
    phone?: string;
    address?: string;
  }) => {
    const response = await apiClient.put("/user/me", userData);
    return response.data;
  },
};

// Services API endpoints
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

// Payment API endpoints
export const paymentService = {
  getPayments: async () => {
    const response = await apiClient.get("/payments");
    return response.data;
  },
  createPayment: async (paymentData: {
    amount: number;
    payment_method: string;
    description?: string;
    invoice_id?: number;
  }) => {
    const response = await apiClient.post("/payments", paymentData);
    return response.data;
  },
  getPaymentDetails: async (id: number) => {
    const response = await apiClient.get(`/payments/${id}`);
    return response.data;
  },
};

// Invoice API endpoints
export const invoiceService = {
  getInvoices: async () => {
    const response = await apiClient.get("/invoices");
    return response.data;
  },
  getInvoiceDetails: async (id: number) => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },
  payInvoice: async (id: number, paymentMethod: string) => {
    const response = await apiClient.post(`/invoices/${id}/pay`, { payment_method: paymentMethod });
    return response.data;
  },
};

// Notification API endpoints
export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get("/notifications");
    return response.data;
  },
  markNotificationRead: async (id: number) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
  updateNotificationPreferences: async (preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    appointment_reminders: boolean;
    payment_notifications: boolean;
  }) => {
    const response = await apiClient.post("/notifications/settings", preferences);
    return response.data;
  },
};

// Calendar API endpoints
export const calendarService = {
  getCalendarEvents: async () => {
    const response = await apiClient.get("/calendar/events");
    return response.data;
  },
  createCalendarEvent: async (eventData: {
    title: string;
    description?: string;
    date: string;
    start_time: string;
    end_time: string;
    location?: string;
  }) => {
    const response = await apiClient.post("/calendar/events", eventData);
    return response.data;
  },
  updateCalendarEvent: async (id: number, data: {
    title?: string;
    description?: string;
    date?: string;
    start_time?: string;
    end_time?: string;
    location?: string;
  }) => {
    const response = await apiClient.put(`/calendar/events/${id}`, data);
    return response.data;
  },
  deleteCalendarEvent: async (id: number) => {
    const response = await apiClient.delete(`/calendar/events/${id}`);
    return response.data;
  },
  syncExternalCalendar: async () => {
    const response = await apiClient.get("/calendar/sync");
    return response.data;
  },
};

// Knowledge base API endpoints
export const knowledgeBaseService = {
  getKnowledgeBase: async () => {
    const response = await apiClient.get("/content/knowledge-base");
    return response.data;
  },
  getKnowledgeArticle: async (id: number) => {
    const response = await apiClient.get(`/content/knowledge-base/${id}`);
    return response.data;
  },
};

// Microsoft Teams integration
export const microsoftTeamsService = {
  initiateTeamsMeeting: async (appointmentId: number) => {
    const response = await apiClient.post(`/integrations/teams/meeting`, { appointment_id: appointmentId });
    return response.data;
  },
  joinTeamsMeeting: async (meetingId: string) => {
    const response = await apiClient.get(`/integrations/teams/join/${meetingId}`);
    return response.data;
  }
};

// Export the apiClient instance
export default apiClient;
// export {
//   authService,
//   userService,
//   serviceService,
//   appointmentService,
//   paymentService,
//   invoiceService,
//   notificationService,
//   calendarService,
//   knowledgeBaseService,
//   microsoftTeamsService,
// };
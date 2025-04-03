
"use client"

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
  ReactNode
} from "react"
import { useNavigate } from "react-router-dom"
import { refreshToken } from "../services/api"
import { jwtDecode } from "jwt-decode"

// Define the User interface
interface User {
  id: number
  name: string
  email: string
  phone?: string
  role?: string
}

// Define the Auth context interface
interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  checkAuth: () => Promise<boolean>
}

// Create the Auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Define the Auth provider props
interface AuthProviderProps {
  children: ReactNode
}

// JWT payload type
interface JwtPayload {
  exp: number
  user_id: number
  [key: string]: unknown
}

// Create the Auth provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)
  const navigate = useNavigate()

  // Function to validate JWT token
  const validateToken = (token: string): boolean => {
    try {
      const decoded = jwtDecode<JwtPayload>(token)
      const currentTime = Date.now() / 1000

      if (decoded.exp < currentTime) {
        console.log("JWT expired, attempting refresh...")
        return false
      }
      return true
    } catch (error) {
      console.log("Invalid JWT token:", error)
      return false
    }
  }

  
  // Function to refresh JWT token
  const refreshJWT = useCallback(async (): Promise<string | null> => {
    try {
      console.log("Attempting to refresh JWT...")
      const newToken = await refreshToken()
      return newToken
    } catch (error) {
      console.log("JWT refresh failed:", error)
      return null
    }
  }, [])

  

  // Logout function
  const logout = useCallback(() => {
    // Clear state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    
    // Clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    
    // Clear refresh interval
    if (refreshInterval) {
      clearInterval(refreshInterval)
      setRefreshInterval(null)
    }
    
    // Redirect to login page
    navigate("/login")
  }, [navigate, refreshInterval])

  // Setup interval for token refresh
  const setupTokenRefresh = useCallback((token: string) => {
    try {
      // Clear any existing refresh intervals
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }

      const decoded = jwtDecode<JwtPayload>(token)
      const expiryTime = decoded.exp * 1000 // Convert to milliseconds
      const currentTime = Date.now()
      
      // Calculate time to refresh (5 minutes before expiry)
      const timeToRefresh = Math.max(0, expiryTime - currentTime - 5 * 60 * 1000)
      
      // Set up interval to refresh token
      const interval = setInterval(async () => {
        const newToken = await refreshJWT()
        if (newToken) {
          setToken(newToken)
          localStorage.setItem("token", newToken)
          
          // Reset the refresh interval with the new token
          setupTokenRefresh(newToken)
        } else {
          // If refresh fails, log out
          logout()
        }
      }, timeToRefresh)
      
      setRefreshInterval(interval)
    } catch (error) {
      console.error("Error setting up token refresh:", error)
    }
  }, [refreshInterval, refreshJWT, logout])

  // Function to initialize authentication state
  const initializeAuth = useCallback(async () => {
    console.log("Initializing authentication...")
    const savedToken = localStorage.getItem("token")
    const savedUser = localStorage.getItem("user")

    if (savedToken) {
      const isValid = validateToken(savedToken)
      
      if (!isValid) {
        try {
          const newToken = await refreshJWT()
          if (newToken) {
            setToken(newToken)
            localStorage.setItem("token", newToken)
            
            // Set up refresh for the new token
            // setupTokenRefresh(newToken)
            
            // Parse saved user if available
            if (savedUser) {
              try {
                const userData = JSON.parse(savedUser)
                setUser(userData)
                setIsAuthenticated(true)
              } catch (e) {
                console.error("Error parsing user data:", e)
              }
            }
          } else {
            console.log("JWT refresh failed, logging out...")
            logout()
          }
        } catch (error) {
          console.error("Error refreshing token:", error)
          logout()
        }
      } else {
        // Token is valid
        setToken(savedToken); // Updates state
        if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData); // Updates state
        setIsAuthenticated(true);
        // setToken(savedToken)
        // setupTokenRefresh(savedToken)
        
        // Parse saved user
        // if (savedUser) {
        //   try {
        //     const userData = JSON.parse(savedUser)
        //     setUser(userData)
        //     setIsAuthenticated(true)
        //   } catch (e) {
        //     console.error("Error parsing user data:", e)
        //   }
        // }
        }
      }
    } else {
      console.log("No user found in local storage.")
      setIsAuthenticated(false)
      setUser(null)
      setToken(null)
    }
    
    setLoading(false)
  }, [refreshJWT, setupTokenRefresh, logout])

  // Run initialization once on component mount
  useEffect(() => {
    initializeAuth().catch((error) => console.error("Error during initialization:", error))
    
    // Cleanup function to clear interval on unmount
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
    }
  }, [initializeAuth, refreshInterval])

  // Login function
  const login = useCallback((userData: User, authToken: string) => {
    console.log("Logging in:", userData.email)
    
    // Save to state
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    
    // Save to localStorage
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
    
    // Setup token refresh
    setupTokenRefresh(authToken)
  }, [setupTokenRefresh])

  // Function to check if the user is authenticated
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (isAuthenticated) {
      return true
    }
    
    const savedToken = localStorage.getItem("token")
    if (savedToken) {
      const isValid = validateToken(savedToken)
      
      if (!isValid) {
        try {
          const newToken = await refreshJWT()
          if (newToken) {
            // Token refresh successful, update auth state
            setToken(newToken)
            localStorage.setItem("token", newToken)
            
            const savedUser = localStorage.getItem("user")
            if (savedUser) {
              const userData = JSON.parse(savedUser)
              setUser(userData)
              setIsAuthenticated(true)
              return true
            }
          }
        } catch (error) {
          console.error("Error during auth check:", error)
        }
      } else {
        // Token is valid
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsAuthenticated(true)
          return true
        }
      }
    }
    
    return false
  }, [isAuthenticated, refreshJWT])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        loading,
        login,
        logout,
        checkAuth
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export default AuthContext

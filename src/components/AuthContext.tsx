"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import * as api from "../services/api"
// import msalInstance from "../services/auth-microsoft"
// import { toast } from "react-toastify"

interface User {
  id: number
  name: string
  email: string
  role?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user")

      if (token && storedUser) {
        try {
          // Verify token is valid by fetching user profile
          const userData = await api.getUserProfile()
          setUser(userData.user)
        } catch (error) {
          // If token is invalid, clear localStorage
          console.error("Auth token invalid:", error)
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      }

      
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    // Call logout API first
    api.logout()
      .then(() => {
        // Clear local storage after successful logout
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      })
      .catch((error) => {
        console.error("Logout error:", error)
        // Still clear local storage even if API call fails
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      })
  }

  const refreshUserProfile = async () => {
    try {
      const userData = await api.getUserProfile()
      setUser(userData.user)
      // Update stored user data
      localStorage.setItem("user", JSON.stringify(userData.user))
    } catch (error) {
      console.error("Failed to refresh user profile:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}



"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader, Calendar, AlertCircle } from "lucide-react"
// import msalInstance, { loginWithMicrosoft, logoutFromMicrosoft } from "../services/auth-microsoft"
// import { teamsService } from "../services/microsoft-teams"
import { toast } from "react-toastify"

interface MicrosoftTeamsButtonProps {
  onTeamsEnabled: (enabled: boolean) => void
  className?: string
}

const MicrosoftTeamsButton: React.FC<MicrosoftTeamsButtonProps> = ({ onTeamsEnabled, className = "" }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    // Automatically set as connected for demo purposes
    setIsConnected(true)
    onTeamsEnabled(true)
    
    // Comment out the original Microsoft authentication code - will be used later
    /*
    // Check if user is already logged in with Microsoft
    const checkLoginStatus = async () => {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        try {
          // Get token silently
          const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: ["User.Read", "Calendars.ReadWrite", "OnlineMeetings.ReadWrite"],
            account: accounts[0]
          })
          
          setIsConnected(true)
          onTeamsEnabled(true)
          setErrorMessage(null)
          
          // Set the access token for Teams service
          teamsService.setAccessToken(tokenResponse.accessToken)
        } catch (error) {
          console.error("Failed to get token silently:", error)
          setErrorMessage("Please login again. Your session may have expired.")
        }
      }
    }

    checkLoginStatus()
    */
  }, [onTeamsEnabled])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      setErrorMessage(null)
      
      // Demo implementation - just set as connected after a short delay
      setTimeout(() => {
        setIsConnected(true)
        onTeamsEnabled(true)
        toast.success("Successfully connected to Microsoft account (Demo)")
      }, 1000)
      
      // Comment out the original Microsoft authentication code - will be used later
      /*
      const response = await loginWithMicrosoft()
      
      if (response && response.token) {
        // Set the access token for Teams service
        teamsService.setAccessToken(response.token)
        setIsConnected(true)
        onTeamsEnabled(true)
        toast.success("Successfully connected to Microsoft account")
      }
      */
    } catch (error: unknown) {
      console.error("Failed to connect to Microsoft Teams:", error)
      const errorMsg = error instanceof Error ? error.message : "Failed to connect to Microsoft account"
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      // Demo implementation - just set as disconnected
      setIsConnected(false)
      onTeamsEnabled(false)
      setErrorMessage(null)
      toast.info("Disconnected from Microsoft account (Demo)")
      
      // Comment out the original Microsoft authentication code - will be used later
      /*
      await logoutFromMicrosoft()
      setIsConnected(false)
      onTeamsEnabled(false)
      setErrorMessage(null)
      toast.info("Disconnected from Microsoft account")
      */
    } catch (error) {
      console.error("Disconnect error:", error)
      toast.error("Failed to disconnect from Microsoft account")
    }
  }

  return (
    <div className={`flex flex-col items-start ${className}`}>
      {isConnected ? (
        <button
          type="button"
          onClick={handleDisconnect}
          className="inline-flex items-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Calendar className="h-5 w-5 mr-2 text-green-500" />
          Microsoft Calendar Connected (Demo)
        </button>
      ) : (
        <button
          type="button"
          onClick={handleConnect}
          disabled={isConnecting}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isConnecting ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Calendar className="h-5 w-5 mr-2" />
              Connect Microsoft Calendar (Demo)
            </>
          )}
        </button>
      )}
      
      {errorMessage && (
        <div className="mt-2 text-sm text-red-600 flex items-start">
          <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      
      <div className="mt-2 text-xs text-gray-500">
        <p>Demo mode: Microsoft integration is simulated</p>
        <p>Actual Microsoft account connection is disabled</p>
      </div>
    </div>
  )
}

export default MicrosoftTeamsButton
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Loader, Calendar } from "lucide-react"
import msalInstance, { loginWithMicrosoft, logoutFromMicrosoft } from "../services/auth-microsoft"
import { teamsService } from "../services/microsoft-teams"
import { toast } from "react-toastify"

interface MicrosoftTeamsButtonProps {
  onTeamsEnabled: (enabled: boolean) => void
  className?: string
}

const MicrosoftTeamsButton: React.FC<MicrosoftTeamsButtonProps> = ({ onTeamsEnabled, className = "" }) => {
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Check if user is already logged in with Microsoft
    const checkLoginStatus = async () => {
      const accounts = msalInstance.getAllAccounts()
      if (accounts.length > 0) {
        try {
          // Get token silently
          await msalInstance.acquireTokenSilent({
            scopes: ["User.Read", "Calendars.ReadWrite"],
            account: accounts[0]
          })
          setIsConnected(true)
          onTeamsEnabled(true)
          
          // Set the access token for Teams service
          const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: ["https://graph.microsoft.com/Calendars.ReadWrite"],
            account: accounts[0]
          })
          teamsService.setAccessToken(tokenResponse.accessToken)
        } catch (error) {
          console.error("Failed to get token silently:", error)
        }
      }
    }

    checkLoginStatus()
  }, [onTeamsEnabled])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const response = await loginWithMicrosoft()
      
      if (response && response.token) {
        // Set the access token for Teams service
        teamsService.setAccessToken(response.token)
        setIsConnected(true)
        onTeamsEnabled(true)
        toast.success("Successfully connected to Microsoft account")
      }
    } catch (error) {
      console.error("Failed to connect to Microsoft Teams:", error)
      toast.error("Failed to connect to Microsoft account")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await logoutFromMicrosoft()
      setIsConnected(false)
      onTeamsEnabled(false)
      toast.info("Disconnected from Microsoft account")
    } catch (error) {
      console.error("Disconnect error:", error)
      toast.error("Failed to disconnect from Microsoft account")
    }
  }

  return (
    <div className={`flex items-center ${className}`}>
      {isConnected ? (
        <button
          type="button"
          onClick={handleDisconnect}
          className="inline-flex items-center px-4 py-2 border border-green-500 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <Calendar className="h-5 w-5 mr-2 text-green-500" />
          Microsoft Calendar Connected
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
              Connect Microsoft Calendar
            </>
          )}
        </button>
      )}
    </div>
  )
}

export default MicrosoftTeamsButton

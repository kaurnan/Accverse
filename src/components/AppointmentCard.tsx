"use client"

import type React from "react"
import { Calendar, Clock, Video, ExternalLink } from "lucide-react"
import { format, parseISO } from "date-fns"

interface AppointmentCardProps {
  appointment: {
    id: number
    service_name: string
    appointment_date: string
    appointment_time: string
    status: string
    notes: string
    teams_url?: string
  }
  onCancel?: (id: number) => void
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel }) => {
  // Extract Teams meeting URL from notes if not provided directly
  const getTeamsUrl = () => {
    if (appointment.teams_url) return appointment.teams_url

    const notes = appointment.notes || ""
    if (notes.includes("Microsoft Teams Meeting:")) {
      const urlMatch = notes.match(/Microsoft Teams Meeting: (https:\/\/\S+)/)
      return urlMatch ? urlMatch[1] : null
    }
    return null
  }

  const teamsUrl = getTeamsUrl()
  const formattedDate = format(parseISO(appointment.appointment_date), "MMMM d, yyyy")

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-medium text-gray-900">{appointment.service_name}</h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded-full ${
            appointment.status === "confirmed"
              ? "bg-green-100 text-green-800"
              : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
          }`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2" />
          {formattedDate}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          {appointment.appointment_time}
        </div>

        {teamsUrl && (
          <div className="mt-4">
            <a
              href={teamsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Video className="h-4 w-4 mr-2" />
              Join Teams Meeting
              <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        )}
      </div>

      {appointment.status !== "cancelled" && appointment.status !== "completed" && onCancel && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button onClick={() => onCancel(appointment.id)} className="text-sm text-red-600 hover:text-red-800">
            Cancel Appointment
          </button>
        </div>
      )}
    </div>
  )
}

export default AppointmentCard


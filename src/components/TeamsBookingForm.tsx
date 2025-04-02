"use client"

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Calendar, Clock, Users, Video, User, Mail, Phone, Clipboard } from 'lucide-react'
import { toast } from 'react-toastify'
import { serviceService, appointmentService } from '../api'
import { teamsService } from '../services/microsoft-teams'
import MicrosoftTeamsButton from './MicrosoftTeamsButton'
import { useAuth } from './AuthContext'
import { useNavigate } from 'react-router-dom'
import { format, addMinutes, parseISO } from 'date-fns'

interface BookingFormData {
  name: string
  email: string
  phone: string
  service_id: string
  date: string
  time: string
  notes: string
  attendees: string
}

interface Service {
  id: number
  name: string
  description: string
  price: number
  duration: number
  category_id: number
  category_name?: string
}

const TeamsBookingForm = () => {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState<Service[]>([])
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [isTeamsEnabled, setIsTeamsEnabled] = useState(false)
  const [meetingInfo, setMeetingInfo] = useState<{
    joinUrl: string
    joinWebUrl: string
  } | null>(null)

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<BookingFormData>({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      attendees: user?.email || '',
    }
  })
  
  const selectedDate = watch('date')
  const selectedService = watch('service_id')
//   const selectedTime = watch('time')

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await serviceService.getServices()
        setServices(response.services || [])
      } catch (error) {
        console.error('Error fetching services:', error)
        toast.error('Unable to load services. Please try again later.')
      }
    }

    fetchServices()
    
    // Update form with user data if authenticated
    if (user) {
      setValue('name', user.name || '')
      setValue('email', user.email || '')
      
      // Add user's email to attendees by default
      if (user.email) {
        setValue('attendees', user.email)
      }
    }
  }, [user, setValue])

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDate) {
        setLoading(true)
        try {
          const serviceId = selectedService ? parseInt(selectedService) : undefined
          const response = await appointmentService.getAvailableSlots(selectedDate, serviceId)
          setAvailableSlots(response.available_slots || [])
        } catch (error) {
          console.error('Error fetching available slots:', error)
          toast.error('Unable to load available time slots.')
          setAvailableSlots([])
        } finally {
          setLoading(false)
        }
      }
    }

    if (selectedDate) {
      fetchAvailableSlots()
    }
  }, [selectedDate, selectedService])

  const onSubmit = async (data: BookingFormData) => {
    if (!isTeamsEnabled) {
      toast.error("Please connect to Microsoft Calendar first")
      return
    }
    
    if (!isAuthenticated) {
      localStorage.setItem('pendingBooking', JSON.stringify(data))
      toast.info('Please log in or register to complete your booking')
      navigate('/login?redirect=booking')
      return
    }
    
    setLoading(true)
    
    try {
      // Get selected service for duration info
      const selectedServiceObj = services.find(service => service.id === parseInt(data.service_id))
      if (!selectedServiceObj) {
        throw new Error("Selected service not found")
      }
      
      // Parse attendees list
      const attendeesList = data.attendees
        .split(',')
        .map(email => email.trim())
        .filter(email => email.length > 0)
      
      // Ensure user's email is included
      if (user?.email && !attendeesList.includes(user.email)) {
        attendeesList.push(user.email)
      }
      
      // Format date and time for Teams meeting
      const meetingDate = data.date
      const meetingTime = data.time
      const startDateTime = `${meetingDate}T${meetingTime}:00Z`
      
      // Calculate end time based on service duration
      const endDateTime = format(
        addMinutes(parseISO(`${meetingDate}T${meetingTime}:00Z`), selectedServiceObj.duration || 30),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      )
      
      // Create Teams meeting
      const meeting = await teamsService.createMeeting({
        subject: `${selectedServiceObj.name} Consultation`,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
        attendees: attendeesList,
        content: data.notes || `Consultation for ${selectedServiceObj.name}`,
        location: "Microsoft Teams Meeting"
      })
      
      // Save meeting info
      setMeetingInfo({
        joinUrl: meeting.joinUrl,
        joinWebUrl: meeting.joinWebUrl
      })
      
      // Create appointment in our system
      const appointmentData = {
        service_id: parseInt(data.service_id),
        date: data.date,
        time: data.time,
        notes: `Microsoft Teams Meeting: ${meeting.joinUrl}\n\nAttendees: ${data.attendees}\n\n${data.notes || ""}`
      }

      await appointmentService.createAppointment(appointmentData)
      
      toast.success('Appointment booked successfully with Teams meeting!')
    } catch (error: any) {
      console.error('Error booking appointment:', error)
      toast.error(error.message || 'Failed to book your appointment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Handle copy meeting link
  const copyMeetingLink = () => {
    if (meetingInfo?.joinUrl) {
      navigator.clipboard.writeText(meetingInfo.joinUrl)
      toast.success("Meeting link copied to clipboard!")
    }
  }

  return (
    <div className="space-y-6">
      {/* Microsoft Teams connection button */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Microsoft Calendar Connection</h3>
        <p className="text-gray-600 mb-4">
          Connect to your Microsoft account to create Teams meetings and add events to your calendar.
        </p>
        <MicrosoftTeamsButton onTeamsEnabled={setIsTeamsEnabled} />
      </div>
      
      {isTeamsEnabled ? (
        <>
          {meetingInfo ? (
            <div className="bg-green-50 border border-green-200 rounded-md p-6 mb-6">
              <h3 className="text-lg font-medium text-green-800 mb-2">Meeting Created Successfully</h3>
              <p className="text-green-700 mb-4">
                Your Microsoft Teams meeting has been created and added to your calendar.
              </p>
              <div className="flex items-center justify-between bg-white p-3 rounded-md border border-green-300">
                <span className="text-gray-600 text-sm truncate mr-2">{meetingInfo.joinUrl}</span>
                <button 
                  onClick={copyMeetingLink} 
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <Clipboard className="h-4 w-4 mr-1" />
                  Copy
                </button>
              </div>
              <div className="mt-4">
                <a 
                  href={meetingInfo.joinWebUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Video className="h-5 w-5 mr-2" />
                  Join Meeting
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
                  Service Type
                </label>
                <select
                  id="service_id"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                    errors.service_id ? 'border-red-500' : ''
                  }`}
                  {...register('service_id', { required: 'Please select a service' })}
                >
                  <option value="">Select a service</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name} - ${service.price}
                    </option>
                  ))}
                </select>
                {errors.service_id && (
                  <p className="mt-1 text-sm text-red-600">{errors.service_id.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                    placeholder="John Doe"
                    {...register('name', { required: 'Name is required' })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                    placeholder="john@example.com"
                    {...register('email', { 
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address'
                      }
                    })}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                    placeholder="+61 123 456 789"
                    {...register('phone', { required: 'Phone number is required' })}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Meeting Date
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.date ? 'border-red-500' : ''
                    }`}
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date', { required: 'Date is required' })}
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                  Meeting Time
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Clock className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="time"
                    className={`pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      errors.time ? 'border-red-500' : ''
                    }`}
                    disabled={!selectedDate || availableSlots.length === 0}
                    {...register('time', { required: 'Time is required' })}
                  >
                    <option value="">Select a time</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.time && (
                  <p className="mt-1 text-sm text-red-600">{errors.time.message}</p>
                )}
                {selectedDate && availableSlots.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">No available slots for this date. Please select another date.</p>
                )}
              </div>

              <div>
                <label htmlFor="attendees" className="block text-sm font-medium text-gray-700">
                  Additional Attendees (comma separated emails)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="attendees"
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="email1@example.com, email2@example.com"
                    {...register('attendees')}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Your email will be automatically added to the meeting.
                </p>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Meeting Agenda (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Topics to discuss in the meeting..."
                  {...register('notes')}
                ></textarea>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Creating Meeting...' : 'Schedule Teams Meeting'}
                </button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Please connect to Microsoft Calendar to schedule Teams meetings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamsBookingForm

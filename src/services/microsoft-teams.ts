import axios from "axios"

// Microsoft Graph API endpoints
const GRAPH_API_ENDPOINT = "https://graph.microsoft.com/v1.0"

// Microsoft Teams integration service
class MicrosoftTeamsService {
  private accessToken: string | null = null

  // Set the access token after authentication
  setAccessToken(token: string) {
    this.accessToken = token
  }

  // Check if the service is authenticated
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  // Create a new Teams meeting and add to Outlook calendar
  async createMeeting(meetingDetails: {
    subject: string
    startDateTime: string
    endDateTime: string
    attendees: string[]
    content?: string
    location?: string
  }) {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Microsoft Graph API")
      }

      // Create a Teams meeting
      const meetingResponse = await axios.post(
        `${GRAPH_API_ENDPOINT}/me/onlineMeetings`,
        {
          startDateTime: meetingDetails.startDateTime,
          endDateTime: meetingDetails.endDateTime,
          subject: meetingDetails.subject,
          participants: {
            attendees: meetingDetails.attendees.map((email) => ({
              upn: email,
            })),
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      // Create a calendar event with the Teams meeting link
      const calendarResponse = await axios.post(
        `${GRAPH_API_ENDPOINT}/me/calendar/events`,
        {
          subject: meetingDetails.subject,
          start: {
            dateTime: meetingDetails.startDateTime,
            timeZone: "UTC"
          },
          end: {
            dateTime: meetingDetails.endDateTime,
            timeZone: "UTC"
          },
          location: {
            displayName: meetingDetails.location || "Online Meeting"
          },
          body: {
            contentType: "HTML",
            content: `<p>${meetingDetails.content || ""}</p><p>Join Teams Meeting: <a href="${meetingResponse.data.joinUrl}">${meetingResponse.data.joinUrl}</a></p>`,
          },
          attendees: meetingDetails.attendees.map((email) => ({
            emailAddress: {
              address: email,
            },
            type: "required",
          })),
          isOnlineMeeting: true,
          onlineMeetingProvider: "teamsForBusiness",
          onlineMeeting: {
            joinUrl: meetingResponse.data.joinUrl,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      )

      return {
        meetingId: meetingResponse.data.id,
        joinUrl: meetingResponse.data.joinUrl,
        joinWebUrl: meetingResponse.data.joinWebUrl,
        calendarEventId: calendarResponse.data.id,
      }
    } catch (error) {
      console.error("Error creating Teams meeting:", error)
      throw error
    }
  }

  // Get meeting details
  async getMeeting(meetingId: string) {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Microsoft Graph API")
      }

      const response = await axios.get(`${GRAPH_API_ENDPOINT}/me/onlineMeetings/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      return response.data
    } catch (error) {
      console.error("Error getting Teams meeting:", error)
      throw error
    }
  }

  // Get user's calendar events
  async getCalendarEvents(startDateTime?: string, endDateTime?: string) {
    try {
      if (!this.accessToken) {
        throw new Error("Not authenticated with Microsoft Graph API")
      }

      let url = `${GRAPH_API_ENDPOINT}/me/calendar/events`
      
      // Add filter for date range if provided
      if (startDateTime && endDateTime) {
        url += `?$filter=start/dateTime ge '${startDateTime}' and end/dateTime le '${endDateTime}'`
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
      })

      return response.data.value
    } catch (error) {
      console.error("Error getting calendar events:", error)
      throw error
    }
  }
}

export const teamsService = new MicrosoftTeamsService()

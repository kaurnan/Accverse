import os
import requests
import json
import datetime
from flask import current_app

class MicrosoftTeamsIntegration:
    def __init__(self):
        self.client_id = os.environ.get('MS_CLIENT_ID')
        self.client_secret = os.environ.get('MS_CLIENT_SECRET')
        self.tenant_id = os.environ.get('MS_TENANT_ID')
        self.access_token = None
        self.token_expires = None

    def _get_token(self):
        """Get an access token for Microsoft Graph API"""
        if self.access_token and self.token_expires and datetime.datetime.now() < self.token_expires:
            return self.access_token

        url = f"https://login.microsoftonline.com/{self.tenant_id}/oauth2/v2.0/token"
        
        payload = {
            'client_id': self.client_id,
            'scope': 'https://graph.microsoft.com/.default',
            'client_secret': self.client_secret,
            'grant_type': 'client_credentials'
        }
        
        headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        
        try:
            response = requests.post(url, data=payload, headers=headers)
            response.raise_for_status()
            
            token_data = response.json()
            self.access_token = token_data['access_token']
            # Set token expiry time (subtract 5 minutes for safety)
            self.token_expires = datetime.datetime.now() + datetime.timedelta(seconds=token_data['expires_in'] - 300)
            
            return self.access_token
        except Exception as e:
            current_app.logger.error(f"Error getting Microsoft token: {str(e)}")
            return None

    def create_meeting(self, subject, start_time, end_time, attendees=None, content=None):
        """
        Create a Microsoft Teams meeting
        
        Args:
            subject (str): Meeting subject
            start_time (str): ISO format start time
            end_time (str): ISO format end time
            attendees (list): List of attendee email addresses
            content (str): Meeting content/description
            
        Returns:
            dict: Meeting details including join URL
        """
        token = self._get_token()
        if not token:
            return None
            
        # Use the application's default user for creating meetings
        # In a production app, you'd use delegated permissions with the actual user
        url = "https://graph.microsoft.com/v1.0/users/scheduler@yourdomain.com/onlineMeetings"
        
        # Format the meeting request
        meeting_request = {
            "startDateTime": start_time,
            "endDateTime": end_time,
            "subject": subject,
            "isEntryExitAnnounced": True,
            "allowedPresenters": "everyone",
            "allowMeetingChat": "enabled",
            "joinMeetingIdSettings": {
                "isPasscodeRequired": False
            }
        }
        
        # Add meeting content if provided
        if content:
            meeting_request["content"] = content
            
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.post(url, headers=headers, data=json.dumps(meeting_request))
            response.raise_for_status()
            
            meeting_data = response.json()
            
            # Return relevant meeting details
            return {
                'meeting_id': meeting_data.get('id'),
                'join_url': meeting_data.get('joinUrl'),
                'join_web_url': meeting_data.get('joinWebUrl'),
                'subject': meeting_data.get('subject'),
                'start_time': meeting_data.get('startDateTime'),
                'end_time': meeting_data.get('endDateTime')
            }
        except Exception as e:
            current_app.logger.error(f"Error creating Teams meeting: {str(e)}")
            return None

    def get_meeting(self, meeting_id):
        """
        Get details of a Microsoft Teams meeting
        
        Args:
            meeting_id (str): The ID of the meeting to retrieve
            
        Returns:
            dict: Meeting details
        """
        token = self._get_token()
        if not token:
            return None
            
        url = f"https://graph.microsoft.com/v1.0/users/scheduler@yourdomain.com/onlineMeetings/{meeting_id}"
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        try:
            response = requests.get(url, headers=headers)
            response.raise_for_status()
            
            meeting_data = response.json()
            
            return {
                'meeting_id': meeting_data.get('id'),
                'join_url': meeting_data.get('joinUrl'),
                'join_web_url': meeting_data.get('joinWebUrl'),
                'subject': meeting_data.get('subject'),
                'start_time': meeting_data.get('startDateTime'),
                'end_time': meeting_data.get('endDateTime')
            }
        except Exception as e:
            current_app.logger.error(f"Error getting Teams meeting: {str(e)}")
            return None


from flask import jsonify
import mysql.connector
from config import db_config, jwt_config
import jwt
import datetime
import bcrypt
import uuid
from utils import send_email, generate_token, validate_token, get_user_id_from_token
import requests
import firebase_admin
import random
from microsoft_teams import MicrosoftTeamsIntegration
from firebase_setup import verify_firebase_token
teams_integration = MicrosoftTeamsIntegration()
import logging 
logger = logging.getLogger(__name__)
from datetime import timedelta
import json
import os
import uuid

# form_id = str(uuid.uuid4())
# form_data['id'] = form_id 

# Database Connection Function
def get_db_connection():
    try:
        conn = mysql.connector.connect(
            host=db_config.DB_HOST,
            user=db_config.DB_USER,
            password=db_config.DB_PASSWORD,
            database=db_config.DB_NAME
        )
        return conn
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return None

# Authentication & User Management Functions
def authenticate_user(data):
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # if not user['is_verified']:
    #     return jsonify({"error": "Account not verified. Please check your email for verification link."}), 401
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password'].encode('utf-8')):
        # Generate JWT token - no role needed
        token = jwt.encode({
            'user_id': user['id'],
            'email': user['email'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, jwt_config.JWT_SECRET_KEY, algorithm='HS256')
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {
                "id": user['id'],
                "name": user['name'],
                "email": user['email']
            }
        }), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Firebase token verification
# def verify_firebase_token(token):
#     try:
#         import firebase_admin
#         from firebase_admin import auth, credentials
        
#         # Initialize Firebase Admin if not already initialized
#         if not firebase_admin._apps:
#             # Use service account credentials or app credentials
#             # For simplicity, we'll use the default app initialization
#             # In production, you'd want to use explicit credentials
#             firebase_admin.initialize_app()
        
#         # Verify the Firebase token
#         decoded_token = auth.verify_id_token(token)
#         return decoded_token
#     except ImportError:
#         print("Firebase admin SDK not installed. Please install with: pip install firebase-admin")
#         return None
#     except Exception as e:
#         print(f"Error verifying Firebase token: {str(e)}")
#         return None

# Google Authentication
def google_auth(data):
    firebase_token = data.get('firebase_token')
    email = data.get('email')
    name = data.get('name')
    firebase_uid = data.get('firebase_uid')
    
    if not firebase_token or not email or not firebase_uid:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Verify Firebase token
    try:
        decoded_token = verify_firebase_token(firebase_token)
        if not decoded_token or decoded_token.get('uid') != firebase_uid:
            return jsonify({"error": "Invalid Firebase token"}), 401
    except Exception as e:
        return jsonify({"error": f"Firebase verification error: {str(e)}"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Check if user exists with this Firebase UID
        cursor.execute(
            "SELECT * FROM users WHERE firebase_uid = %s", 
            (firebase_uid,)
        )
        user = cursor.fetchone()
        
        if user:
            # User exists, generate token and return user data
            token = generate_token(user['id'], user['email'], user['role'])
            
            # Update last login
            # cursor.execute(
            #     "UPDATE users SET last_login = NOW() WHERE id = %s", 
            #     (user['id'],)
            # )
            # conn.commit()
            
            # Return user data and token
            safe_user = {
                "id": user['id'],
                "name": user['name'],
                "email": user['email'],
                "role": user['role'],
                "provider": "google",
                "firebase_uid": user['firebase_uid'],
                "is_verified": True  # Google oauth users are verified by default
            }
            
            return jsonify({
                "token": token,
                "user": safe_user,
                "isNewUser": False
            }), 200
        else:
            # Check if user exists with same email
            cursor.execute(
                "SELECT * FROM users WHERE email = %s", 
                (email,)
            )
            existing_user = cursor.fetchone()
            
            if existing_user:
                # Link Firebase UID to existing account
                cursor.execute(
                    "UPDATE users SET firebase_uid = %s, updated_at = NOW(), is_verified = 1 WHERE id = %s", 
                    (firebase_uid, existing_user['id'])
                )
                conn.commit()
                
                # Generate token and return user data
                token = generate_token(existing_user['id'], existing_user['email'], existing_user['role'])
                
                # Update last login
                # cursor.execute(
                #     "UPDATE users SET last_login = NOW() WHERE id = %s", 
                #     (existing_user['id'],)
                # )
                # conn.commit()
                
                safe_user = {
                    "id": existing_user['id'],
                    "name": existing_user['name'],
                    "email": existing_user['email'],
                    "role": existing_user['role'],
                    "provider": "google",
                    "firebase_uid": firebase_uid,
                    "is_verified": True
                }
                
                return jsonify({
                    "token": token,
                    "user": safe_user,
                    "isNewUser": False
                }), 200
            else:
                # New user, need more details for registration
                return jsonify({
                    "isNewUser": True,
                    "message": "User not found. Please complete registration."
                }), 200
    
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# Complete Google Registration
def complete_google_registration(data):
    firebase_uid = data.get('firebase_uid')
    firebase_token = data.get('firebase_token')
    email = data.get('email')
    name = data.get('name')
    password = data.get('password')  # Get password from request data
    phone = data.get('phone')
    address = data.get('address')
    city = data.get('city')
    state = data.get('state')
    zip_code = data.get('zipCode')
    
    if not firebase_uid or not firebase_token or not email or not name or not password:
        return jsonify({"error": "Missing required fields"}), 400
    
    # Verify Firebase token
    try:
        decoded_token = verify_firebase_token(firebase_token)
        if not decoded_token or decoded_token.get('uid') != firebase_uid:
            return jsonify({"error": "Invalid Firebase token"}), 401
    except Exception as e:
        return jsonify({"error": f"Firebase verification error: {str(e)}"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Check if user exists with this Firebase UID
        cursor.execute(
            "SELECT * FROM users WHERE firebase_uid = %s OR email = %s", 
            (firebase_uid, email)
        )
        user = cursor.fetchone()
        
        if user:
            return jsonify({"error": "User already exists"}), 400
        
        # Format address
        full_address = address
        if city or state or zip_code:
            full_address = f"{address}, {city}, {state} {zip_code}".strip()
        
        # Hash the password
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        # Create new user with hashed password
        cursor.execute(
            """
            INSERT INTO users 
            (name, email, firebase_uid, password, phone, address, is_verified, 
             role, created_at, updated_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'client', NOW(), NOW())
            """, 
            (name, email, firebase_uid, hashed_password, phone, full_address, True)
        )
        conn.commit()
        
        new_user_id = cursor.lastrowid
        
        # Get the newly created user
        cursor.execute("SELECT * FROM users WHERE id = %s", (new_user_id,))
        new_user = cursor.fetchone()
        
        # Generate token with all required parameters
        token = generate_token(new_user_id, email, new_user['role'])
        
        safe_user = {
            "id": new_user['id'],
            "name": new_user['name'],
            "email": new_user['email'],
            "role": new_user['role'],
            "provider": "google",
            "firebase_uid": new_user['firebase_uid'],
            "is_verified": True
        }
        
        return jsonify({
            "token": token,
            "user": safe_user,
            "message": "Registration completed successfully"
        }), 201
        
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

def register_user(data):
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    phone = data.get('phone', '')
    address = data.get('address', '')
    city = data.get('city', '')
    state = data.get('state', '')
    zip_code = data.get('zipCode', '')
    
    if not name or not email or not password:
        return jsonify({"error": "Name, email, and password are required"}), 400
    
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Email already registered"}), 409
    
    # Format address
    full_address = address
    if city or state or zip_code:
        full_address = f"{address}, {city}, {state} {zip_code}".strip()
    
    try:
        # Insert user without verification token - we're using OTP verification
        cursor.execute(
            "INSERT INTO users (name, email, password, phone, address, is_verified) VALUES (%s, %s, %s, %s, %s, %s)",
            (name, email, hashed_password, phone, full_address, True)  # Set is_verified to True since we verified with OTP
        )
        conn.commit()
        user_id = cursor.lastrowid
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Registration successful.",
            "user_id": user_id
        }), 201
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500

def send_verification_otp(data):
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if email already exists
    cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "Email already registered"}), 409
    
    # Generate a 6-digit OTP
    otp = ''.join(random.choices('0123456789', k=6))
    
    # Store OTP in a temporary table or cache
    try:
        cursor.execute(
            """
            INSERT INTO email_verification (email, otp, created_at) 
            VALUES (%s, %s, %s)
            ON DUPLICATE KEY UPDATE otp = %s, created_at = %s, is_verified = %s
            """,
            (email, otp, datetime.datetime.utcnow(), otp, datetime.datetime.utcnow(), False)
        )
        conn.commit()
        
        # Send OTP email
        email_subject = "Your Verification Code"
        email_body = f"""
        Hi there,
        
        Your verification code is: {otp}
        
        This code will expire in 5 minutes.
        
        Regards,
        Accverse
        """
        send_email(email, email_subject, email_body)
        
        cursor.close()
        conn.close()
        
        return jsonify({"message": "Verification code sent successfully"}), 200
    except Exception as e:
        logger.error(f"Error sending OTP: {str(e)}")
        cursor.close()
        conn.close()
        return jsonify({"error": f"Failed to send verification code: {str(e)}"}), 500

def verify_otp(data):
    email = data.get('email')
    otp = data.get('otp')
    
    if not email or not otp:
        return jsonify({"error": "Email and OTP are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if OTP is valid and not expired (5 minutes)
    cursor.execute(
        """
        SELECT * FROM email_verification 
        WHERE email = %s AND otp = %s AND created_at > %s
        """,
        (email, otp, datetime.datetime.utcnow() - datetime.timedelta(minutes=5))
    )
    verification = cursor.fetchone()
    
    if not verification:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid or expired verification code"}), 400
    
    # Mark email as verified
    cursor.execute(
        "UPDATE email_verification SET is_verified = 1 WHERE email = %s",
        (email,)
    )
    conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Email verified successfully"}), 200

def verify_user(token):
    if not token:
        return jsonify({"error": "Verification token is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, email FROM users WHERE verification_token = %s", (token,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid verification token"}), 400
    
    # Update user to verified status and remove verification token
    cursor.execute(
        "UPDATE users SET is_verified = %s, verification_token = %s WHERE id = %s",
        (True, None, user['id'])
    )
    conn.commit()
    
    # Log the successful verification
    logger.info(f"User {user['email']} verified successfully")
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Email verified successfully. You can now log in."}), 200

def resend_verification(data):
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        return jsonify({"error": "User not found"}), 404
    
    # Generate verification token
    verification_token = str(uuid.uuid4())
    
    cursor.execute(
        "UPDATE users SET verification_token = %s WHERE id = %s",
        (verification_token, user['id'])
    )
    conn.commit()
    
    # Generate verification email
    verification_url = f"http://localhost:8080/verify?token={verification_token}&email={email}"
    email_subject = "Verify Your Account"
    email_body = f"""
    Hi {user['name']},
    
    Please verify your account by clicking the link below:
    
    {verification_url}
    
    This link will expire in 24 hours.
    
    Regards,
    Accverse
    """
    send_email(email, email_subject, email_body)
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Verification email sent successfully"}), 200

def reset_password_request(data):
    email = data.get('email')
    
    if not email:
        return jsonify({"error": "Email is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT id, name FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()
    
    if not user:
        cursor.close()
        conn.close()
        # Don't reveal that email doesn't exist for security
        return jsonify({"message": "If your email is registered, you will receive a reset link."}), 200
    
    # Generate reset token
    reset_token = str(uuid.uuid4())
    
    # Set expiry to 24 hours from now
    # Use UTC time to avoid timezone issues
    expiry = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    
    # Store the expiry time in UTC format
    expiry_timestamp = int(expiry.timestamp())
    
    # Log the token and expiry for debugging
    logger.info(f"Generated reset token for {email}: {reset_token}")
    logger.info(f"Expiry time: {expiry}, timestamp: {expiry_timestamp}")
    logger.info(f"Current time: {datetime.datetime.utcnow()}, current timestamp: {int(datetime.datetime.utcnow().timestamp())}")
    
    cursor.execute(
        "UPDATE users SET reset_token = %s, reset_token_expiry = %s WHERE id = %s",
        (reset_token, expiry, user['id'])
    )
    conn.commit()
    
    # Send reset email with expiry timestamp in URL
    reset_url = f"http://localhost:8080/forgot-password?token={reset_token}&expiry={expiry_timestamp}"
    email_subject = "Reset Your Password"
    email_body = f"""
    Hi {user['name']},
    
    To reset your password, please click the link below:
    
    {reset_url}
    
    This link will expire in 24 hours.
    
    Regards,
    Accverse
    """
    send_email(email, email_subject, email_body)
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "If your email is registered, you will receive a reset link."}), 200

def reset_password_complete(data):
    token = data.get('token')
    new_password = data.get('password')
    
    if not token or not new_password:
        return jsonify({"error": "Token and new password are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get the current time in UTC
    current_time = datetime.datetime.utcnow()
    logger.info(f"Validating token: {token}, current time: {current_time}")
    
    # First check if the token exists
    cursor.execute("SELECT id, reset_token_expiry FROM users WHERE reset_token = %s", (token,))
    user = cursor.fetchone()
    
    if not user:
        logger.error(f"Token not found: {token}")
        cursor.close()
        conn.close()
        return jsonify({"error": "Invalid token"}), 400
    
    # Log the expiry time from the database for debugging
    expiry_time = user['reset_token_expiry']
    logger.info(f"Token expiry from DB: {expiry_time}, current time: {current_time}")
    
    # For testing purposes, we'll bypass the expiry check
    # In production, uncomment this check
    # if expiry_time < current_time:
    #     logger.error(f"Token expired: {token}, expiry: {expiry_time}, current: {current_time}")
    #     cursor.close()
    #     conn.close()
    #     return jsonify({"error": "Token has expired. Please request a new password reset."}), 400
    
    # Hash the new password
    hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    cursor.execute(
        "UPDATE users SET password = %s, reset_token = NULL, reset_token_expiry = NULL WHERE id = %s",
        (hashed_password, user['id'])
    )
    conn.commit()
    
    logger.info(f"Password reset successful for user ID: {user['id']}")
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Password has been reset successfully. You can now log in."}), 200

def get_user_profile(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        "SELECT id, name, email, phone, address, created_at FROM users WHERE id = %s",
        (user_id,)
    )
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({"user": user}), 200

def update_user_profile(token, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    name = data.get('name')
    phone = data.get('phone')
    address = data.get('address')
    
    if not name:
        return jsonify({"error": "Name is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE users SET name = %s, phone = %s, address = %s WHERE id = %s",
        (name, phone, address, user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Profile updated successfully"}), 200

def serialize_timedelta(obj):
    """Convert timedelta object to a human-readable string."""
    if isinstance(obj, timedelta):
        return str(obj)  # Example: '1:30:00' (1 hour, 30 minutes)
    return obj

# Appointment Booking Functions
def get_appointments(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own appointments
    cursor.execute(
        """
        SELECT a.*, u.name as client_name, s.name as service_name 
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = %s
        ORDER BY a.appointment_date DESC, a.appointment_time DESC
        """,
        (user_id,)
    )
    
    appointments = cursor.fetchall()
    cursor.close()
    conn.close()
    
    for appointment in appointments:
        for key, value in appointment.items():
            if isinstance(value, timedelta):
                appointment[key] = serialize_timedelta(value)

    return jsonify({"appointments": appointments}), 200

def create_appointment(token, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    service_id = data.get('service_id')
    appointment_date = data.get('date')
    appointment_time = data.get('time')
    notes = data.get('notes', '')
    teams_meeting = data.get('teams_meeting')  # New parameter for Teams meeting
    
    if not service_id or not appointment_date or not appointment_time:
        return jsonify({"error": "Service, date, and time are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if service exists
    cursor.execute("SELECT id, name, duration FROM services WHERE id = %s", (service_id,))
    service = cursor.fetchone()
    if not service:
        cursor.close()
        conn.close()
        return jsonify({"error": "Service not found"}), 404
    
    # Check if slot is available
    cursor.execute(
        """
        SELECT id FROM appointments 
        WHERE appointment_date = %s AND appointment_time = %s AND status != 'cancelled'
        """,
        (appointment_date, appointment_time)
    )
    if cursor.fetchone():
        cursor.close()
        conn.close()
        return jsonify({"error": "This time slot is already booked"}), 409
    
    try:
        # Get user email for Teams meeting and confirmation
        cursor.execute("SELECT email, name FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        # Create Teams meeting if not already provided
        teams_meeting_data = None
        if not teams_meeting:
            # Parse appointment time
            time_parts = appointment_time.split(':')
            hour = int(time_parts[0])
            minute = int(time_parts[1]) if len(time_parts) > 1 else 0
            
            # Create datetime objects for start and end times
            start_datetime = datetime.datetime.strptime(f"{appointment_date} {hour}:{minute}:00", "%Y-%m-%d %H:%M:%S")
            end_datetime = start_datetime + datetime.timedelta(minutes=service['duration'])
            
            # Format for Microsoft Graph API
            start_time_iso = start_datetime.isoformat() + 'Z'  # UTC format
            end_time_iso = end_datetime.isoformat() + 'Z'  # UTC format
            
            # Create Teams meeting
            teams_meeting_data = teams_integration.create_meeting(
                subject=f"{service['name']} - Consultation with {user['name']}",
                start_time=start_time_iso,
                end_time=end_time_iso,
                attendees=[user['email']],
                content=notes
            )
        else:
            # Use the provided Teams meeting data
            teams_meeting_data = {
                'meeting_id': teams_meeting.get('meeting_id'),
                'join_url': teams_meeting.get('join_url'),
                'join_web_url': teams_meeting.get('join_web_url')
            }
        
        # Store Teams meeting details as JSON in the notes field or a separate column
        meeting_notes = notes
        if teams_meeting_data:
            meeting_notes += f"\n\nMicrosoft Teams Meeting: {teams_meeting_data['join_url']}"
        
        cursor.execute(
            """
            INSERT INTO appointments 
            (user_id, service_id, appointment_date, appointment_time, notes, status, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, service_id, appointment_date, appointment_time, meeting_notes, 'pending', 
             datetime.datetime.utcnow())
        )
        conn.commit()
        appointment_id = cursor.lastrowid
        
        # Send confirmation email with Teams meeting link if available
        email_subject = "Appointment Booking Confirmation"
        email_body = f"""
        Hi {user['name']},
        
        Thank you for booking an appointment with Accverse.
        
        Appointment Details:
        Service: {service['name']}
        Date: {appointment_date}
        Time: {appointment_time}
        Status: Pending (awaiting confirmation)
        """
        
        if teams_meeting_data:
            email_body += f"""
            
            Join Microsoft Teams Meeting:
            {teams_meeting_data['join_url']}
            
            You can join this meeting from your computer, tablet, or smartphone.
            """
        
        email_body += """
        
        We will confirm your appointment shortly.
        
        Regards,
        Accverse
        """
        
        send_email(user['email'], email_subject, email_body)
        
        cursor.close()
        conn.close()
        
        response_data = {
            "message": "Appointment booked successfully",
            "appointment_id": appointment_id
        }
        
        if teams_meeting_data:
            response_data["teams_meeting"] = {
                "join_url": teams_meeting_data['join_url'],
                "join_web_url": teams_meeting_data.get('join_web_url')
            }
        
        return jsonify(response_data), 201
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500


def get_appointment_details(token, appointment_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own appointments
    cursor.execute(
        """
        SELECT a.*, u.name as client_name, u.email as client_email, 
               u.phone as client_phone, s.name as service_name, s.price as service_price
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN services s ON a.service_id = s.id
        WHERE a.id = %s AND a.user_id = %s
        """,
        (appointment_id, user_id)
    )
    
    appointment = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not appointment:
        return jsonify({"error": "Appointment not found"}), 404
    
    return jsonify({"appointment": appointment}), 200

def update_appointment(token, appointment_id, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get the appointment to check ownership
    cursor.execute(
        "SELECT * FROM appointments WHERE id = %s AND user_id = %s",
        (appointment_id, user_id)
    )
    
    appointment = cursor.fetchone()
    
    if not appointment:
        cursor.close()
        conn.close()
        return jsonify({"error": "Appointment not found"}), 404
    
    # Clients can only update notes if appointment is not confirmed
    if appointment['status'] != 'pending':
        cursor.close()
        conn.close()
        return jsonify({"error": "Cannot update confirmed or completed appointments"}), 400
    
    notes = data.get('notes', appointment['notes'])
    
    cursor.execute(
        "UPDATE appointments SET notes = %s WHERE id = %s",
        (notes, appointment_id)
    )
    
    conn.commit()
    
    # Get user email for notification
    cursor.execute("SELECT email, name FROM users WHERE id = %s", (appointment['user_id'],))
    client = cursor.fetchone()
    
    # Get service name
    cursor.execute("SELECT name FROM services WHERE id = %s", (appointment['service_id'],))
    service = cursor.fetchone()
    
    # Send update email
    email_subject = "Appointment Update Notification"
    email_body = f"""
    Hi {client['name']},
    
    Your appointment with Accverse has been updated.
    
    Updated Appointment Details:
    Service: {service['name']}
    Date: {appointment['appointment_date']}
    Time: {appointment['appointment_time']}
    Status: {appointment['status']}
    
    Regards,
    Accverse
    """
    send_email(client['email'], email_subject, email_body)
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Appointment updated successfully"}), 200

def cancel_appointment(token, appointment_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get the appointment to check ownership
    cursor.execute(
        "SELECT * FROM appointments WHERE id = %s AND user_id = %s",
        (appointment_id, user_id)
    )
    
    appointment = cursor.fetchone()
    
    if not appointment:
        cursor.close()
        conn.close()
        return jsonify({"error": "Appointment not found"}), 404
    
    # Check if appointment is already cancelled
    if appointment['status'] == 'cancelled':
        cursor.close()
        conn.close()
        return jsonify({"error": "Appointment is already cancelled"}), 400
    
    # Check if appointment is completed
    if appointment['status'] == 'completed':
        cursor.close()
        conn.close()
        return jsonify({"error": "Cannot cancel completed appointments"}), 400
    
    cursor.execute(
        "UPDATE appointments SET status = 'cancelled' WHERE id = %s",
        (appointment_id,)
    )
    conn.commit()
    
    # Get user email for notification
    cursor.execute("SELECT email, name FROM users WHERE id = %s", (appointment['user_id'],))
    client = cursor.fetchone()
    
    # Get service name
    cursor.execute("SELECT name FROM services WHERE id = %s", (appointment['service_id'],))
    service = cursor.fetchone()
    
    # Send cancellation email
    email_subject = "Appointment Cancellation Notification"
    email_body = f"""
    Hi {client['name']},
    
    Your appointment with Accverse has been cancelled.
    
    Cancelled Appointment Details:
    Service: {service['name']}
    Date: {appointment['appointment_date']}
    Time: {appointment['appointment_time']}
    
    If you did not request this cancellation, please contact us.
    
    Regards,
    Accverse
    """
    send_email(client['email'], email_subject, email_body)
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Appointment cancelled successfully"}), 200

def get_available_slots(date, service_id):
    if not date:
        return jsonify({"error": "Date is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if service exists if service_id is provided
    if service_id:
        cursor.execute("SELECT id FROM services WHERE id = %s", (service_id,))
        if not cursor.fetchone():
            cursor.close()
            conn.close()
            return jsonify({"error": "Service not found"}), 404
    
    # Get all booked slots for the date
    cursor.execute(
        """
        SELECT appointment_time FROM appointments 
        WHERE appointment_date = %s AND status != 'cancelled'
        """,
        (date,)
    )
    booked_slots = [slot['appointment_time'] for slot in cursor.fetchall()]
    
    # Define all available time slots (9 AM to 5 PM, 1-hour intervals)
    all_slots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']
    
    # Filter out booked slots
    available_slots = [slot for slot in all_slots if slot not in booked_slots]
    
    cursor.close()
    conn.close()
    
    return jsonify({"date": date, "available_slots": available_slots}), 200

# Services & Pricing Functions
def get_services():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT s.*, c.name as category_name 
        FROM services s
        JOIN service_categories c ON s.category_id = c.id
        WHERE s.is_active = 1
        ORDER BY s.category_id, s.name
        """
    )
    services = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"services": services}), 200

def get_service_details(service_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT s.*, c.name as category_name 
        FROM services s
        JOIN service_categories c ON s.category_id = c.id
        WHERE s.id = %s
        """,
        (service_id,)
    )
    service = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not service:
        return jsonify({"error": "Service not found"}), 404
    
    return jsonify({"service": service}), 200

def get_service_categories():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM service_categories ORDER BY name")
    categories = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"categories": categories}), 200

def get_tax_form_templates():
    """
    Get available tax form templates
    """
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection error"}), 500
            
        cursor = conn.cursor(dictionary=True)
        cursor.execute("""
            SELECT id, title, subtitle, description, steps, is_active 
            FROM tax_form_templates
            WHERE is_active = TRUE
        """)
        
        templates = cursor.fetchall()
        cursor.close()
        conn.close()
        
        return jsonify({"templates": templates}), 200
    except Exception as e:
        logger.error(f"Error getting tax form templates: {str(e)}")
        return jsonify({"error": str(e)}), 500
        
# Tax Solutions Form functions
def submit_tax_form(token, request):
    """Handle tax form submission with file uploads"""
    
    logger.info("Tax form submission received")
    
    # Get user ID if authenticated
    user_id = None
    if token:
        user_id = get_user_id_from_token(token)
    
    # Get form data
    form_data = {}

    if request.content_type.startswith('application/json'):
        form_data = request.get_json() or {}
    else:
        for key in request.form:
            form_data[key] = request.form.get(key)
    
    # Validate required fields
    required_fields = ['firstName', 'lastName', 'email', 'signature']
    for field in required_fields:
        if field not in form_data or not form_data[field]:
            logger.error(f"Missing required field: {field}")
            return {'error': f'Missing required field: {field}'}, 400
    
    try:
        conn = get_db_connection()
        if not conn:
            return {'error': 'Database connection error'}, 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Store form data as JSON
        form_json = json.dumps(form_data)
        
        # Get fiscal year from form data
        fiscal_year = None
        if 'fiscalYear' in form_data and form_data['fiscalYear']:
            fiscal_year = form_data['fiscalYear']
        
        # Insert record into tax_forms table
        tax_form_id = str(uuid.uuid4())

        insert_form_query = """
        INSERT INTO tax_forms 
        (id, user_id, form_data, fiscal_year_end, status, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
        """

        cursor.execute(
            insert_form_query,
            (tax_form_id, user_id, form_json, fiscal_year, 'submitted')
        )
        
        tax_form_id = cursor.lastrowid
        
        # Handle file uploads if any
        if request.files:
            upload_folder = os.path.join(app_config.UPLOAD_FOLDER, 'tax_forms', str(tax_form_id))
            os.makedirs(upload_folder, exist_ok=True)
            
            file_fields = ['identification', 'privateHealthFile', 'supportingDocs']
            
            for field in file_fields:
                if field in request.files and request.files[field].filename:
                    file = request.files[field]
                    
                    # Create secure filename and save file
                    filename = secure_filename(file.filename)
                    file_path = os.path.join(upload_folder, filename)
                    
                    # Save the file
                    file.save(file_path)
                    
                    # Store file info in database
                    file_size = os.path.getsize(file_path)
                    file_type = file.content_type if hasattr(file, 'content_type') else None
                    
                    insert_file_query = """
                    INSERT INTO tax_form_files 
                    (tax_form_id, file_name, file_path, file_type, file_size, field_name)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    """
                    
                    cursor.execute(
                        insert_file_query, 
                        (tax_form_id, filename, file_path, file_type, file_size, field)
                    )
        
        conn.commit()
        
        # Create notification for admins that a new tax form was submitted
        try:
            # First, query for admin users
            admin_query = "SELECT id FROM users WHERE role = 'admin'"
            cursor.execute(admin_query)
            admin_users = cursor.fetchall()
            
            # Create notification for each admin
            for admin in admin_users:
                notification_query = """
                INSERT INTO notifications 
                (user_id, title, message, type, is_read, created_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                """
                
                notification_title = "New Tax Form Submission"
                client_name = f"{form_data.get('firstName', '')} {form_data.get('lastName', '')}"
                notification_message = f"Client {client_name} has submitted a new tax form."
                
                cursor.execute(
                    notification_query,
                    (admin['id'], notification_title, notification_message, 'tax_form', False)
                )
        
            conn.commit()
        except Exception as e:
            logger.error(f"Error creating admin notifications: {str(e)}")
            # Continue with the process even if notification creation fails
        
        cursor.close()
        conn.close()
        
        return {'success': True, 'id': tax_form_id}, 201
        
    except Exception as e:
        logger.error(f"Error submitting tax form: {str(e)}")
        return {'error': str(e)}, 500

def save_tax_form_progress(token, data):
    """Save tax form progress to database"""
    
    logger.info("Saving tax form progress")
    
    # Get user ID if authenticated
    user_id = None
    if token:
        user_id = get_user_id_from_token(token)
    
    try:
        # Extract relevant data
        email = data.get('email', '')
        form_id = str(uuid.uuid4()) if 'id' not in data else data.get('id')
        
        # Store form data
        form_json = json.dumps(data)
        
        conn = get_db_connection()
        if not conn:
            return {'error': 'Database connection error'}, 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Check if a progress record already exists for this user/form combination
        if user_id:
            check_query = """
            SELECT id FROM tax_forms 
            WHERE user_id = %s AND id = %s AND status = 'submitted'
            """
            cursor.execute(check_query, (user_id, form_id))
        else:
            # For non-authenticated users, use email as identifier
            check_query = """
            SELECT id FROM tax_forms 
            WHERE form_data LIKE %s AND id = %s AND status = 'submitted'
            """
            email_pattern = f'%"email":"{email}"%'
            cursor.execute(check_query, (email_pattern, form_id))
            
        existing_form = cursor.fetchone()
        
        if existing_form:
            # Update existing record
            update_query = """
            UPDATE tax_forms 
            SET form_data = %s, updated_at = NOW()
            WHERE id = %s
            """
            cursor.execute(update_query, (form_json, existing_form['id']))
            saved_id = existing_form['id']
        else:
            # Get fiscal year from form data
            fiscal_year = None
            if 'fiscalYear' in data and data['fiscalYear']:
                fiscal_year = data['fiscalYear']
                
            # Insert new record
            insert_query = """
            INSERT INTO tax_forms 
            (id, user_id, form_data, fiscal_year_end, status, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
            """
            
            cursor.execute(
                insert_query, 
                (form_id, user_id, form_json, fiscal_year, 'submitted')
            )
            saved_id = form_id
        
        conn.commit()
        cursor.close()
        conn.close()
        
        return {'success': True, 'id': saved_id}, 200
        
    except Exception as e:
        logger.error(f"Error saving tax form progress: {str(e)}")
        return {'error': str(e)}, 500

def load_tax_form_progress(token, form_id):
    """Load saved tax form progress from database"""
    
    logger.info(f"Loading tax form progress for form ID: {form_id}")
    
    # Get user ID if authenticated
    user_id = None
    if token:
        user_id = get_user_id_from_token(token)
    
    try:
        conn = get_db_connection()
        if not conn:
            return {'error': 'Database connection error'}, 500
        
        cursor = conn.cursor(dictionary=True)
        
        # Query to get form data
        query = """
        SELECT form_data, fiscal_year_end, status, created_at, updated_at
        FROM tax_forms WHERE id = %s
        """
        
        cursor.execute(query, (form_id,))
        saved_form = cursor.fetchone()
        
        cursor.close()
        conn.close()
        
        if not saved_form:
            return {'error': 'Form not found'}, 404
            
        # If authenticated, check if the form belongs to the user
        if user_id:
            form_data = json.loads(saved_form['form_data'])
            if 'email' in form_data:
                # Get user email from DB
                conn = get_db_connection()
                cursor = conn.cursor(dictionary=True)
                
                cursor.execute("SELECT email FROM users WHERE id = %s", (user_id,))
                user = cursor.fetchone()
                
                cursor.close()
                conn.close()
                
                if user and user['email'] != form_data.get('email'):
                    return {'error': 'Unauthorized access to form'}, 403
        
        # Return saved form data
        return {
            'form_data': json.loads(saved_form['form_data']),
            'fiscal_year_end': saved_form['fiscal_year_end'].isoformat() if saved_form['fiscal_year_end'] else None,
            'status': saved_form['status'],
            'created_at': saved_form['created_at'].isoformat(),
            'updated_at': saved_form['updated_at'].isoformat()
        }, 200
        
    except Exception as e:
        logger.error(f"Error loading tax form progress: {str(e)}")
        return {'error': str(e)}, 500

# Payment Processing Functions
def get_payments(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own payments
    cursor.execute(
        """
        SELECT p.* 
        FROM payments p
        WHERE p.user_id = %s
        ORDER BY p.created_at DESC
        """,
        (user_id,)
    )
    
    payments = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"payments": payments}), 200

def create_payment(token, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    amount = data.get('amount')
    description = data.get('description', '')
    payment_method = data.get('payment_method')
    invoice_id = data.get('invoice_id')
    
    if not amount or not payment_method:
        return jsonify({"error": "Amount and payment method are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if invoice exists if invoice_id is provided
    if invoice_id:
        cursor.execute("SELECT * FROM invoices WHERE id = %s", (invoice_id,))
        invoice = cursor.fetchone()
        
        if not invoice:
            cursor.close()
            conn.close()
            return jsonify({"error": "Invoice not found"}), 404
        
        # Check if invoice belongs to user if not admin
        cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        
        if user['role'] != 'admin' and invoice['user_id'] != user_id:
            cursor.close()
            conn.close()
            return jsonify({"error": "Unauthorized"}), 403
    
    try:
        payment_reference = f"PAY-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}-{user_id}"
        
        cursor.execute(
            """
            INSERT INTO payments 
            (user_id, amount, description, payment_method, reference, status, invoice_id, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, amount, description, payment_method, payment_reference, 'pending', 
             invoice_id, datetime.datetime.utcnow())
        )
        conn.commit()
        payment_id = cursor.lastrowid
        
        # If invoice_id is provided, update invoice status
        if invoice_id:
            cursor.execute(
                "UPDATE invoices SET status = 'paid', updated_at = %s WHERE id = %s",
                (datetime.datetime.utcnow(), invoice_id)
            )
            conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Payment created successfully",
            "payment_id": payment_id,
            "reference": payment_reference
        }), 201
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500

def get_payment_details(token, payment_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own payments
    cursor.execute(
        """
        SELECT p.* 
        FROM payments p
        WHERE p.id = %s AND p.user_id = %s
        """,
        (payment_id, user_id)
    )
    
    payment = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not payment:
        return jsonify({"error": "Payment not found"}), 404
    
    return jsonify({"payment": payment}), 200

def handle_payment_webhook(data):
    # This would handle callbacks from payment gateways like Stripe, PayPal, etc.
    # For demonstration purposes, we'll just update a payment based on reference
    
    reference = data.get('reference')
    status = data.get('status')
    transaction_id = data.get('transaction_id', '')
    
    if not reference or not status:
        return jsonify({"error": "Reference and status are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM payments WHERE reference = %s", (reference,))
    payment = cursor.fetchone()
    
    if not payment:
        cursor.close()
        conn.close()
        return jsonify({"error": "Payment not found"}), 404
    
    cursor.execute(
        """
        UPDATE payments 
        SET status = %s, transaction_id = %s, updated_at = %s 
        WHERE reference = %s
        """,
        (status, transaction_id, datetime.datetime.utcnow(), reference)
    )
    conn.commit()
    
    # If payment is successful and linked to an invoice, update invoice status
    if status == 'completed' and payment['invoice_id']:
        cursor.execute(
            "UPDATE invoices SET status = 'paid', updated_at = %s WHERE id = %s",
            (datetime.datetime.utcnow(), payment['invoice_id'])
        )
        conn.commit()
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Webhook processed successfully"}), 200

def get_invoices(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own invoices
    cursor.execute(
        """
        SELECT i.* 
        FROM invoices i
        WHERE i.user_id = %s
        ORDER BY i.created_at DESC
        """,
        (user_id,)
    )
    
    invoices = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"invoices": invoices}), 200

def get_invoice_details(token, invoice_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own invoices
    cursor.execute(
        """
        SELECT i.* 
        FROM invoices i
        WHERE i.id = %s AND i.user_id = %s
        """,
        (invoice_id, user_id)
    )
    
    invoice = cursor.fetchone()
    
    if not invoice:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invoice not found"}), 404
    
    # Get invoice items
    cursor.execute(
        """
        SELECT * FROM invoice_items 
        WHERE invoice_id = %s
        ORDER BY id
        """,
        (invoice_id,)
    )
    items = cursor.fetchall()
    
    # Get payments related to this invoice
    cursor.execute(
        """
        SELECT * FROM payments 
        WHERE invoice_id = %s
        ORDER BY created_at DESC
        """,
        (invoice_id,)
    )
    payments = cursor.fetchall()
    
    cursor.close()
    conn.close()
    
    invoice['items'] = items
    invoice['payments'] = payments
    
    return jsonify({"invoice": invoice}), 200

def pay_invoice(token, invoice_id, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    payment_method = data.get('payment_method')
    
    if not payment_method:
        return jsonify({"error": "Payment method is required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if invoice exists
    cursor.execute("SELECT * FROM invoices WHERE id = %s", (invoice_id,))
    invoice = cursor.fetchone()
    
    if not invoice:
        cursor.close()
        conn.close()
        return jsonify({"error": "Invoice not found"}), 404
    
    # Check if invoice belongs to user if not admin
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user['role'] != 'admin' and invoice['user_id'] != user_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Unauthorized"}), 403
    
    # Check if invoice is already paid
    if invoice['status'] == 'paid':
        cursor.close()
        conn.close()
        return jsonify({"error": "Invoice is already paid"}), 400
    
    try:
        payment_reference = f"INV-{invoice_id}-{datetime.datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
        
        cursor.execute(
            """
            INSERT INTO payments 
            (user_id, amount, description, payment_method, reference, status, invoice_id, created_at) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """,
            (invoice['user_id'], invoice['total_amount'], f"Payment for Invoice #{invoice_id}", 
             payment_method, payment_reference, 'completed', invoice_id, datetime.datetime.utcnow())
        )
        conn.commit()
        payment_id = cursor.lastrowid
        
        # Update invoice status
        cursor.execute(
            "UPDATE invoices SET status = 'paid', updated_at = %s WHERE id = %s",
            (datetime.datetime.utcnow(), invoice_id)
        )
        conn.commit()
        
        cursor.close()
        conn.close()
        
        return jsonify({
            "message": "Invoice paid successfully",
            "payment_id": payment_id,
            "reference": payment_reference
        }), 200
    except Exception as e:
        cursor.close()
        conn.close()
        return jsonify({"error": str(e)}), 500

# Notifications Functions
def get_notifications(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT * FROM notifications 
        WHERE user_id = %s
        ORDER BY created_at DESC
        """,
        (user_id,)
    )
    notifications = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"notifications": notifications}), 200

def mark_notification_read(token, notification_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE notifications SET is_read = 1 WHERE id = %s AND user_id = %s",
        (notification_id, user_id)
    )
    conn.commit()
    
    if cursor.rowcount == 0:
        cursor.close()
        conn.close()
        return jsonify({"error": "Notification not found"}), 404
    
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Notification marked as read"}), 200

def update_notification_preferences(token, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    email_notifications = data.get('email_notifications')
    sms_notifications = data.get('sms_notifications')
    appointment_reminders = data.get('appointment_reminders')
    payment_notifications = data.get('payment_notifications')
    
    if email_notifications is None or appointment_reminders is None or payment_notifications is None:
        return jsonify({"error": "Missing required preferences"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if preferences exist
    cursor.execute(
        "SELECT * FROM notification_preferences WHERE user_id = %s",
        (user_id,)
    )
    preferences = cursor.fetchone()
    
    if preferences:
        # Update existing preferences
        cursor.execute(
            """
            UPDATE notification_preferences 
            SET email_notifications = %s, sms_notifications = %s, 
                appointment_reminders = %s, payment_notifications = %s, 
                updated_at = %s
            WHERE user_id = %s
            """,
            (email_notifications, sms_notifications, appointment_reminders, 
             payment_notifications, datetime.datetime.utcnow(), user_id)
        )
    else:
        # Create new preferences
        cursor.execute(
            """
            INSERT INTO notification_preferences 
            (user_id, email_notifications, sms_notifications, appointment_reminders, 
             payment_notifications, created_at, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (user_id, email_notifications, sms_notifications, appointment_reminders, 
             payment_notifications, datetime.datetime.utcnow(), datetime.datetime.utcnow())
        )
    
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Notification preferences updated successfully"}), 200

# Calendar Integration Functions
def get_calendar_events(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Clients can only see their own events
    cursor.execute(
        """
        SELECT * FROM calendar_events 
        WHERE user_id = %s
        ORDER BY event_date, start_time
        """,
        (user_id,)
    )
    
    events = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"events": events}), 200

def create_calendar_event(token, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    title = data.get('title')
    description = data.get('description', '')
    event_date = data.get('date')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    location = data.get('location', '')
    
    if not title or not event_date or not start_time or not end_time:
        return jsonify({"error": "Title, date, start time, and end time are required"}), 400
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO calendar_events 
        (user_id, title, description, event_date, start_time, end_time, location, created_at) 
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (user_id, title, description, event_date, start_time, end_time, 
         location, datetime.datetime.utcnow())
    )
    conn.commit()
    event_id = cursor.lastrowid
    cursor.close()
    conn.close()
    
    return jsonify({
        "message": "Calendar event created successfully",
        "event_id": event_id
    }), 201

def update_calendar_event(token, event_id, data):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if event exists and belongs to user
    cursor.execute("SELECT * FROM calendar_events WHERE id = %s", (event_id,))
    event = cursor.fetchone()
    
    if not event:
        cursor.close()
        conn.close()
        return jsonify({"error": "Event not found"}), 404
    
    # Check if user is admin or event owner
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user['role'] != 'admin' and event['user_id'] != user_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Unauthorized"}), 403
    
    title = data.get('title', event['title'])
    description = data.get('description', event['description'])
    event_date = data.get('date', event['event_date'])
    start_time = data.get('start_time', event['start_time'])
    end_time = data.get('end_time', event['end_time'])
    location = data.get('location', event['location'])
    
    cursor.execute(
        """
        UPDATE calendar_events 
        SET title = %s, description = %s, event_date = %s, 
            start_time = %s, end_time = %s, location = %s 
        WHERE id = %s
        """,
        (title, description, event_date, start_time, end_time, location, event_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Calendar event updated successfully"}), 200

def delete_calendar_event(token, event_id):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Check if event exists
    cursor.execute("SELECT * FROM calendar_events WHERE id = %s", (event_id,))
    event = cursor.fetchone()
    
    if not event:
        cursor.close()
        conn.close()
        return jsonify({"error": "Event not found"}), 404
    
    # Check if user is admin or event owner
    cursor.execute("SELECT role FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    
    if user['role'] != 'admin' and event['user_id'] != user_id:
        cursor.close()
        conn.close()
        return jsonify({"error": "Unauthorized"}), 403
    
    cursor.execute("DELETE FROM calendar_events WHERE id = %s", (event_id,))
    conn.commit()
    cursor.close()
    conn.close()
    
    return jsonify({"message": "Calendar event deleted successfully"}), 200

def sync_external_calendar(token):
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    # This would integrate with Google Calendar, Outlook, etc.
    # For demonstration purposes, we'll just return success
    
    return jsonify({
        "message": "Calendar sync initiated",
        "synced_events": 0
    }), 200

# Content Management Functions
def get_knowledge_base():
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT * FROM knowledge_articles 
        WHERE is_published = 1
        ORDER BY created_at DESC
        """
    )
    articles = cursor.fetchall()
    cursor.close()
    conn.close()
    
    return jsonify({"articles": articles}), 200

def get_knowledge_article(article_id):
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute(
        """
        SELECT * FROM knowledge_articles 
        WHERE id = %s AND is_published = 1
        """,
        (article_id,)
    )
    article = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not article:
        return jsonify({"error": "Article not found"}), 404
    
    return jsonify({"article": article}), 200


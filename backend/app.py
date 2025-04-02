from flask import Flask, request, jsonify
from flask_cors import CORS
from methods import (
    get_db_connection,
    authenticate_user, register_user, verify_user, resend_verification, reset_password_request, send_verification_otp, verify_otp,
    reset_password_complete, get_user_profile, update_user_profile,
    get_appointments, create_appointment, get_appointment_details, update_appointment,
    cancel_appointment, get_available_slots,
    get_services, get_service_details, get_service_categories,
    get_payments, create_payment, get_payment_details, handle_payment_webhook,
    get_invoices, get_invoice_details, pay_invoice,
    get_notifications, mark_notification_read, update_notification_preferences,
    get_calendar_events, create_calendar_event, update_calendar_event,
    delete_calendar_event, sync_external_calendar,
    get_knowledge_base, get_knowledge_article, 
)
from microsoft_teams import MicrosoftTeamsIntegration
from config import app_config
import utils
import logging 
import datetime
from utils import validate_token

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
app.config.from_object(app_config)
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# Initialize Microsoft Teams integration
teams_integration = MicrosoftTeamsIntegration()

# Authentication & User Management Endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    return authenticate_user(data)

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    # data = request.get_json()
    logger.info("User logout attempt")
    return jsonify({"message": "Logged out successfully"}), 200

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    return register_user(data)

@app.route('/api/auth/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    return send_verification_otp(data)

@app.route('/api/auth/verify-otp', methods=['POST'])
def verify_otp_route():
    data = request.get_json()
    return verify_otp(data)

@app.route('/api/auth/verify', methods=['GET'])
def verify():
    token = request.args.get('token')
    return verify_user(token)

@app.route('/api/auth/resend-verification', methods=['POST'])
def resend_verification_email():
    data = request.get_json()
    return resend_verification(data)

@app.route('/api/auth/reset-password-request', methods=['POST'])
def reset_request():
    data = request.get_json()
    return reset_password_request(data)

@app.route('/api/auth/reset-password-complete', methods=['POST'])
def reset_complete():
    data = request.get_json()
    return reset_password_complete(data)

@app.route('/api/user/me', methods=['GET'])
def user_profile():
    token = request.headers.get('Authorization')
    return get_user_profile(token)

@app.route('/api/user/me', methods=['PUT'])
def update_profile():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_user_profile(token, data)

# Admin Management Endpoints
# @app.route('/api/admin', methods=['GET'])
# def admin_list():
#     token = request.headers.get('Authorization')
#     return get_admins(token)

# @app.route('/api/admin', methods=['POST'])
# def admin_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_admin(token, data)

# @app.route('/api/admin/<int:id>', methods=['GET'])
# def admin_details(id):
#     token = request.headers.get('Authorization')
#     return get_admin_details(token, id)

# @app.route('/api/admin/<int:id>', methods=['PUT'])
# def admin_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_admin(token, id, data)

# @app.route('/api/admin/<int:id>', methods=['DELETE'])
# def admin_delete(id):
#     token = request.headers.get('Authorization')
#     return delete_admin(token, id)

# Appointment Booking Endpoints
@app.route('/api/appointments', methods=['GET'])
def appointment_list():
    token = request.headers.get('Authorization')
    return get_appointments(token)

@app.route('/api/appointments', methods=['POST'])
def appointment_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_appointment(token, data)

@app.route('/api/appointments/<int:id>', methods=['GET'])
def appointment_details(id):
    token = request.headers.get('Authorization')
    return get_appointment_details(token, id)

@app.route('/api/appointments/<int:id>', methods=['PUT'])
def appointment_update(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_appointment(token, id, data)

@app.route('/api/appointments/<int:id>', methods=['DELETE'])
def appointment_cancel(id):
    token = request.headers.get('Authorization')
    return cancel_appointment(token, id)

@app.route('/api/appointments/available', methods=['GET'])
def available_slots():
    date = request.args.get('date')
    service_id = request.args.get('service_id')
    return get_available_slots(date, service_id)

# @app.route('/api/appointments/<int:id>/confirm', methods=['POST'])
# def confirm_booking(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return confirm_appointment(token, id, data)

# Services & Pricing Endpoints
@app.route('/api/services', methods=['GET'])
def service_list():
    return get_services()

@app.route('/api/services/<int:id>', methods=['GET'])
def service_details(id):
    return get_service_details(id)

# @app.route('/api/services', methods=['POST'])
# def service_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_service(token, data)

# @app.route('/api/services/<int:id>', methods=['PUT'])
# def service_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_service(token, id, data)

# @app.route('/api/services/<int:id>', methods=['DELETE'])
# def service_delete(id):
#     token = request.headers.get('Authorization')
#     return delete_service(token, id)

@app.route('/api/services/categories', methods=['GET'])
def service_categories():
    return get_service_categories()

# Payment Processing Endpoints
@app.route('/api/payments', methods=['GET'])
def payment_list():
    token = request.headers.get('Authorization')
    return get_payments(token)

@app.route('/api/payments', methods=['POST'])
def payment_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_payment(token, data)

@app.route('/api/payments/<int:id>', methods=['GET'])
def payment_details(id):
    token = request.headers.get('Authorization')
    return get_payment_details(token, id)

@app.route('/api/payments/webhook', methods=['POST'])
def payment_webhook():
    data = request.get_json()
    return handle_payment_webhook(data)

@app.route('/api/invoices', methods=['GET'])
def invoice_list():
    token = request.headers.get('Authorization')
    return get_invoices(token)

@app.route('/api/invoices/<int:id>', methods=['GET'])
def invoice_details(id):
    token = request.headers.get('Authorization')
    return get_invoice_details(token, id)

@app.route('/api/invoices/<int:id>/pay', methods=['POST'])
def invoice_pay(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return pay_invoice(token, id, data)

# Notifications Endpoints
@app.route('/api/notifications', methods=['GET'])
def notification_list():
    token = request.headers.get('Authorization')
    return get_notifications(token)

@app.route('/api/notifications/<int:id>/read', methods=['PUT'])
def notification_read(id):
    token = request.headers.get('Authorization')
    return mark_notification_read(token, id)

@app.route('/api/notifications/settings', methods=['POST'])
def notification_settings():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_notification_preferences(token, data)

# Calendar Integration Endpoints
@app.route('/api/calendar/teams/meetings', methods=['POST'])
def create_teams_meeting():
    token = request.headers.get('Authorization')
    data = request.get_json()
    
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    subject = data.get('subject')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    attendees = data.get('attendees', [])
    content = data.get('content')
    
    if not subject or not start_time or not end_time:
        return jsonify({"error": "Subject, start time, and end time are required"}), 400
    
    # Get user email
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT email FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Add user's email to attendees if not already included
    if user['email'] not in attendees:
        attendees.append(user['email'])
    
    # Create Teams meeting
    meeting = teams_integration.create_meeting(
        subject=subject,
        start_time=start_time,
        end_time=end_time,
        attendees=attendees,
        content=content
    )
    
    if not meeting:
        return jsonify({"error": "Failed to create Teams meeting"}), 500
    
    return jsonify({"meeting": meeting}), 201

@app.route('/api/calendar/events/teams', methods=['GET'])
def calendar_events_with_teams():
    token = request.headers.get('Authorization')
    user_id = validate_token(token)
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if not conn:
        return jsonify({"error": "Database connection error"}), 500
    
    cursor = conn.cursor(dictionary=True)
    
    # Get appointments with Teams meeting links
    cursor.execute(
        """
        SELECT a.*, s.name as service_name, s.duration 
        FROM appointments a
        JOIN services s ON a.service_id = s.id
        WHERE a.user_id = %s AND a.notes LIKE '%Microsoft Teams Meeting%'
        ORDER BY a.appointment_date, a.appointment_time
        """,
        (user_id,)
    )
    
    appointments = cursor.fetchall()
    cursor.close()
    conn.close()
    
    # Extract Teams meeting links from notes
    events = []
    for appointment in appointments:
        notes = appointment.get('notes', '')
        teams_url = None
        
        # Extract Teams URL from notes
        if 'Microsoft Teams Meeting:' in notes:
            teams_url = notes.split('Microsoft Teams Meeting:')[1].strip().split('\n')[0].strip()
        
        events.append({
            'id': appointment['id'],
            'title': f"{appointment['service_name']} Appointment",
            'date': appointment['appointment_date'].strftime('%Y-%m-%d'),
            'start_time': appointment['appointment_time'].strftime('%H:%M'),
            'end_time': (datetime.datetime.combine(
                appointment['appointment_date'],
                datetime.datetime.strptime(appointment['appointment_time'].strftime('%H:%M'), '%H:%M').time()
            ) + datetime.timedelta(minutes=appointment['duration'])).strftime('%H:%M'),
            'teams_url': teams_url
        })
    
    return jsonify({"events": events}), 200


@app.route('/api/calendar/events', methods=['GET'])
def calendar_events_list():
    token = request.headers.get('Authorization')
    return get_calendar_events(token)

@app.route('/api/calendar/events', methods=['POST'])
def calendar_event_create():
    token = request.headers.get('Authorization')
    data = request.get_json()
    return create_calendar_event(token, data)

@app.route('/api/calendar/events/<int:id>', methods=['PUT'])
def calendar_event_update(id):
    token = request.headers.get('Authorization')
    data = request.get_json()
    return update_calendar_event(token, id, data)

@app.route('/api/calendar/events/<int:id>', methods=['DELETE'])
def calendar_event_delete(id):
    token = request.headers.get('Authorization')
    return delete_calendar_event(token, id)

@app.route('/api/calendar/sync', methods=['GET'])
def calendar_sync():
    token = request.headers.get('Authorization')
    return sync_external_calendar(token)

# Content Management Endpoints
@app.route('/api/content/knowledge-base', methods=['GET'])
def knowledge_base_list():
    return get_knowledge_base()

@app.route('/api/content/knowledge-base/<int:id>', methods=['GET'])
def knowledge_article_details(id):
    return get_knowledge_article(id)

# @app.route('/api/content/knowledge-base', methods=['POST'])
# def knowledge_article_create():
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return create_knowledge_article(token, data)

# @app.route('/api/content/knowledge-base/<int:id>', methods=['PUT'])
# def knowledge_article_update(id):
#     token = request.headers.get('Authorization')
#     data = request.get_json()
#     return update_knowledge_article(token, id, data)

if __name__ == '__main__':
    app.run(debug=app_config.DEBUG, host='0.0.0.0', port=5000)

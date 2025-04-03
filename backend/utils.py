import jwt
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import uuid
from config import email_config, jwt_config
import json
import logging
import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("api.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Email utility function
def send_email(to_email, subject, body):
    try:
        if email_config.EMAIL_ENABLED:
            msg = MIMEMultipart()
            msg['From'] = email_config.EMAIL_FROM
            msg['To'] = to_email
            msg['Subject'] = subject

            msg.attach(MIMEText(body, 'plain'))

            server = smtplib.SMTP(email_config.SMTP_SERVER, email_config.SMTP_PORT)
            server.starttls()
            server.login(email_config.SMTP_USERNAME, email_config.SMTP_PASSWORD)
            server.send_message(msg)
            server.quit()
            logger.info(f"Email sent to {to_email} with subject: {subject}")
        else:
            # Log email in development mode
            logger.info(f"DEVELOPMENT MODE: Email to {to_email}")
            logger.info(f"Subject: {subject}")
            logger.info(f"Body: {body}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# JWT token generation with all parameters
def generate_token(user_id, email=None, role=None):
    """
    Generate a JWT token for authentication
    
    Parameters:
    - user_id: The user's ID (required)
    - email: The user's email (optional)
    - role: The user's role (optional)
    
    Returns:
    - JWT token string
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    
    # Add optional fields if provided
    if email:
        payload['email'] = email
    if role:
        payload['role'] = role
        
    token = jwt.encode(payload, jwt_config.JWT_SECRET_KEY, algorithm='HS256')
    return token

# Generate JWT token with just user_id
def generate_jwt_token(user_id):
    """
    Generate a JWT token with just the user ID
    
    Parameters:
    - user_id: The user's ID
    
    Returns:
    - JWT token string
    """
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }
    token = jwt.encode(payload, jwt_config.JWT_SECRET_KEY, algorithm='HS256')
    return token

# JWT token validation
def validate_token(token):
    if not token or not token.startswith('Bearer '):
        logger.warning("Missing or malformed token: %s", token)
        return None
    
    token = token.replace('Bearer ', '')
    logger.info("Decoding token: %s", token)  # Debugging line

    
    try:
        payload = jwt.decode(token, jwt_config.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        logger.warning("Token expired")
        return None
    except jwt.InvalidTokenError:
        logger.warning("Invalid token")
        return None

# Generate a unique identifier
def generate_uuid():
    return str(uuid.uuid4())

# Load JSON data
def load_json_data(file_path):
    try:
        with open(file_path, 'r') as file:
            return json.load(file)
    except Exception as e:
        logger.error(f"Failed to load JSON data from {file_path}: {str(e)}")
        return {}

# Format currency
def format_currency(amount):
    return f"${amount:.2f}"

# Date and time formatting
def format_date(date_str):
    from datetime import datetime
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        return date_obj.strftime('%d %b, %Y')
    except:
        return date_str

def format_time(time_str):
    from datetime import datetime
    try:
        time_obj = datetime.strptime(time_str, '%H:%M')
        return time_obj.strftime('%I:%M %p')
    except:
        return time_str

# Data validation functions
def validate_email(email):
    import re
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_phone(phone):
    import re
    pattern = r'^\+?[0-9\s-]{8,15}$'
    return re.match(pattern, phone) is not None

# Sample data for demonstration
sample_service_categories = [
    {"id": 1, "name": "Tax Services", "description": "Professional tax preparation and planning services"},
    {"id": 2, "name": "Accounting Services", "description": "Bookkeeping and accounting solutions for businesses"},
    {"id": 3, "name": "Business Advisory", "description": "Strategic financial advice for business growth"},
    {"id": 4, "name": "Training & Workshops", "description": "Educational sessions on financial management"}
]

sample_services = [
    {
        "id": 1,
        "name": "Personal Tax Return",
        "description": "Complete preparation and filing of personal income tax returns",
        "category_id": 1,
        "price": 250.00,
        "duration": 60,
        "is_active": True
    },
    {
        "id": 2,
        "name": "Business Tax Return",
        "description": "Comprehensive tax preparation for businesses of all sizes",
        "category_id": 1,
        "price": 800.00,
        "duration": 120,
        "is_active": True
    },
    {
        "id": 3,
        "name": "Monthly Bookkeeping",
        "description": "Regular bookkeeping services to maintain accurate financial records",
        "category_id": 2,
        "price": 350.00,
        "duration": 60,
        "is_active": True
    },
    {
        "id": 4,
        "name": "Financial Statement Preparation",
        "description": "Creation of profit & loss statements, balance sheets, and cash flow reports",
        "category_id": 2,
        "price": 500.00,
        "duration": 90,
        "is_active": True
    },
    {
        "id": 5,
        "name": "Business Growth Strategy",
        "description": "Custom strategic planning for business expansion and profitability",
        "category_id": 3,
        "price": 1200.00,
        "duration": 120,
        "is_active": True
    },
    {
        "id": 6,
        "name": "Tax Planning Workshop",
        "description": "Group workshop on tax-saving strategies and planning",
        "category_id": 4,
        "price": 150.00,
        "duration": 180,
        "is_active": True
    }
]


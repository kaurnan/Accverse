import os

# Main application configuration
class AppConfig:
    DEBUG = os.environ.get('FLASK_DEBUG', 'False') == 'True'
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
    API_PREFIX = '/api'
    CORS_HEADERS = 'Content-Type'
    
# Database configuration
class DatabaseConfig:
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_USER = os.environ.get('DB_USER', 'root')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'mysql.0987mysql')
    DB_NAME = os.environ.get('DB_NAME', 'Accverse')
    DB_PORT = int(os.environ.get('DB_PORT', 3306))

# JWT configuration
class JWTConfig:
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = 24 * 60 * 60  # 24 hours in seconds
    JWT_REFRESH_TOKEN_EXPIRES = 30 * 24 * 60 * 60  # 30 days in seconds

# Email configuration
class EmailConfig:
    EMAIL_ENABLED = os.environ.get('EMAIL_ENABLED', 'True') == 'True'
    EMAIL_FROM = os.environ.get('EMAIL_FROM', 'kaurnancy186@gmail.com')
    SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))
    SMTP_USERNAME = os.environ.get('SMTP_USERNAME', 'kaurnancy186@gmail.com')
    SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'pwnc mmiy rfkn gttd')

# File upload configuration
class UploadConfig:
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'png', 'jpg', 'jpeg', 'doc', 'docx', 'xls', 'xlsx'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16 MB

# Microsoft Teams integration configuration
class TeamsConfig:
    MS_CLIENT_ID = os.environ.get('MS_CLIENT_ID', '')
    MS_CLIENT_SECRET = os.environ.get('MS_CLIENT_SECRET', '')
    MS_TENANT_ID = os.environ.get('MS_TENANT_ID', '')
    MS_REDIRECT_URI = os.environ.get('MS_REDIRECT_URI', 'http://localhost:5000/api/auth/teams/callback')
    TEAMS_ENABLED = os.environ.get('TEAMS_ENABLED', 'False') == 'True'

# Firebase configuration
class FirebaseConfig:
    PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'accverse-8bd06')
    # Path to service account JSON file - in production, use environment variables
    SERVICE_ACCOUNT_PATH = os.environ.get('FIREBASE_SERVICE_ACCOUNT_PATH', os.path.join(os.getcwd(), 'firebase-service-account.json'))
    # For proper Firebase Admin initialization
    os.environ['GOOGLE_CLOUD_PROJECT'] = PROJECT_ID
    
# Create instances for import
app_config = AppConfig()
db_config = DatabaseConfig()
jwt_config = JWTConfig()
email_config = EmailConfig()
upload_config = UploadConfig()
teams_config = TeamsConfig()
firebase_config = FirebaseConfig()

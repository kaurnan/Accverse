import os
import firebase_admin
from firebase_admin import credentials, auth
import json
import logging
from config import firebase_config

logger = logging.getLogger(__name__)

def initialize_firebase_admin():
    """Initialize Firebase Admin SDK with service account credentials"""
    try:
        # Check if app is already initialized
        try:
            firebase_admin.get_app()
            logger.info("Firebase Admin SDK already initialized")
            return True
        except ValueError:
            pass
        
        # Initialize with service account file if it exists
        if os.path.exists(firebase_config.SERVICE_ACCOUNT_PATH):
            cred = credentials.Certificate(firebase_config.SERVICE_ACCOUNT_PATH)
            # firebase_admin.initialize_app(cred, {
            #     'projectId': firebase_config.PROJECT_ID
            # })
            firebase_admin.initialize_app(cred)
            logger.info("Firebase Admin SDK initialized with service account file")
            return True
        else:
            logger.error(f"Firebase service account file not found at {firebase_config.SERVICE_ACCOUNT_PATH}")
            # Fallback to application default credentials
            # firebase_admin.initialize_app(options={
            #     'projectId': firebase_config.PROJECT_ID
            # })
            firebase_admin.initialize_app()
            logger.info("Firebase Admin SDK initialized with application default credentials")
            return True
            
    except Exception as e:
        logger.error(f"Failed to initialize Firebase Admin SDK: {str(e)}")
        return False

def verify_firebase_token(token):
    """Verify Firebase ID token and return the decoded token"""
    try:
        # Initialize Firebase Admin if not already initialized
        if not hasattr(verify_firebase_token, "initialized"):
            verify_firebase_token.initialized = initialize_firebase_admin()
            
        if not verify_firebase_token.initialized:
            logger.error("Firebase Admin SDK not initialized")
            return None
            
        # Verify the token
        decoded_token = auth.verify_id_token(token)
        logger.info(f"Firebase token verified for user {decoded_token.get('uid')}")
        return decoded_token
    except Exception as e:
        logger.error(f"Error verifying Firebase token: {str(e)}")
        return None

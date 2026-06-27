import firebase_admin
from firebase_admin import credentials, firestore, storage
from app.core.config import settings
import os
import json
import logging

logger = logging.getLogger(__name__)

db = None
bucket = None
firebase_configured = False

def init_firebase():
    global db, bucket, firebase_configured
    if firebase_configured:
        return
        
    try:
        cred = None
        if settings.FIREBASE_CREDENTIALS_JSON:
            try:
                cred_dict = json.loads(settings.FIREBASE_CREDENTIALS_JSON)
                cred = credentials.Certificate(cred_dict)
                logger.info("Loaded Firebase credentials from JSON environment variable.")
            except Exception as e:
                logger.error(f"Failed to parse FIREBASE_CREDENTIALS_JSON: {e}")
                
        if not cred and os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            logger.info(f"Loaded Firebase credentials from {settings.FIREBASE_CREDENTIALS_PATH}.")

        if cred:
            if not firebase_admin._apps:
                firebase_admin.initialize_app(cred, {
                    'storageBucket': f"{settings.PROJECT_NAME.lower().replace(' ', '-')}.appspot.com"
                })
            db = firestore.client()
            bucket = storage.bucket()
            firebase_configured = True
            logger.info("Firebase Admin SDK initialized successfully.")
        else:
            logger.error(f"Firebase credentials not found. Set FIREBASE_CREDENTIALS_JSON or provide file at {settings.FIREBASE_CREDENTIALS_PATH}. Firebase features will fail.")
    except Exception as e:
        logger.error(f"Failed to initialize Firebase: {e}")

def get_db():
    return db

def get_bucket():
    return bucket

def check_firestore_health() -> bool:
    if not firebase_configured or not db:
        return False
    try:
        db.collection("health_check").limit(1).get()
        return True
    except Exception:
        return False

def check_storage_health() -> bool:
    if not firebase_configured or not bucket:
        return False
    try:
        return bucket.exists()
    except Exception:
        return False

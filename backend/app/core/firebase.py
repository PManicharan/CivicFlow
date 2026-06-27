import firebase_admin
from firebase_admin import credentials, firestore, storage
from app.core.config import settings
import os
import logging

logger = logging.getLogger(__name__)

db = None
bucket = None
firebase_configured = False

def init_firebase():
    global db, bucket, firebase_configured
    try:
        # Check if the service account file exists to avoid crashing in local dev without keys
        if os.path.exists(settings.FIREBASE_CREDENTIALS_PATH):
            cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS_PATH)
            firebase_admin.initialize_app(cred, {
                'storageBucket': f"{settings.PROJECT_NAME.lower().replace(' ', '-')}.appspot.com"
            })
            db = firestore.client()
            bucket = storage.bucket()
            firebase_configured = True
            logger.info("Firebase Admin SDK initialized successfully.")
        else:
            logger.error(f"Firebase credentials not found at {settings.FIREBASE_CREDENTIALS_PATH}. Firebase features will fail.")
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

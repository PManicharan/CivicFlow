from app.core.firebase import get_db, get_bucket
from app.models.schemas import SignalMetadata, InvestigationReport, CommunityImpact, ConfidenceBreakdown, AISafetyChecks
import logging
from uuid import uuid4
from datetime import datetime, timedelta
import os
from google.cloud import firestore

logger = logging.getLogger(__name__)

# Fallback in-memory store for local dev without Firebase
LOCAL_DB = {}

UPLOADS_DIR = "uploads"
if not os.path.exists(UPLOADS_DIR):
    os.makedirs(UPLOADS_DIR)

async def upload_image_to_storage(image_bytes: bytes, mime_type: str, filename: str) -> str:
    bucket = get_bucket()
    
    def save_locally():
        logger.warning("Firebase Storage unavailable or failed. Saving image locally.")
        file_path = os.path.join(UPLOADS_DIR, filename)
        with open(file_path, "wb") as f:
            f.write(image_bytes)
        # Assuming the backend runs on localhost:8000
        return f"http://localhost:8000/uploads/{filename}"

    if not bucket:
        return save_locally()
    
    try:
        blob = bucket.blob(f"signals/{filename}")
        blob.upload_from_string(image_bytes, content_type=mime_type)
        blob.make_public()
        return blob.public_url
    except Exception as e:
        logger.error(f"Failed to upload image to Firebase Storage: {e}")
        return save_locally()

async def save_signal_to_db(signal: SignalMetadata) -> str:
    """Saves the fully processed signal to Firestore or Local DB."""
    db = get_db()
    if not db:
        logger.warning("Firestore is not configured. Saving signal to local in-memory store.")
        LOCAL_DB[signal.id] = signal
        return signal.id
        
    try:
        signal_dict = signal.model_dump(exclude_none=True)
        if 'created_at' in signal_dict:
            signal_dict['created_at'] = signal_dict['created_at'].isoformat()
            
        doc_ref = db.collection('signals').document(signal.id)
        doc_ref.set(signal_dict)
        return signal.id
    except Exception as e:
        logger.error(f"Error saving to Firestore: {str(e)}")
        raise e

async def get_signal_from_db(signal_id: str) -> SignalMetadata:
    db = get_db()
    if not db:
        logger.warning("Firestore is not configured. Retrieving from local in-memory store.")
        if signal_id in LOCAL_DB:
            return LOCAL_DB[signal_id]
        raise Exception("Signal not found")
        
    try:
        doc = db.collection('signals').document(signal_id).get()
        if doc.exists:
            return SignalMetadata(**doc.to_dict())
        else:
            raise Exception("Signal not found")
    except Exception as e:
        logger.error(f"Error reading from Firestore: {e}")
        raise e

async def get_all_signals_from_db() -> list[SignalMetadata]:
    db = get_db()
    if not db:
        logger.warning("Firestore is not configured. Retrieving all from local in-memory store.")
        sorted_signals = sorted(LOCAL_DB.values(), key=lambda x: x.created_at, reverse=True)
        return sorted_signals
        
    try:
        docs = db.collection('signals').order_by('created_at', direction=firestore.Query.DESCENDING).stream()
        return [SignalMetadata(**doc.to_dict()) for doc in docs]
    except Exception as e:
        logger.error(f"Error reading all from Firestore: {e}")
        raise e

async def update_signal_status_in_db(signal_id: str, status: str) -> bool:
    db = get_db()
    if not db:
        if signal_id in LOCAL_DB:
            LOCAL_DB[signal_id].status = status
            return True
        raise Exception("Signal not found")
        
    try:
        doc_ref = db.collection('signals').document(signal_id)
        if doc_ref.get().exists:
            doc_ref.update({'status': status})
            return True
        else:
            raise Exception("Signal not found")
    except Exception as e:
        logger.error(f"Error updating status in Firestore: {e}")
        raise e

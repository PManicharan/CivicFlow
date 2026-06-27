import re
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Depends
from typing import Optional
from datetime import datetime
from uuid import uuid4

from app.services.gemini import analyze_signal, assess_evidence_quality
import app.services.gemini as gemini_module
from app.services.firestore import save_signal_to_db, get_signal_from_db, upload_image_to_storage, get_all_signals_from_db, update_signal_status_in_db
import app.core.firebase as firebase_module
from app.models.schemas import SignalMetadata, EvidenceQualityAssessment, InvestigationReport, StatusUpdateRequest
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB
MAX_TEXT_LENGTH = 1000

def sanitize_text(text: str) -> str:
    """Removes control characters and truncates to max length."""
    if not text:
        return ""
    # Remove all control characters
    text = re.sub(r'[\x00-\x1F\x7F]', '', text)
    return text[:MAX_TEXT_LENGTH]

async def validate_image(image: UploadFile) -> bytes:
    if image.content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=415, detail="Unsupported file format. Use JPG, PNG, or WEBP.")
    
    image_bytes = await image.read()
    if len(image_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File size exceeds 10MB limit.")
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Empty file uploaded.")
        
    return image_bytes

@router.post("/signals/assess", response_model=EvidenceQualityAssessment)
async def assess_evidence(image: UploadFile = File(...)):
    """Lightweight endpoint to assess image quality before full submission."""
    if not gemini_module.gemini_configured:
        raise HTTPException(status_code=503, detail="Gemini API key is not configured. AI assessment is unavailable.")
        
    try:
        image_bytes = await validate_image(image)
        assessment = await assess_evidence_quality(image_bytes, image.content_type)
        return assessment
    except ValueError as ve:
        logger.error(f"Validation or External API error: {ve}")
        raise HTTPException(status_code=502, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to assess evidence: {e}")
        raise HTTPException(status_code=500, detail="Failed to assess evidence quality.")

@router.post("/signals", response_model=InvestigationReport)
async def create_signal(
    title: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(...)
):
    """Ingests signal with full security validation."""
    if not gemini_module.gemini_configured:
        raise HTTPException(status_code=503, detail="Gemini API key is not configured. AI analysis is unavailable.")
    if not firebase_module.firebase_configured:
        raise HTTPException(status_code=503, detail="Firebase credentials not found. Database features are unavailable.")
        
    try:
        image_bytes = await validate_image(image)
        
        # Sanitize text
        clean_title = sanitize_text(title)
        clean_description = sanitize_text(description)
        clean_location = sanitize_text(location)
        
        signal_id = f"CF-{str(uuid4())[:8].upper()}"
        
        # Trigger Gemini AI Analysis
        report = await analyze_signal(
            signal_id, 
            image_bytes, 
            clean_title, 
            clean_description, 
            clean_location,
            image.content_type
        )
        
        # Upload image to storage
        image_url = await upload_image_to_storage(image_bytes, image.content_type, f"{signal_id}.jpg")
        
        # Save to DB
        signal_metadata = SignalMetadata(
            id=signal_id,
            title=clean_title,
            description=clean_description,
            location=clean_location,
            image_url=image_url,
            created_at=datetime.utcnow(),
            report=report
        )
        await save_signal_to_db(signal_metadata)
        
        return report

    except ValueError as ve:
        logger.error(f"Validation or External API error: {ve}")
        raise HTTPException(status_code=502, detail=str(ve))
    except HTTPException as he:
        raise he
    except Exception as e:
        logger.error(f"Failed to process signal: {e}")
        raise HTTPException(status_code=500, detail="Failed to process community signal.")

@router.get("/signals/{signal_id}", response_model=InvestigationReport)
async def get_signal(signal_id: str):
    if not firebase_module.firebase_configured:
        raise HTTPException(status_code=503, detail="Firebase credentials not found. Database features are unavailable.")
    try:
        signal = await get_signal_from_db(signal_id)
        if signal.report:
            return signal.report
        else:
            raise HTTPException(status_code=404, detail="Investigation report not found for this signal.")
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail="Signal not found.")
        logger.error(f"Failed to get signal: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve investigation case.")

@router.get("/signals", response_model=List[SignalMetadata])
async def get_all_signals():
    if not firebase_module.firebase_configured:
        raise HTTPException(status_code=503, detail="Firebase credentials not found. Database features are unavailable.")
    try:
        signals = await get_all_signals_from_db()
        return signals
    except Exception as e:
        logger.error(f"Failed to get all signals: {e}")
        raise HTTPException(status_code=500, detail="Failed to retrieve signals.")

@router.put("/signals/{signal_id}/status")
async def update_signal_status(signal_id: str, payload: StatusUpdateRequest):
    if not firebase_module.firebase_configured:
        raise HTTPException(status_code=503, detail="Firebase credentials not found. Database features are unavailable.")
    try:
        success = await update_signal_status_in_db(signal_id, payload.status)
        if success:
            return {"message": "Status updated successfully", "status": payload.status}
        raise HTTPException(status_code=400, detail="Failed to update status.")
    except Exception as e:
        if "not found" in str(e).lower():
            raise HTTPException(status_code=404, detail="Signal not found.")
        logger.error(f"Failed to update signal status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update investigation status.")

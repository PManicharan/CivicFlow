from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.firebase import init_firebase, check_firestore_health, check_storage_health
import app.core.firebase as firebase_module
import app.services.gemini as gemini_module
from app.api.routes import router as api_router
import logging
import time

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

_health_cache = {"time": 0, "storage": False, "firestore": False}
CACHE_TTL = 30

def create_app() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        description="Core AI Engine API for CivicFlow",
        version="1.0.0"
    )

    # Configure CORS for the frontend
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.BACKEND_CORS_ORIGINS,
        allow_origin_regex=settings.BACKEND_CORS_ORIGIN_REGEX,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Initialize external services on startup
    @app.on_event("startup")
    async def startup_event():
        logger.info("Initializing CivicFlow Core Services...")
        gemini_module.init_gemini()
        init_firebase()

    # Include routes
    app.include_router(api_router, prefix="/api")

    # Mount static files for local uploads
    app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

    @app.get("/health")
    async def health_check():
        global _health_cache
        current_time = time.time()
        
        if current_time - _health_cache["time"] > CACHE_TTL:
            _health_cache["storage"] = check_storage_health()
            _health_cache["firestore"] = check_firestore_health()
            _health_cache["time"] = current_time

        storage_conn = _health_cache["storage"]
        firestore_conn = _health_cache["firestore"]

        return {
            "status": "healthy",
            "environment": settings.ENVIRONMENT,
            "gemini_configured": gemini_module.gemini_configured,
            "gemini_api_key_present": bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your_gemini_api_key_here"),
            "firebase_configured": firebase_module.firebase_configured,
            "firestore_connectivity": firestore_conn,
            "storage_connectivity": storage_conn,
            "active_storage_backend": "firebase" if storage_conn else "local"
        }

    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Unhandled exception during {request.method} {request.url}: {exc}", exc_info=True)
        return JSONResponse(
            status_code=500,
            content={"detail": "An internal server error occurred.", "type": type(exc).__name__}
        )

    return app

app = create_app()

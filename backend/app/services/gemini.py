import google.generativeai as genai
from google.generativeai.types import content_types
from app.core.config import settings
from app.models.schemas import InvestigationReport, EvidenceQualityAssessment
import logging
import json

logger = logging.getLogger(__name__)

model = None
flash_model = None
gemini_configured = False

def init_gemini():
    global model, flash_model, gemini_configured
    if not settings.GEMINI_API_KEY or settings.GEMINI_API_KEY == "your_gemini_api_key_here":
        logger.error("GEMINI_API_KEY is not set or invalid. Gemini features will fail.")
        return

    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        flash_model = genai.GenerativeModel('gemini-2.5-flash')
        
        # Lightweight validation request
        flash_model.generate_content("Ping")
        gemini_configured = True
        logger.info("Gemini API initialized and validated successfully.")
    except Exception as e:
        logger.error(f"Failed to initialize Gemini API: {e}")
        model = None
        flash_model = None

SYSTEM_PROMPT = """
You are a highly analytical Civic Infrastructure AI Investigator.
Your objective is to output a precise, operational structured JSON payload.
You must never output conversational text. You are a decision-support engine.

RULES:
1. Do not fabricate facts. If the image is unclear or the issue is ambiguous, explicitly state 'Unable to Determine' or 'Low Confidence'.
2. Classify confidence strictly as: 'Very High', 'High', 'Moderate', or 'Low'. (95-100=Very High, 85-94=High, 70-84=Moderate, <70=Low).
3. If confidence is 'Low', recommendedAction should be 'Additional Evidence Recommended'.
4. Trust Score is a penalty-based metric: start at 100, deduct if the text description contradicts the image, or if image quality is poor.
5. Provide `priorityReasons` as a list of strings explaining the priority.
6. Provide `communityImpact` as an object with `estimatedCitizensAffected`, `primaryAffectedGroups`, `estimatedResponseWindow`, `expectedRiskReduction`. Use qualitative values (e.g. High/Medium/Low) if exact numbers cannot be inferred.
7. Set `aiSafetyChecks` with passed, inputValidated, imageVerified, promptSanitized, secureProcessing, confidenceThresholdPassed (all true if no issues), and an array of flags.
8. Return ONLY a valid JSON object matching the requested schema. No markdown wrapping.
"""



def strip_json_markdown(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

async def assess_evidence_quality(image_bytes: bytes, mime_type: str = "image/jpeg") -> EvidenceQualityAssessment:
    if not flash_model:
        raise ValueError("Gemini API key is missing. Cannot assess evidence quality.")
    
    try:
        prompt = "Assess the visual clarity, lighting, and context richness of this image for civic infrastructure reporting. You are an expert AI vision system. Give realistic scores based on the actual image provided. Return JSON."
        image_part = {"mime_type": mime_type, "data": image_bytes}
        
        # We use flash for quick pre-assessment
        response = flash_model.generate_content(
            [prompt, image_part],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=EvidenceQualityAssessment
            )
        )
        data = json.loads(strip_json_markdown(response.text))
        return EvidenceQualityAssessment(**data)
    except Exception as e:
        logger.error(f"Evidence quality assessment failed: {e}")
        raise ValueError(f"Gemini API Error: {str(e)}")

async def analyze_signal(signal_id: str, image_bytes: bytes, title: str, description: str, location: str, mime_type: str = "image/jpeg") -> InvestigationReport:
    """
    Multimodal analysis with 1 retry and fallback logic.
    """
    if not model:
        raise ValueError("Gemini API key is missing. Cannot analyze signal.")

    prompt = f"{SYSTEM_PROMPT}\n\nTitle: {title}\nDescription: {description}\nLocation: {location}\nGenerate the structured investigation JSON."
    image_part = {"mime_type": mime_type, "data": image_bytes}
    
    # Pass 1
    try:
        response = model.generate_content(
            [prompt, image_part],
            generation_config=genai.GenerationConfig(
                response_mime_type="application/json",
                response_schema=InvestigationReport
            )
        )
        data = json.loads(strip_json_markdown(response.text))
        data['caseId'] = signal_id
        return InvestigationReport(**data)
    except Exception as e1:
        logger.warning(f"Gemini Pass 1 Failed: {e1}. Retrying...")
        # Pass 2
        try:
            response = model.generate_content(
                [prompt, image_part],
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=InvestigationReport
                )
            )
            data = json.loads(strip_json_markdown(response.text))
            data['caseId'] = signal_id
            return InvestigationReport(**data)
        except Exception as e2:
            logger.error(f"Gemini Pass 2 Failed: {e2}. Raising error.")
            raise ValueError(f"Gemini AI Analysis Failed: {str(e2)}")

async def copilot_action(signal_data: dict, action: str, context_notes: str = None) -> str:
    """
    Contextual AI actions for the Ops Workspace.
    """
    if not model:
        raise ValueError("Gemini API key is missing. Cannot use Copilot.")

    base_prompt = f"You are an AI Copilot assisting a Civic Operations Officer. Here is the case context:\n\n{json.dumps(signal_data, indent=2)}\n\n"
    
    if action == "summarize":
        prompt = base_prompt + "Please provide a concise 2-3 sentence executive summary of this case, focusing on what needs to be done next."
    elif action == "recommend_action":
        prompt = base_prompt + "Please provide 3 specific, actionable steps the operations team should take to resolve this issue safely and effectively."
    elif action == "generate_response":
        prompt = base_prompt + "Please draft a polite, professional 2-3 sentence response to the citizen who reported this, explaining the current status and next steps."
    elif action == "generate_officer_report":
        prompt = base_prompt + "Please generate a formal Officer Report outlining the findings, current evidence, and recommended protocol for this civic issue."
    elif action == "recommend_department":
        prompt = base_prompt + "Based on the case details, which city department (e.g., Public Works, Sanitation, Traffic, Parks) is best suited to handle this? Briefly explain why."
    elif action == "estimate_severity":
        prompt = base_prompt + "Analyze the potential public impact and safety risks of this issue. Estimate the severity (Low, Medium, High, Critical) and justify the rating."
    elif action == "generate_resolution_summary":
        prompt = base_prompt + "Generate a detailed, final resolution summary that explains how the issue was resolved, the resources used, and the outcome, suitable for public record."
    elif action == "generate_internal_notes":
        prompt = base_prompt + "Draft concise internal operational notes for the shift handover regarding this case, highlighting only the critical technical facts."
    else:
        prompt = base_prompt + f"Please assist with the following request: {action}"

    if context_notes:
        prompt += f"\n\nOfficer Notes: {context_notes}"

    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        logger.error(f"Copilot action failed: {e}")
        raise ValueError(f"Copilot AI failed: {str(e)}")

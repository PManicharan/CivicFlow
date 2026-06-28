from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ConfidenceBreakdown(BaseModel):
    imageQuality: int = Field(description="Score from 0-100 indicating visual clarity of the image.")
    locationMatch: int = Field(description="Score from 0-100 indicating if context matches location.")
    evidenceCompleteness: int = Field(description="Score from 0-100.")
    duplicateRisk: int = Field(description="Score from 0-100. Lower means less likely to be a duplicate.")
    metadataIntegrity: int = Field(description="Score from 0-100.")

class AISafetyChecks(BaseModel):
    passed: bool = Field(description="True if no safety or manipulation flags triggered.")
    inputValidated: bool = Field(description="True if input was validated successfully.")
    imageVerified: bool = Field(description="True if image verification passed.")
    promptSanitized: bool = Field(description="True if prompt sanitization was successful.")
    secureProcessing: bool = Field(description="True if processing was done securely.")
    confidenceThresholdPassed: bool = Field(description="True if confidence threshold is met.")
    flags: List[str] = Field(description="List of safety flags, empty if passed.")

class CommunityImpact(BaseModel):
    estimatedCitizensAffected: str = Field(description="Estimated number or descriptive scale of affected citizens.")
    primaryAffectedGroups: str = Field(description="Groups primarily affected by this issue.")
    estimatedResponseWindow: str = Field(description="Estimated response window or priority timeline.")
    expectedRiskReduction: str = Field(description="Expected risk reduction after issue resolution.")

class InvestigationReport(BaseModel):
    """Strict JSON schema required from Gemini AI"""
    caseId: str = Field(description="A unique ID for the case")
    issueType: str = Field(description="Categorization of the issue (e.g. Infrastructure Hazard)")
    severity: str = Field(description="Severity assessment. Use 'Unable to Determine' if unclear.")
    confidence: str = Field(description="Must be 'Very High', 'High', 'Moderate', or 'Low'")
    evidenceQuality: str = Field(description="Assessment of evidence quality (e.g. 'Poor', 'Good')")
    trustScore: int = Field(description="Overall Trust Score (0-100)")
    keyFindings: List[str] = Field(description="3-5 bullet points of key observations.")
    evidenceSummary: str = Field(description="Summary of what the evidence proves.")
    reasoning: str = Field(description="Detailed logic of how conclusions were drawn.")
    priorityLevel: str = Field(description="Priority: 'Routine', 'Elevated', 'Urgent', 'Critical'")
    priorityReasons: List[str] = Field(description="Structured reasons why this priority was assigned.")
    communityImpact: CommunityImpact
    recommendedDepartment: str = Field(description="Which department should handle this.")
    recommendedAction: str = Field(description="Operational recommendation. Use 'Additional Evidence Recommended' if uncertain.")
    confidenceBreakdown: ConfidenceBreakdown
    aiSafetyChecks: AISafetyChecks

class EvidenceQualityAssessment(BaseModel):
    qualityScore: int = Field(description="0-100 score of image quality")
    isAcceptable: bool = Field(description="True if quality is sufficient for AI analysis")
    feedback: str = Field(description="Feedback to the user if image is blurry, too dark, or unclear.")
    imageQuality: int = Field(description="0-100 score of image clarity")
    lighting: int = Field(description="0-100 score of lighting conditions")
    subjectVisibility: int = Field(description="0-100 score of subject visibility")
    contextRichness: int = Field(description="0-100 score of context richness")

class TimelineEvent(BaseModel):
    status: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    note: Optional[str] = None
    officer_id: Optional[str] = None

class SignalMetadata(BaseModel):
    id: str
    title: str
    description: str
    location: str
    image_url: Optional[str] = None
    created_at: datetime
    status: str = "Open"
    report: Optional[InvestigationReport] = None
    timeline: List[TimelineEvent] = Field(default_factory=list)
    resolution_image_url: Optional[str] = None
    officer_notes: Optional[str] = None
    assigned_to: Optional[str] = None

class StatusUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = None
    officer_id: Optional[str] = None
    resolution_image_url: Optional[str] = None

class CopilotRequest(BaseModel):
    action: str
    context: Optional[str] = None

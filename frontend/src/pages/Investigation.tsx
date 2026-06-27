import { useState, useEffect } from 'react';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, Circle, Loader2, AlertTriangle, ShieldCheck, MapPin, Building2, Send, BrainCircuit, ScanSearch, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TIMELINE_STEPS = [
  'Evidence Uploaded',
  'Evidence Validation',
  'Vision Analysis',
  'Context Understanding',
  'Severity Assessment',
  'Department Recommendation',
  'Decision Ready'
];

export function Investigation() {
  const location = useLocation();
  const state = location.state as { report?: any, imagePreview?: string, submittedLocation?: string } | null;
  const report = state?.report;
  
  const [loadingStep, setLoadingStep] = useState(0);
  const [isInvestigating, setIsInvestigating] = useState(true);
  const [showFullExplanation, setShowFullExplanation] = useState(false);
  const navigate = useNavigate();
  
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("Open");
  
  const handleUpdateStatus = async (newStatus: string) => {
    if (!report?.caseId) return;
    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/signals/${report.caseId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      setCurrentStatus(newStatus);
      alert(`Case successfully marked as ${newStatus}`);
      navigate('/operations');
    } catch (err: any) {
      alert(err.message || "Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!isInvestigating) return;
    
    const interval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= TIMELINE_STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setIsInvestigating(false), 800);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isInvestigating]);

  if (!report && !isInvestigating) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center max-w-lg mx-auto w-full px-4">
        <div className="text-center space-y-4">
          <AlertTriangle className="w-16 h-16 mx-auto text-error" />
          <h2 className="text-2xl font-semibold tracking-tight text-error">Investigation Failed</h2>
          <p className="text-muted-foreground">The AI engine was unable to complete the analysis or the report data is missing.</p>
          <Button onClick={() => navigate('/signal')} variant="outline" className="mt-4">
            Return to Submission
          </Button>
        </div>
      </div>
    );
  }

  if (isInvestigating) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center max-w-lg mx-auto w-full px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full space-y-8"
        >
          <div className="text-center space-y-2">
            <BrainCircuit className="w-10 h-10 mx-auto text-primary animate-pulse" />
            <h2 className="text-2xl font-semibold tracking-tight">AI Investigation in Progress</h2>
            <p className="text-muted-foreground">Gemini is analyzing the submitted signal...</p>
          </div>
          
          <div className="space-y-4 bg-muted/20 p-6 rounded-xl border border-border">
            {TIMELINE_STEPS.map((step, index) => {
              const isCompleted = index < loadingStep;
              const isActive = index === loadingStep;
              const isPending = index > loadingStep;

              return (
                <div key={index} className="flex items-center gap-3">
                  {isCompleted && <CheckCircle2 className="w-5 h-5 text-success" />}
                  {isActive && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                  {isPending && <Circle className="w-5 h-5 text-muted-foreground opacity-30" />}
                  <span className={`text-sm font-medium ${isCompleted ? 'text-foreground' : isActive ? 'text-foreground animate-pulse' : 'text-muted-foreground opacity-50'}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    );
  }

  const confidenceMetrics = [
    { label: "Image Quality", value: 92 },
    { label: "Location Match", value: 100 },
    { label: "Evidence Completeness", value: 85 },
    { label: "Duplicate Risk", value: 98 },
    { label: "Metadata Integrity", value: 100 }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
      {/* Workspace Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight">AI Investigation Case</h1>
            <Badge variant="outline" className="text-muted-foreground bg-muted/50">#{report?.caseId || 'CF-XXXX'}</Badge>
          </div>
          <div className="flex items-center text-muted-foreground text-sm gap-4 mt-2">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {state?.submittedLocation || 'Unknown Location'}</span>
            <span className="flex items-center gap-1"><ScanSearch className="w-4 h-4" /> Investigated Just Now</span>
            <Badge variant="success" className="bg-success/10 text-success border-success/20">Case Open</Badge>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="shadow-subtle" 
            onClick={() => handleUpdateStatus('Rejected')} 
            disabled={isUpdatingStatus}
          >
            Reject Case
          </Button>
          <Button 
            className="flex items-center gap-2 shadow-subtle" 
            onClick={() => handleUpdateStatus('Approved')} 
            disabled={isUpdatingStatus}
          >
            <Send className="w-4 h-4" /> Dispatch to Operations
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Side: Timeline (Storytelling) */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Case History</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-border before:to-transparent">
              {TIMELINE_STEPS.map((step, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-2 rounded border border-border shadow-subtle bg-background">
                    <div className="text-xs font-medium text-foreground">{step}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center/Right: Main Content */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Case Summary & AI Findings */}
          <Card className="border-t-4 border-t-error shadow-subtle overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-semibold">{report?.issueType || 'Unknown Issue'}</h2>
                    <p className="text-muted-foreground text-sm mt-1">Severity: {report?.severity || 'Unknown'} • Analyzed by Gemini</p>
                  </div>
                  <Badge variant="error" className="text-sm px-3 py-1 uppercase tracking-wider shadow-sm">{report?.priorityLevel || 'Routine'} Priority</Badge>
                </div>
              </div>

              <div className="p-6 space-y-8">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Key Findings</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report?.keyFindings?.map((finding: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-6 border border-border rounded-lg overflow-hidden">
                    <button 
                      onClick={() => setShowFullExplanation(!showFullExplanation)}
                      className="w-full flex items-center justify-between p-4 bg-muted/20 hover:bg-muted/40 transition-colors text-sm font-medium"
                    >
                      View Detailed AI Reasoning
                      {showFullExplanation ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <AnimatePresence>
                      {showFullExplanation && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-4 pb-4 bg-muted/20 text-sm text-muted-foreground leading-relaxed"
                        >
                          {report?.reasoning || 'No reasoning provided.'}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report?.confidence === 'Low' ? (
                    <div className="bg-error/10 p-5 rounded-xl border border-error">
                      <span className="text-xs font-semibold uppercase tracking-wider text-error block mb-2">Investigation Confidence Reduced</span>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm text-error">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Additional evidence recommended</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm text-error">
                          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>Human verification advised</span>
                        </li>
                      </ul>
                    </div>
                  ) : (
                    <div className="bg-muted/10 p-5 rounded-xl border border-border">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">Evidence Summary</span>
                      <span className="text-sm font-medium">{report?.evidenceSummary || 'No summary available.'}</span>
                    </div>
                  )}
                  <div className="bg-primary/5 p-5 rounded-xl border border-primary/20">
                    <span className="text-xs font-semibold uppercase tracking-wider text-primary block mb-2">Department Recommendation</span>
                    <span className="text-sm font-medium flex items-center gap-2"><Building2 className="w-4 h-4" /> {report?.recommendedDepartment || 'General Operations'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/10 p-5 rounded-xl border border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-4">Why This Case Was Prioritized</span>
                    <ul className="space-y-2">
                      {report?.priorityReasons?.map((reason: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-sm font-medium">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-muted/10 p-5 rounded-xl border border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-4">Expected Community Impact</span>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Citizens Affected</span>
                        <span className="font-medium">{report?.communityImpact?.estimatedCitizensAffected || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Primary Groups</span>
                        <span className="font-medium">{report?.communityImpact?.primaryAffectedGroups || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Response Window</span>
                        <span className="font-medium">{report?.communityImpact?.estimatedResponseWindow || 'Unknown'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block mb-1 text-xs">Risk Reduction</span>
                        <span className="font-medium">{report?.communityImpact?.expectedRiskReduction || 'Unknown'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Premium Confidence Module */}
            <Card className="shadow-subtle">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Investigation Confidence</h3>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-full border-4 border-success flex items-center justify-center">
                    <span className="text-xl font-bold text-success">{report?.trustScore || 0}%</span>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Overall Confidence</div>
                    <div className="text-sm text-muted-foreground">{report?.confidence || 'Unknown'} Confidence Level</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { label: "Image Quality", value: report?.confidenceBreakdown?.imageQuality || 0 },
                    { label: "Location Match", value: report?.confidenceBreakdown?.locationMatch || 0 },
                    { label: "Evidence Completeness", value: report?.confidenceBreakdown?.evidenceCompleteness || 0 },
                    { label: "Duplicate Risk", value: report?.confidenceBreakdown?.duplicateRisk || 0 },
                    { label: "Metadata Integrity", value: report?.confidenceBreakdown?.metadataIntegrity || 0 }
                  ].map((metric, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-foreground">{metric.label}</span>
                        <span className="text-muted-foreground">{metric.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.value}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full bg-primary rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Evidence & Action */}
            <div className="space-y-8">
              <Card className="shadow-subtle">
                <CardContent className="p-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">AI Validation</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground">Input Validated</span>
                      {report?.aiSafetyChecks?.inputValidated ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-error" />}
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground">Image Verified</span>
                      {report?.aiSafetyChecks?.imageVerified ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-error" />}
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground">Prompt Sanitized</span>
                      {report?.aiSafetyChecks?.promptSanitized ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-error" />}
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border/50">
                      <span className="text-muted-foreground">Secure Processing</span>
                      {report?.aiSafetyChecks?.secureProcessing ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-error" />}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Confidence Threshold Passed</span>
                      {report?.aiSafetyChecks?.confidenceThresholdPassed ? <CheckCircle2 className="w-4 h-4 text-success" /> : <AlertTriangle className="w-4 h-4 text-error" />}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Evidence</h3>
                <div className="rounded-xl overflow-hidden border border-border shadow-subtle bg-muted flex items-center justify-center h-48 relative">
                  {state?.imagePreview ? (
                    <img src={state.imagePreview} alt="Evidence" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <p className="text-sm">No Evidence Image</p>
                    </div>
                  )}
                </div>
              </div>

              <Card className="bg-primary text-primary-foreground border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-warning" />
                    <h3 className="font-semibold">Recommended Action</h3>
                  </div>
                  <p className="text-sm opacity-90 leading-relaxed mb-6">
                    {report?.recommendedAction || 'No action recommended.'}
                  </p>
                  <Button 
                    variant="secondary" 
                    className="w-full shadow-sm hover:-translate-y-0.5 transition-transform"
                    onClick={() => handleUpdateStatus('Approved')}
                    disabled={isUpdatingStatus}
                  >
                    Approve & Dispatch
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

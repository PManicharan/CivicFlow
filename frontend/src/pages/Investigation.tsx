import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Textarea } from '../components/ui/Textarea';
import { CheckCircle2, Loader2, AlertTriangle, MapPin, Building2, Bot, ImagePlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { SafeImage } from '../components/ui/SafeImage';
import { Skeleton } from '../components/ui/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function Investigation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  // Copilot State
  const [copilotAction, setCopilotAction] = useState<string | null>(null);
  const [copilotResponse, setCopilotResponse] = useState<string | null>(null);
  const [copilotLoading, setCopilotLoading] = useState(false);
  const [officerNotes, setOfficerNotes] = useState('');
  
  // Resolution State
  const [resolutionImageUrl, setResolutionImageUrl] = useState('');
  const [showResolutionForm, setShowResolutionForm] = useState(false);

  const isMounted = useRef(true);

  const fetchSignal = useCallback(async (isInitial = false) => {
    if (!id) return;
    try {
      const response = await fetch(`${API_URL}/api/signals/${id}`);
      if (!response.ok) {
        if (response.status === 404) {
          if (isMounted.current) setError(true);
          return;
        }
        throw new Error(`Server error: ${response.status}`);
      }
      const data = await response.json();
      if (isMounted.current) {
        setSignal(data);
        setError(false);
      }
    } catch (err) {
      console.error("Failed to fetch signal:", err);
      if (isMounted.current) setError(true);
    } finally {
      if (isMounted.current && isInitial) setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    isMounted.current = true;
    fetchSignal(true);
    const intervalId = window.setInterval(() => fetchSignal(false), 15000);
    return () => {
      isMounted.current = false;
      window.clearInterval(intervalId);
    };
  }, [fetchSignal]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!signal?.id) return;
    setIsUpdatingStatus(true);
    
    const payload = {
      status: newStatus,
      note: officerNotes,
      officer_id: currentUser?.email,
      resolution_image_url: resolutionImageUrl
    };
    
    try {
      const response = await fetch(`${API_URL}/api/signals/${signal.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
      toast.success(`Case marked as ${newStatus}`);
      setShowResolutionForm(false);
      setOfficerNotes('');
      setResolutionImageUrl('');
      // Re-fetch to get updated data
      fetchSignal(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleCopilot = async (action: string) => {
    if (!signal?.id) return;
    setCopilotAction(action);
    setCopilotLoading(true);
    setCopilotResponse(null);
    try {
      const response = await fetch(`${API_URL}/api/signals/${signal.id}/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, context: officerNotes })
      });
      if (!response.ok) throw new Error("Copilot failed");
      const data = await response.json();
      setCopilotResponse(data.response);
    } catch {
      toast.error("AI Copilot is currently unavailable.");
    } finally {
      setCopilotLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4 mb-8 pb-6 border-b border-border">
          <Skeleton className="h-10 w-80" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center max-w-lg mx-auto w-full px-4 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-error mb-4" />
        <h2 className="text-2xl font-semibold tracking-tight text-error">Investigation Not Found</h2>
        <p className="text-muted-foreground mt-2">The case you are looking for does not exist or you lack permissions.</p>
        <Button onClick={() => navigate('/workspace/operations')} variant="outline" className="mt-6">
          Return to Mission Control
        </Button>
      </div>
    );
  }

  const report = signal.report;
  const imagePreview = signal.image_url;
  const timeline = signal.timeline || [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight">Case Investigation</h1>
            <Badge variant="outline" className="text-muted-foreground bg-muted/50">#{signal.id}</Badge>
          </div>
          <div className="flex items-center text-muted-foreground text-sm gap-4 mt-2">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {signal.location}</span>
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">{signal.status}</Badge>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {signal.status === 'Open' && (
            <>
              <Button onClick={() => handleUpdateStatus('Approved')} disabled={isUpdatingStatus} variant="outline" className="shadow-subtle text-success border-success/30 hover:bg-success/10">
                Approve
              </Button>
              <Button onClick={() => handleUpdateStatus('Rejected')} disabled={isUpdatingStatus} variant="outline" className="shadow-subtle text-error border-error/30 hover:bg-error/10">
                Reject
              </Button>
            </>
          )}
          {signal.status === 'Approved' && (
            <Button onClick={() => handleUpdateStatus('Assigned')} disabled={isUpdatingStatus} variant="outline" className="shadow-subtle">
              Assign to Me
            </Button>
          )}
          {signal.status === 'Assigned' && (
            <Button onClick={() => handleUpdateStatus('In Progress')} disabled={isUpdatingStatus} className="shadow-subtle gap-2">
              <Building2 className="w-4 h-4" /> Start Work
            </Button>
          )}
          {signal.status === 'In Progress' && (
            <Button onClick={() => setShowResolutionForm(!showResolutionForm)} disabled={isUpdatingStatus} variant="primary" className="shadow-subtle gap-2">
              <CheckCircle2 className="w-4 h-4" /> Mark as Resolved
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showResolutionForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mb-8 overflow-hidden">
            <Card className="border-primary/20 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-success" /> Resolve Case</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution Image URL (Required for Before/After Slider)</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <ImagePlus className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
                        <input 
                          type="url" 
                          placeholder="https://example.com/after.jpg" 
                          className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                          value={resolutionImageUrl}
                          onChange={(e) => setResolutionImageUrl(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Resolution Notes</label>
                    <Textarea 
                      placeholder="Detail the work performed to resolve this issue..." 
                      value={officerNotes}
                      onChange={(e) => setOfficerNotes(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setShowResolutionForm(false)}>Cancel</Button>
                    <Button onClick={() => handleUpdateStatus('Resolved')} disabled={!resolutionImageUrl || isUpdatingStatus}>Submit Resolution</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Timeline */}
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Case Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
              {timeline.map((event: any, i: number) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-background bg-primary text-primary-foreground shadow shrink-0 z-10 mt-0.5">
                    <CheckCircle2 className="w-3 h-3" />
                  </div>
                  <div className="w-full p-3 rounded-lg border border-border bg-muted/20">
                    <div className="text-sm font-semibold text-foreground mb-1">{event.status}</div>
                    <div className="text-xs text-muted-foreground mb-2">
                      {new Date(event.timestamp).toLocaleString()}
                    </div>
                    {event.note && (
                      <div className="text-xs text-foreground/80 bg-background/50 p-2 rounded border border-border/50">
                        "{event.note}"
                      </div>
                    )}
                    {event.officer_id && (
                      <div className="text-xs text-muted-foreground mt-2 italic">
                        - {event.officer_id}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Center Col: Main Details */}
        <div className="lg:col-span-6 space-y-6">
          {signal.status === 'Resolved' && signal.resolution_image_url && imagePreview && (
            <Card className="shadow-subtle border-success/30 overflow-hidden">
              <div className="bg-success/10 p-3 border-b border-success/20 text-success text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Before & After Evidence
              </div>
              <div className="relative w-full h-64 md:h-96 select-none group flex">
                <SafeImage src={imagePreview} alt="Before" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 w-1/2 overflow-hidden border-r-2 border-primary group-hover:border-primary/80 transition-colors duration-200 shadow-[2px_0_10px_rgba(0,0,0,0.5)] flex">
                  <SafeImage src={signal.resolution_image_url} alt="After" className="absolute inset-0 w-[200vw] max-w-none h-full object-cover" />
                </div>
                <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm z-10">After</div>
                <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold shadow-sm z-10">Before</div>
              </div>
            </Card>
          )}

          <Card className="border-t-4 border-t-error shadow-subtle overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6 border-b border-border bg-muted/10">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="text-2xl font-semibold">{report?.issueType || signal.title}</h2>
                    <p className="text-muted-foreground text-sm mt-1">Severity: {report?.severity || 'Unknown'} • Priority: {report?.priorityLevel || 'Routine'} • Dept: {report?.recommendedDepartment || 'General'}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Citizen Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm bg-muted/20 p-4 rounded-lg border border-border">
                     <div>
                       <span className="text-muted-foreground">Source:</span> Public Portal
                     </div>
                     <div>
                       <span className="text-muted-foreground">Verification:</span> Anonymous Reporter
                     </div>
                     <div>
                       <span className="text-muted-foreground">Submitted:</span> {new Date(signal.created_at).toLocaleString()}
                     </div>
                     <div>
                       <span className="text-muted-foreground">Location:</span> {signal.location}
                     </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Key Findings</h3>
                  <ul className="grid grid-cols-1 gap-2 text-sm text-foreground">
                    {report?.keyFindings?.map((finding: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Interactive Location Map</h3>
                  <div className="w-full h-48 bg-muted/50 rounded-lg border border-border relative overflow-hidden flex items-center justify-center">
                    {/* Simulated CSS Map */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                    <div className="z-10 flex flex-col items-center">
                       <MapPin className="w-8 h-8 text-primary drop-shadow-md animate-bounce" />
                       <div className="mt-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-semibold shadow-sm border border-primary/20">
                         {signal.location}
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
               <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Original Evidence</h3>
                  <div className="rounded-xl overflow-hidden border border-border bg-muted h-64 md:h-80 relative flex">
                   <SafeImage src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
                  </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: AI Copilot */}
        <div className="lg:col-span-3">
          <div className="sticky top-24 space-y-6">
            <Card className="border-primary/20 bg-primary/5 shadow-md">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Bot className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-primary tracking-tight">AI Copilot</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                  Generate context-aware insights and responses using Gemini.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('summarize')}>
                    Summarize Case
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('recommend_action')}>
                    Recommend Action
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('generate_response')}>
                    Draft Citizen Response
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('generate_officer_report')}>
                    Generate Officer Report
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('recommend_department')}>
                    Recommend Department
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('estimate_severity')}>
                    Estimate Severity
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('generate_resolution_summary')}>
                    Generate Resolution Summary
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-background/50 hover:bg-primary/10 transition-colors" onClick={() => handleCopilot('generate_internal_notes')}>
                    Generate Internal Notes
                  </Button>
                </div>

                <AnimatePresence>
                  {copilotLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-6 flex justify-center">
                      <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </motion.div>
                  )}
                  {copilotResponse && !copilotLoading && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 p-4 bg-background rounded-lg border border-primary/20 text-sm shadow-inner relative">
                      <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-primary text-primary-foreground text-[10px] uppercase font-bold px-2 py-0.5 rounded-full shadow">
                        {copilotAction}
                      </div>
                      <div className="whitespace-pre-wrap">{copilotResponse}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>

            <Card className="shadow-subtle">
              <CardContent className="p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Confidence Assessment</h3>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full border-4 border-success flex items-center justify-center">
                    <span className="text-sm font-bold text-success">{report?.trustScore || 0}%</span>
                  </div>
                  <div>
                    <div className="font-medium text-sm">Overall Confidence</div>
                    <div className="text-xs text-muted-foreground">{report?.confidence || 'Unknown'} Level</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
}

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CheckCircle2, AlertTriangle, MapPin, ArrowLeft } from 'lucide-react';
import { SafeImage } from '../components/ui/SafeImage';
import { Skeleton } from '../components/ui/Skeleton';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function PublicTracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [signal, setSignal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl mt-16">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="space-y-4 mb-8 pb-6 border-b border-border">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !signal) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center max-w-lg mx-auto w-full px-4 text-center">
        <AlertTriangle className="w-16 h-16 mx-auto text-error mb-4" />
        <h2 className="text-2xl font-semibold tracking-tight text-error">Case Not Found</h2>
        <p className="text-muted-foreground mt-2">We couldn't find a civic issue matching this ID.</p>
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="mt-6">
          View Community Dashboard
        </Button>
      </div>
    );
  }

  const timeline = signal.timeline || [];
  const imagePreview = signal.image_url;

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in mt-16">
      <Button variant="ghost" className="mb-6 -ml-4 text-muted-foreground hover:text-foreground" onClick={() => navigate('/dashboard')}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
      </Button>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-3xl font-semibold tracking-tight">{signal.report?.issueType || signal.title}</h1>
            <Badge variant="outline" className="text-muted-foreground bg-muted/50">#{signal.id}</Badge>
          </div>
          <div className="flex items-center text-muted-foreground text-sm gap-4 mt-2">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {signal.location}</span>
            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">{signal.status}</Badge>
          </div>
        </div>
      </div>

      <div className="mb-12 max-w-3xl mx-auto">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-muted -z-10 -translate-y-1/2"></div>
          {['Open', 'Assigned', 'In Progress', 'Resolved'].map((step) => {
            const steps = ['Open', 'Approved', 'Assigned', 'In Progress', 'Resolved', 'Rejected'];
            // Normalize status to our 4 main tracking steps
            let currentIdx = steps.indexOf(signal.status);
            if (currentIdx === 1) currentIdx = 0; // Approved maps to Open step in progress bar
            if (currentIdx === 5) currentIdx = 4; // Rejected mapped to end
            
            const stepIdx = ['Open', 'Assigned', 'In Progress', 'Resolved'].indexOf(step);
            
            // Re-evaluating proper step completion
            let normalizedCurrent = 0;
            switch(signal.status) {
                case 'Open': case 'Approved': normalizedCurrent = 0; break;
                case 'Assigned': normalizedCurrent = 1; break;
                case 'In Progress': normalizedCurrent = 2; break;
                case 'Resolved': case 'Rejected': normalizedCurrent = 3; break;
            }

            const active = stepIdx <= normalizedCurrent;

            return (
              <div key={step} className="flex flex-col items-center gap-2 bg-background px-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${active ? 'bg-primary border-primary text-primary-foreground' : 'bg-muted border-muted-foreground/30 text-muted-foreground'}`}>
                  {active ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{step}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Timeline */}
        <div className="lg:col-span-5">
          <div className="sticky top-24">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-6">Progress Tracking</h3>
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
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Details & Evidence */}
        <div className="lg:col-span-7 space-y-6">
          {signal.status === 'Resolved' && signal.resolution_image_url && imagePreview && (
            <Card className="shadow-subtle border-success/30 overflow-hidden">
              <div className="bg-success/10 p-3 border-b border-success/20 text-success text-sm font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Before & After Resolution
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

          {signal.status === 'Resolved' && signal.officer_notes && (
            <Card className="shadow-subtle bg-muted/20">
              <CardContent className="p-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Officer Resolution Summary</h3>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {signal.officer_notes}
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-subtle">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Original Evidence</h3>
              <div className="rounded-xl overflow-hidden border border-border bg-muted h-64 md:h-80 flex">
                <SafeImage src={imagePreview} alt="Evidence" className="w-full h-full object-cover" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardContent className="p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Initial Report Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {signal.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

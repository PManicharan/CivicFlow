import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ServerCrash, SearchX, Globe, MapPin, Building2, Calendar, ArrowRight, ShieldCheck, X, Image as ImageIcon } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Resolves image URLs that the backend may return as relative paths or
 * localhost URLs (from the local-storage fallback) into absolute URLs
 * reachable from the browser in production.
 */
function resolveImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  // Already an absolute http(s) URL pointing somewhere other than localhost
  if (/^https?:\/\//.test(url) && !url.includes('localhost')) return url;
  // Relative path like /uploads/CF-XXXX.jpg
  if (url.startsWith('/')) return `${API_URL}${url}`;
  // Localhost fallback URL – swap origin to the real API host
  if (url.includes('localhost')) {
    try {
      const parsed = new URL(url);
      return `${API_URL}${parsed.pathname}`;
    } catch {
      return url;
    }
  }
  return url;
}

export function CommunityDashboard() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const [selectedSignal, setSelectedSignal] = useState<any>(null);

  useEffect(() => {
    let intervalId: number;
    
    const fetchSignals = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/signals`);
        if (!response.ok) throw new Error('Failed to fetch signals');
        
        const data = await response.json();
        // Deduplicate by signal ID to guard against backend-side duplicates
        const seen = new Set<string>();
        const unique = data.filter((s: any) => {
          if (seen.has(s.id)) return false;
          seen.add(s.id);
          return true;
        });
        setSignals(unique);
        setError(null);
      } catch (err: any) {
        console.error("API Fetch Error:", err);
        setError(err.message || "Failed to load reports. Check network.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSignals();
    intervalId = window.setInterval(fetchSignals, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-error/10 text-error border-error/20';
      case 'urgent': return 'bg-warning/10 text-warning border-warning/20';
      case 'elevated': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'resolved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
      case 'assigned': return 'bg-primary/10 text-primary border-primary/20';
      case 'in progress': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const getHeatmapData = () => {
    const data = new Map();
    const today = new Date();
    today.setHours(0,0,0,0);
    for(let i=27; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      data.set(d.toISOString().split('T')[0], 0);
    }
    signals.forEach(s => {
      try {
        const d = new Date(s.created_at);
        const dateKey = d.toISOString().split('T')[0];
        if (data.has(dateKey)) {
          data.set(dateKey, data.get(dateKey) + 1);
        }
      } catch {
        // Ignore parsing errors
      }
    });
    
    const maxCount = Math.max(...Array.from(data.values()), 1);
    
    return Array.from(data.entries()).map(([date, count]) => ({
      date,
      count,
      intensity: count === 0 ? 0 : Math.max(0.1, count / maxCount)
    }));
  };

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <ServerCrash className="w-12 h-12 text-error mb-2" />
          <h2 className="text-xl font-semibold">Connection Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  const totalCount = signals.length;
  const resolvedCount = signals.filter(s => s.status === 'Resolved').length;
  const resolutionRate = totalCount === 0 ? 0 : Math.round((resolvedCount / totalCount) * 100);

  const heatmapData = getHeatmapData();

  const filteredSignals = signals
    .filter(s => statusFilter === 'All' || s.status === statusFilter)
    .filter(s => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        s.title?.toLowerCase().includes(term) ||
        s.report?.issueType?.toLowerCase().includes(term) ||
        s.location?.toLowerCase().includes(term) ||
        s.report?.priorityLevel?.toLowerCase().includes(term)
      );
    });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in mt-16">
      
      {/* Premium Modal */}
      <AnimatePresence>
        {selectedSignal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setSelectedSignal(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-card border border-border shadow-2xl rounded-xl overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">{selectedSignal.report?.issueType || selectedSignal.title}</h2>
                  <Badge variant="outline" className="text-muted-foreground">#{selectedSignal.id}</Badge>
                </div>
                <button onClick={() => setSelectedSignal(null)} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Image and Details */}
                  <div className="space-y-6">
                    <div className="rounded-xl overflow-hidden border border-border bg-muted aspect-video relative">
                      {resolveImageUrl(selectedSignal.image_url) ? (
                        <img src={resolveImageUrl(selectedSignal.image_url)!} alt="Evidence" className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-muted-foreground flex-col gap-2">
                          <ImageIcon className="w-8 h-8 opacity-50" />
                          <span className="text-sm">No evidence image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Status</div>
                        <Badge variant="outline" className={getStatusColor(selectedSignal.status)}>{selectedSignal.status || 'Open'}</Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Priority</div>
                        <Badge variant="outline" className={getPriorityColor(selectedSignal.report?.priorityLevel)}>{selectedSignal.report?.priorityLevel || 'Routine'}</Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Reported</div>
                        <div className="text-sm font-medium">{formatDate(selectedSignal.created_at)}</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/20 border border-border">
                        <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">Trust Score</div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-success" />
                          <span className="text-sm font-bold text-success">{selectedSignal.report?.trustScore || 85}%</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Description</h3>
                      <p className="text-sm leading-relaxed">{selectedSignal.description}</p>
                    </div>
                  </div>

                  {/* Right Column: Map & AI Summary */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Location Map</h3>
                      <div className="rounded-xl overflow-hidden border border-border h-48 relative">
                        <MapContainer 
                          center={[selectedSignal.latitude || 37.7749, selectedSignal.longitude || -122.4194]} 
                          zoom={15} 
                          scrollWheelZoom={false} 
                          className="w-full h-full z-10"
                        >
                          <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                          <Marker position={[selectedSignal.latitude || 37.7749, selectedSignal.longitude || -122.4194]} />
                        </MapContainer>
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {selectedSignal.location}
                      </div>
                    </div>

                    <Card className="border-primary/20 bg-primary/5 shadow-none">
                      <CardContent className="p-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary mb-2 flex items-center gap-2">
                           AI Summary & Recommendations
                        </h3>
                        <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                          {selectedSignal.ai_analysis?.summary || selectedSignal.report?.summary || "Automated analysis indicates this issue requires standard review procedures. Ensure rapid deployment if hazards are present."}
                        </p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Building2 className="w-4 h-4 text-muted-foreground" />
                          Recommended Dept: <span className="text-primary">{selectedSignal.report?.recommendedDepartment || "General Services"}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Timeline</h3>
                      <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px before:h-full before:w-0.5 before:bg-border">
                        {(selectedSignal.timeline?.length ? selectedSignal.timeline : [{ status: 'Reported', timestamp: selectedSignal.created_at }]).map((event: any, i: number) => (
                          <div key={i} className="relative flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-primary shrink-0 z-10 border-2 border-background" />
                            <div className="text-sm font-medium">{event.status}</div>
                            <div className="text-xs text-muted-foreground ml-auto">{formatDate(event.timestamp)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedSignal(null)} className="active:scale-95 transition-transform">Close</Button>
                <Button onClick={() => { setSelectedSignal(null); navigate(`/track/${selectedSignal.id}`); }} className="active:scale-95 transition-transform">
                  Track Public Link
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Globe className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Community Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-2 ml-14">
            Track civic issues and infrastructure improvements in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="shadow-subtle gap-2 px-3 py-1.5 font-medium flex items-center bg-primary/10 text-primary border-primary/20">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Updates
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <Card className="shadow-subtle lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Total Issues</div>
            <div className="text-3xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle lg:col-span-1">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Issues Resolved</div>
            <div className="text-3xl font-bold text-success">{loading ? <Skeleton className="h-8 w-16" /> : resolvedCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle lg:col-span-2 relative overflow-hidden">
          <CardContent className="p-6 flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4" /> Activity Heatmap (Last 28 Days)
              </h3>
              <div className="grid grid-cols-7 grid-rows-4 gap-1 w-full max-w-[200px]">
                {heatmapData.map((cell, i) => (
                  <div 
                    key={i}
                    title={`${cell.date}: ${cell.count} complaints`}
                    className="aspect-square rounded-[2px] transition-colors duration-300 hover:border hover:border-foreground"
                    style={{ 
                      backgroundColor: cell.count === 0 ? 'var(--muted)' : 'hsl(var(--primary))',
                      opacity: cell.count === 0 ? 0.3 : cell.intensity
                    }}
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 border-l border-border pl-6 flex flex-col justify-center">
              <div className="text-sm font-semibold text-muted-foreground mb-2">Resolution Rate</div>
              <div className="text-3xl font-bold text-primary">{loading ? <Skeleton className="h-8 w-16" /> : `${resolutionRate}%`}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <SearchX className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Title, Location, or Priority..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-background border border-border rounded-lg shadow-sm px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow min-w-[160px]"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Pending Review (Open)</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      <AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="shadow-subtle overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredSignals.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="col-span-full flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-border border-dashed shadow-sm"
          >
            <div className="relative w-32 h-32 mb-6 flex justify-center items-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20"></div>
              <ShieldCheck className="w-16 h-16 text-primary relative z-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">No Active Reports</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Your city currently has no active reports matching your filters. The community is looking great!
            </p>
            <Button size="lg" className="shadow-subtle active:scale-95 transition-transform" onClick={() => navigate('/signal')}>
              Submit a New Signal
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredSignals.map((signal, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.05, 0.3) }}
                key={signal.id}
                className="h-full"
              >
                <Card className="shadow-subtle h-full flex flex-col overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group">
                  <div className="relative h-48 overflow-hidden bg-muted">
                    {resolveImageUrl(signal.image_url) ? (
                      <img 
                        src={resolveImageUrl(signal.image_url)!} 
                        alt="Evidence" 
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge variant="outline" className={`backdrop-blur-md bg-background/80 ${getStatusColor(signal.status || 'Open')}`}>
                        {signal.status || 'Open'}
                      </Badge>
                      <Badge variant="outline" className={`backdrop-blur-md bg-background/80 ${getPriorityColor(signal.report?.priorityLevel)}`}>
                        {signal.report?.priorityLevel || 'Routine'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-success flex items-center gap-1 shadow-sm">
                      <ShieldCheck className="w-3 h-3" /> {signal.report?.trustScore || 85}%
                    </div>
                  </div>
                  
                  <CardContent className="p-5 flex flex-col flex-1">
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                      {signal.report?.issueType || 'General'}
                    </div>
                    <h3 className="text-lg font-bold mb-3 line-clamp-1 group-hover:text-primary transition-colors">
                      {signal.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm text-muted-foreground mb-6 flex-1">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{signal.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 shrink-0" />
                        <span>{formatDate(signal.created_at)}</span>
                      </div>
                    </div>
                    
                    {/* Stylized Static Map Preview */}
                    <div className="w-full h-20 bg-muted/30 rounded-lg border border-border mb-4 relative overflow-hidden flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                      <MapPin className="w-6 h-6 text-primary relative z-10" />
                    </div>

                    <Button 
                      className="w-full justify-between shadow-none active:scale-95 transition-transform" 
                      variant="outline"
                      onClick={() => setSelectedSignal(signal)}
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

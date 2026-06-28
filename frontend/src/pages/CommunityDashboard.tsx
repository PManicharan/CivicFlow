import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ServerCrash, SearchX, Globe } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export function CommunityDashboard() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    let intervalId: number;
    
    const fetchSignals = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/signals`);
        if (!response.ok) throw new Error('Failed to fetch signals');
        
        const data = await response.json();
        setSignals(data);
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

  const handleRowClick = (signal: any) => {
    navigate(`/track/${signal.id}`);
  };

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in mt-16">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Total Issues</div>
            <div className="text-3xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : totalCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Issues Resolved</div>
            <div className="text-3xl font-bold text-success">{loading ? <Skeleton className="h-8 w-16" /> : resolvedCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Resolution Rate</div>
            <div className="text-3xl font-bold text-primary">{loading ? <Skeleton className="h-8 w-16" /> : `${resolutionRate}%`}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SearchX className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by Title, Location, or Priority..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
        <div className="lg:col-span-3">
          <Card className="shadow-subtle border-none">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-medium tracking-wider">Issue Type</th>
                      <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                      <th className="px-6 py-4 font-medium tracking-wider">Location</th>
                      <th className="px-6 py-4 font-medium tracking-wider">Priority</th>
                      <th className="px-6 py-4 font-medium tracking-wider">Reported</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {loading ? (
                        Array.from({ length: 5 }).map((_, i) => (
                          <tr key={`skeleton-${i}`} className="border-b border-border/50">
                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                          </tr>
                        ))
                      ) : signals.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-0 border-b-0">
                            <EmptyState 
                              title="No issues found"
                              description="The community is currently clear of reported civic issues."
                              icon={<SearchX className="w-12 h-12 text-muted-foreground/50" />}
                            />
                          </td>
                        </tr>
                      ) : (
                        signals
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
                          })
                          .map((signal, index) => (
                      <motion.tr 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={signal.id} 
                        onClick={() => handleRowClick(signal)}
                        className="border-b border-border/50 hover:bg-muted/10 transition-colors cursor-pointer group"
                      >
                      <td className="px-6 py-4 font-medium text-foreground group-hover:text-primary transition-colors">
                        {signal.report?.issueType || signal.title}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(signal.status || 'Open')}>
                          {signal.status || 'Open'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {signal.location}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${getPriorityColor(signal.report?.priorityLevel)}`}>
                          {signal.report?.priorityLevel || 'Routine'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {formatDate(signal.created_at)}
                      </td>
                    </motion.tr>
                  ))
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </div>
        <div className="lg:col-span-1">
          <Card className="shadow-subtle h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Heatmap</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Density of reports in the last 7 days.
              </p>
              
              <div className="w-full aspect-square bg-muted/30 rounded-lg border border-border relative overflow-hidden grid grid-cols-4 grid-rows-4 gap-1 p-2">
                 {/* Simulated CSS Heatmap Cells */}
                 {Array.from({ length: 16 }).map((_, i) => {
                   // Randomize some opacity for visual effect (purely stylistic for demo)
                   const intensity = [0.1, 0.4, 0.8, 0.2, 0.6, 0.9, 0.3, 0.5, 0.7, 0.1, 0.2, 0.4, 0.8, 0.3, 0.6, 0.9][i];
                   return (
                     <motion.div 
                       key={i}
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: i * 0.05 }}
                       className="rounded-sm bg-primary"
                       style={{ opacity: intensity }}
                     />
                   )
                 })}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-3">Trending Categories</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Infrastructure</span>
                    <Badge variant="outline">42%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Sanitation</span>
                    <Badge variant="outline">28%</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Traffic</span>
                    <Badge variant="outline">15%</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

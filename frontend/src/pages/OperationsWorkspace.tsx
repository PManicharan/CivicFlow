import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ServerCrash, LayoutDashboard, SearchX } from 'lucide-react';

import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function OperationsWorkspace() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, 'signals'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        data.sort((a: any, b: any) => {
          const timeA = new Date(a.created_at || a.createdAt || 0).getTime();
          const timeB = new Date(b.created_at || b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        setSignals(data);
        setLoading(false);
      }, (err) => {
        console.error("Firestore Error:", err);
        setError("Failed to listen for realtime updates. Check permissions or network.");
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  }, []);

  const handleRowClick = (signal: any) => {
    navigate(`/workspace/investigation/${signal.id}`, {
      state: {
        report: signal.report,
        imagePreview: signal.image_url,
        submittedLocation: signal.location
      }
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-error/10 text-error border-error/20';
      case 'urgent': return 'bg-warning/10 text-warning border-warning/20';
      case 'elevated': return 'bg-primary/10 text-primary border-primary/20';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence?.toLowerCase()) {
      case 'very high': return 'text-success';
      case 'high': return 'text-primary';
      case 'moderate': return 'text-warning';
      case 'low': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success/10 text-success border-success/20';
      case 'rejected': return 'bg-error/10 text-error border-error/20';
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

  // Remove the old full-screen loading state to let it render the skeleton table

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

  const activeCasesCount = signals.filter(s => !['Resolved', 'Rejected'].includes(s.status)).length;
  const pendingReviewCount = signals.filter(s => s.status === 'Open').length;
  const inProgressCount = signals.filter(s => s.status === 'In Progress').length;
  const criticalCount = signals.filter(s => s.report?.priorityLevel === 'Critical').length;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">Mission Control</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-2 ml-14">
            Active civic infrastructure cases requiring operational review.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="shadow-subtle gap-2 px-3 py-1.5 font-medium flex items-center bg-primary/10 text-primary border-primary/20">
            <span className="relative flex h-2 w-2 mr-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Live Connection
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Active Cases</div>
            <div className="text-3xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : activeCasesCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Pending Review</div>
            <div className="text-3xl font-bold text-primary">{loading ? <Skeleton className="h-8 w-16" /> : pendingReviewCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">In Progress</div>
            <div className="text-3xl font-bold text-warning">{loading ? <Skeleton className="h-8 w-16" /> : inProgressCount}</div>
          </CardContent>
        </Card>
        <Card className="shadow-subtle">
          <CardContent className="p-6">
            <div className="text-sm font-semibold text-muted-foreground mb-2">Critical Complaints</div>
            <div className="text-3xl font-bold text-error">{loading ? <Skeleton className="h-8 w-16" /> : criticalCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <SearchX className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            type="text"
            aria-label="Search cases by ID, Department, or Priority"
            placeholder="Search by ID, Department, or Priority..."
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          aria-label="Filter cases by status"
          className="bg-background border border-border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Open">Pending Review (Open)</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <Card className="shadow-subtle border-none">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/30 border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium tracking-wider">Case ID</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Priority</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Department</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Confidence</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Created Time</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {loading ? (
                    Array.from({ length: 5 }).map((_, i) => (
                      <tr key={`skeleton-${i}`} className="border-b border-border/50">
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      </tr>
                    ))
                  ) : signals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-0 border-b-0">
                        <EmptyState 
                          title="No active cases found"
                          description="There are currently no civic issues requiring operational review."
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
                          s.id?.toLowerCase().includes(term) ||
                          s.report?.caseId?.toLowerCase().includes(term) ||
                          s.report?.recommendedDepartment?.toLowerCase().includes(term) ||
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
                        {signal.report?.caseId || signal.id}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={`${getPriorityColor(signal.report?.priorityLevel)}`}>
                          {signal.report?.priorityLevel || 'Routine'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" className={getStatusColor(signal.status || 'Open')}>
                          {signal.status || 'Open'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {signal.report?.recommendedDepartment || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${getConfidenceColor(signal.report?.confidence)}`}>
                          {signal.report?.confidence || 'Unknown'}
                        </span>
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
  );
}

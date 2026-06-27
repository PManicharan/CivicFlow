import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Loader2, ServerCrash, RefreshCw, LayoutDashboard, SearchX } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { motion, AnimatePresence } from 'framer-motion';

export function OperationsWorkspace() {
  const navigate = useNavigate();
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSignals = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/signals`);
      if (!response.ok) {
        throw new Error("Failed to fetch operations data.");
      }
      const data = await response.json();
      setSignals(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleRowClick = (signal: any) => {
    navigate('/investigation', {
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

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p>Syncing Operations Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <ServerCrash className="w-12 h-12 text-error mb-2" />
          <h2 className="text-xl font-semibold">Connection Error</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchSignals} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </Button>
        </div>
      </div>
    );
  }

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
          <Button onClick={fetchSignals} variant="outline" className="shadow-subtle gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh Data
          </Button>
        </div>
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
                  {signals.length === 0 ? (
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
                    signals.map((signal, index) => (
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

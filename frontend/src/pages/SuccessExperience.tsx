import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Clock, FileText, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

export function SuccessExperience() {
  const location = useLocation();
  const state = location.state as { report: any } | null;

  if (!state || !state.report) {
    return <Navigate to="/operations" replace />;
  }

  const { report } = state;
  const trustScore = report.trust_score || 85;
  const caseId = report.id || report.case_id || 'CF-NEW-CASE';

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl min-h-[80vh] flex flex-col justify-center items-center">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 100 }}
        className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mb-8"
      >
        <CheckCircle2 className="w-12 h-12" />
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="text-center mb-10"
      >
        <h1 className="text-4xl font-bold tracking-tight mb-4">Investigation Complete</h1>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Your signal has been successfully processed by the CivicFlow AI Engine and is now available for review by city operations.
        </p>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full grid sm:grid-cols-3 gap-6 mb-12"
      >
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 border-primary/20 bg-primary/5 shadow-subtle hover:shadow-md transition-shadow">
          <ShieldCheck className="w-8 h-8 text-primary mb-2" />
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trust Score</div>
          <div className="text-3xl font-bold text-foreground">{trustScore}%</div>
        </Card>
        
        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 shadow-subtle hover:shadow-md transition-shadow">
          <FileText className="w-8 h-8 text-muted-foreground mb-2" />
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Case ID</div>
          <div className="text-xl font-mono font-semibold text-foreground truncate w-full px-2">{caseId.split('-').slice(0, 2).join('-')}</div>
        </Card>

        <Card className="p-6 flex flex-col items-center justify-center text-center space-y-2 shadow-subtle hover:shadow-md transition-shadow">
          <Clock className="w-8 h-8 text-muted-foreground mb-2" />
          <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Est. Response</div>
          <div className="text-xl font-bold text-foreground">24-48h</div>
        </Card>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Link to={`/track/${caseId}`} className="w-full sm:w-auto">
          <Button size="lg" className="w-full sm:w-auto flex items-center gap-2 shadow-subtle hover:shadow-md transition-all hover:-translate-y-0.5">
            <LayoutDashboard className="w-5 h-5" /> Track Progress
          </Button>
        </Link>
        <Link to="/dashboard" className="w-full sm:w-auto">
          <Button variant="outline" size="lg" className="w-full sm:w-auto flex items-center gap-2 shadow-subtle hover:shadow-md transition-all hover:-translate-y-0.5 bg-background">
            Community Dashboard <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}

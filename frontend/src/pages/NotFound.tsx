import { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ServerCrash, BarChart3, TrendingUp, PieChart, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

export function NotFound() {
  // Using NotFound as the Analytics Page per hackathon requirements (repurposing 404)
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError(err.message || "Failed to load data. Check network.");
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchSignals();
    intervalId = window.setInterval(fetchSignals, 10000); // 10s refresh

    return () => window.clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <ServerCrash className="w-12 h-12 text-error mb-2" />
          <h2 className="text-xl font-semibold">Analytics Unavailable</h2>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
        </div>
      </div>
    );
  }

  // --- KPI Calculations ---
  const totalCount = signals.length;
  const resolvedCount = signals.filter(s => s.status === 'Resolved').length;
  const openCount = totalCount - resolvedCount; // Open, Assigned, In Progress

  // --- Category Distribution ---
  const categoryMap = new Map<string, number>();
  signals.forEach(s => {
    const cat = s.report?.issueType || 'General';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  });
  const categoryData = Array.from(categoryMap.entries())
    .map(([name, count]) => ({ name, count, percent: totalCount > 0 ? (count / totalCount) * 100 : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // top 5

  // --- Priority Distribution ---
  const priorityMap = new Map<string, number>();
  signals.forEach(s => {
    const p = s.report?.priorityLevel || 'Routine';
    priorityMap.set(p, (priorityMap.get(p) || 0) + 1);
  });
  const priorityData = ['Critical', 'Urgent', 'Elevated', 'Routine'].map(p => {
    const count = priorityMap.get(p) || priorityMap.get(p.toLowerCase()) || 0;
    return { name: p, count, percent: totalCount > 0 ? (count / totalCount) * 100 : 0 };
  }).filter(p => p.count > 0);

  // --- Reports Per Day (Last 14 Days) ---
  const getDailyData = () => {
    const data = new Map();
    const today = new Date();
    today.setHours(0,0,0,0);
    for(let i=13; i>=0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      data.set(d.toISOString().split('T')[0], { label, count: 0 });
    }
    signals.forEach(s => {
      try {
        const d = new Date(s.created_at);
        const dateKey = d.toISOString().split('T')[0];
        if (data.has(dateKey)) {
          data.get(dateKey).count++;
        }
      } catch {
        // ignore parse error
      }
    });
    
    const arr = Array.from(data.values());
    const maxCount = Math.max(...arr.map(d => d.count), 1);
    return arr.map(d => ({ ...d, heightPercent: (d.count / maxCount) * 100 }));
  };

  const dailyData = getDailyData();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-fade-in mt-16">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">System Analytics</h1>
          </div>
          <p className="text-muted-foreground text-sm mt-2 ml-14">
            Live metrics and historical data analysis for all reported civic issues.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="default" className="shadow-subtle gap-2 px-3 py-1.5 font-medium flex items-center bg-primary/10 text-primary border-primary/20">
            Real-time Data
          </Badge>
        </div>
      </div>

      <AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               <Skeleton className="h-80 w-full rounded-xl" />
               <Skeleton className="h-80 w-full rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="shadow-subtle border-l-4 border-l-primary hover:-translate-y-1 transition-transform">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2">Total Reports</div>
                      <div className="text-4xl font-bold">{totalCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-subtle border-l-4 border-l-warning hover:-translate-y-1 transition-transform">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2">Open Issues</div>
                      <div className="text-4xl font-bold text-warning">{openCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-subtle border-l-4 border-l-success hover:-translate-y-1 transition-transform">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-muted-foreground mb-2">Resolved</div>
                      <div className="text-4xl font-bold text-success">{resolvedCount}</div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Distribution */}
              <Card className="shadow-subtle hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <PieChart className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Category Distribution</h3>
                  </div>
                  
                  {categoryData.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">No data available</div>
                  ) : (
                    <div className="space-y-5">
                      {categoryData.map((cat, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium">{cat.name}</span>
                            <span className="text-muted-foreground">{cat.count} ({Math.round(cat.percent)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${cat.percent}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                              className="h-full bg-primary rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Priority Distribution */}
              <Card className="shadow-subtle hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 text-muted-foreground" />
                    <h3 className="text-lg font-semibold">Priority Distribution</h3>
                  </div>
                  
                  {priorityData.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">No data available</div>
                  ) : (
                    <div className="space-y-5">
                      {priorityData.map((pri, i) => {
                        let barColor = 'bg-primary';
                        if (pri.name === 'Critical') barColor = 'bg-error';
                        else if (pri.name === 'Urgent') barColor = 'bg-warning';
                        else if (pri.name === 'Elevated') barColor = 'bg-primary';
                        else barColor = 'bg-muted-foreground';

                        return (
                          <div key={i}>
                            <div className="flex justify-between text-sm mb-1.5">
                              <span className="font-medium">{pri.name}</span>
                              <span className="text-muted-foreground">{pri.count} ({Math.round(pri.percent)}%)</span>
                            </div>
                            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${pri.percent}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                                className={`h-full ${barColor} rounded-full`}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

            </div>

            {/* Reports Per Day Chart */}
            <Card className="shadow-subtle hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="w-5 h-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Reports (Last 14 Days)</h3>
                </div>
                
                <div className="h-64 flex items-end justify-between gap-1 sm:gap-2 mt-8 pt-4 border-b border-border relative">
                  {dailyData.map((day, i) => (
                    <div key={i} className="flex flex-col items-center w-full group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-foreground text-background text-xs py-1 px-2 rounded whitespace-nowrap z-10 pointer-events-none">
                        {day.label}: {day.count} reports
                      </div>
                      
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${Math.max(day.heightPercent, 2)}%` }} // min height 2% for visibility
                        transition={{ duration: 0.8, delay: i * 0.05 }}
                        className="w-full max-w-[40px] bg-primary/80 hover:bg-primary rounded-t-sm transition-colors"
                      />
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-2 rotate-45 sm:rotate-0 origin-left mb-4 sm:mb-0">
                        {day.label.split(' ')[1]} {/* just show day number on small screens if needed, or keep full */}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Settings2, Cpu, Activity, Paintbrush, Monitor, Moon, Sun, AlertCircle, Database, Calendar, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { useTheme } from '../components/ThemeProvider';

export function Settings() {
  const { theme, setTheme } = useTheme();
  
  // Real health status from backend
  const [health, setHealth] = useState<any>(null);
  const [isHealthLoading, setIsHealthLoading] = useState(true);



  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/health`);
        const data = await res.json();
        setHealth(data);
      } catch {
        setHealth({ status: 'offline' });
      } finally {
        setIsHealthLoading(false);
      }
    }
    checkHealth();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">System Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences and view system status.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left Column: Preferences */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2">
            <Paintbrush className="w-5 h-5 text-muted-foreground" />
            Appearance
          </div>

          <Card className="p-6 space-y-6">
            <div>
              <h3 className="font-medium mb-1">Theme Preference</h3>
              <p className="text-sm text-muted-foreground mb-4">Select how CivicFlow looks on this device.</p>
              
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setTheme('light')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${theme === 'light' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background'}`}
                >
                  <Sun className={`w-5 h-5 ${theme === 'light' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">Light</span>
                </button>
                <button 
                  onClick={() => setTheme('dark')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background'}`}
                >
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">Dark</span>
                </button>
                <button 
                  onClick={() => setTheme('system')}
                  className={`flex flex-col items-center justify-center gap-2 p-3 rounded-lg border-2 transition-colors ${theme === 'system' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 bg-background'}`}
                >
                  <Monitor className={`w-5 h-5 ${theme === 'system' ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-medium">System</span>
                </button>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2 pt-4">
            <HelpCircle className="w-5 h-5 text-muted-foreground" />
            Support
          </div>

          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  Help Center
                </h3>
                <p className="text-sm text-muted-foreground mt-1">Get help and view documentation.</p>
              </div>
              <Link to="/workspace/support" className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90">
                View Support
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: System Information */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-lg font-medium border-b border-border pb-2">
            <Settings2 className="w-5 h-5 text-muted-foreground" />
            System Overview
          </div>
          
          <Card className="p-0 overflow-hidden">
            <div className="divide-y divide-border">
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium">CivicFlow Version</div>
                  <div className="text-sm text-muted-foreground">Frontend application</div>
                </div>
                <div className="font-mono text-sm px-2.5 py-1 bg-muted rounded-md text-muted-foreground">
                  v1.0.0-rc
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <div className="font-medium">Build Date</div>
                    <div className="text-sm text-muted-foreground">Last deployment</div>
                  </div>
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  June 2026
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <div>
                    <div className="font-medium">Backend Status</div>
                    <div className="text-sm text-muted-foreground">API Connectivity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isHealthLoading ? (
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  ) : health?.status === 'healthy' ? (
                    <>
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </span>
                      <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Online</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-error"></span>
                      <span className="text-sm font-medium text-error">Offline</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="font-medium">Gemini 1.5 Pro</div>
                    <div className="text-sm text-muted-foreground">AI Vision Engine</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isHealthLoading ? (
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  ) : health?.gemini_configured ? (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Ready</span>
                  ) : (
                    <span className="text-sm font-medium text-error">Not Configured</span>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-purple-500" />
                  <div>
                    <div className="font-medium">Firestore</div>
                    <div className="text-sm text-muted-foreground">Database Connectivity</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isHealthLoading ? (
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  ) : health?.firestore_connectivity ? (
                    <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Connected</span>
                  ) : (
                    <span className="text-sm font-medium text-error">Disconnected</span>
                  )}
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="font-medium">Storage Backend</div>
                    <div className="text-sm text-muted-foreground">Media Assets</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isHealthLoading ? (
                    <span className="text-sm text-muted-foreground">Checking...</span>
                  ) : (
                    <span className="text-sm font-medium capitalize text-emerald-600 dark:text-emerald-400">
                      {health?.active_storage_backend || 'Unknown'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-amber-500/20 bg-amber-500/5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-600 dark:text-amber-400/90 leading-relaxed">
              <strong>Admin Access Only.</strong> Advanced configuration, API key rotation, and user management are restricted to the environment configuration files.
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
}

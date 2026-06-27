import { Badge } from '../ui/Badge';
import { AlertTriangle, CheckCircle2, Info, MapPin } from 'lucide-react';

export function ReportPreview() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">
              The AI Investigation Report
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Every signal is instantly analyzed by Gemini. It validates images against text, assesses safety risks, and outputs a structured report. 
              <br/><br/>
              No more manual triaging of vague complaints. CivicFlow gives you the full picture, instantly.
            </p>
          </div>

          <div className="flex-1 w-full max-w-md">
            {/* The Mockup Report */}
            <div className="bg-background rounded-xl border border-border shadow-premium overflow-hidden animate-slide-up">
              <div className="border-b border-border bg-muted/50 px-6 py-4 flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">Report #CF-8921</span>
                <Badge variant="error" className="flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> High Priority</Badge>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Severe Pothole on Main St.</h3>
                  <div className="flex items-center text-sm text-muted-foreground gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>42.3601° N, 71.0589° W</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-sm font-medium">Trust Score</span>
                    <span className="text-sm font-semibold text-success flex items-center gap-1">
                      94% <CheckCircle2 className="w-4 h-4" />
                    </span>
                  </div>
                  
                  <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
                    <div className="flex items-center gap-2 font-medium mb-1">
                      <Info className="w-4 h-4" /> AI Reasoning
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      Image analysis confirms a deep structural failure in the asphalt (est. depth &gt;4 inches). 
                      The damage is located in a high-traffic lane, posing an immediate risk to vehicles. 
                      User description matches visual evidence.
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Badge variant="outline">Department: Public Works</Badge>
                  <Badge variant="outline">Action: Dispatch Patch Crew</Badge>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

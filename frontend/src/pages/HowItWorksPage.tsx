import { Camera, Brain, LayoutDashboard, ArrowRight, ShieldCheck, FileCheck } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function HowItWorksPage() {
  const steps = [
    {
      icon: <Camera className="w-8 h-8 text-blue-500" />,
      title: '1. Community Signal Submission',
      description: 'A community member observes an issue (e.g., hazard, infrastructure damage) and submits a quick report through the CivicFlow interface. They can attach photos or videos and provide a brief text description. Location data is automatically attached if permitted.',
      details: ['Multimodal input (Text, Image, Video)', 'Automatic geolocation tagging', 'Anonymous reporting option']
    },
    {
      icon: <FileCheck className="w-8 h-8 text-indigo-500" />,
      title: '2. Pre-Processing & Validation',
      description: 'Before AI analysis, the platform ensures the integrity of the signal. The system sanitizes the text inputs, scrubs metadata for privacy, and validates image signatures to prevent tampered or malicious media from entering the pipeline.',
      details: ['EXIF data scrubbing', 'Prompt injection shielding', 'Payload signature validation']
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: '3. AI Investigation Engine',
      description: 'The multimodal AI (powered by Google Gemini) processes the text and visual evidence simultaneously. It cross-references the image content against the description, assesses the situation\'s severity, and assigns a Trust Score and Priority Level.',
      details: ['Semantic context extraction', 'Cross-modal consistency checking', 'Severity and urgency classification']
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: '4. Human-in-the-Loop Review',
      description: 'While the AI provides a comprehensive analysis, critical decisions require human oversight. The system generates an explainable reasoning report, allowing operators to review the AI\'s logic, confirm the severity, and adjust priorities if needed.',
      details: ['Explainable AI reasoning logs', 'Manual priority overrides', 'Bias and fairness monitoring']
    },
    {
      icon: <LayoutDashboard className="w-8 h-8 text-orange-500" />,
      title: '5. Authority Action & Operations',
      description: 'The validated, structured intelligence report is routed to the Operations Workspace. Authorities can view a consolidated dashboard of incidents, track trends, and dispatch resources efficiently to resolve the issue.',
      details: ['Real-time operations dashboard', 'Automated departmental routing', 'End-to-end audit trails']
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">How CivicFlow Works</h1>
        <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          A transparent, end-to-end pipeline that transforms raw, unstructured community reports into verified, actionable intelligence for public safety officials.
        </p>
      </div>

      <div className="relative">
        {/* Connecting Line for Desktop */}
        <div className="hidden md:block absolute left-[39px] top-8 bottom-8 w-px bg-border" />
        
        <div className="space-y-12">
          {steps.map((step, index) => (
            <div key={index} className="relative flex flex-col md:flex-row gap-6 md:gap-8">
              <div className="flex items-center justify-center shrink-0 w-20 h-20 rounded-full bg-background border-2 border-border shadow-sm z-10 mx-auto md:mx-0">
                {step.icon}
              </div>
              
              <Card className="flex-1 p-6 md:p-8 space-y-4">
                <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                
                <div className="pt-4 border-t border-border/50">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" /> Key Processes
                  </h4>
                  <ul className="grid sm:grid-cols-2 gap-2">
                    {step.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

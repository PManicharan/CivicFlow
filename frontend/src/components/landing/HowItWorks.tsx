import { Camera, Brain, LayoutDashboard } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: <Camera className="w-6 h-6" />,
      title: '1. Capture',
      description: 'Citizens submit a community signal with a photo, location, and brief description of the issue.',
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: '2. Investigate',
      description: 'Our AI engine analyzes the evidence, extracts context, and assigns a Trust Score and Priority.',
    },
    {
      icon: <LayoutDashboard className="w-6 h-6" />,
      title: '3. Resolve',
      description: 'Authorities receive a structured, actionable report ready for immediate operational decisions.',
    },
  ];

  return (
    <section className="py-24 border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">How it works</h2>
          <p className="text-muted-foreground text-lg">A seamless pipeline from street-level signal to desk-level decision.</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-background border border-border shadow-subtle flex items-center justify-center text-foreground">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

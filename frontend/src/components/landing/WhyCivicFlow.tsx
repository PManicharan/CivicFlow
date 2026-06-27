import { motion } from 'framer-motion';
import { X, Check } from 'lucide-react';

export function WhyCivicFlow() {
  const traditional = [
    "Complaint submitted manually",
    "Awaiting manual human review",
    "No algorithmic prioritization",
    "Generic status updates",
    "Lacks contextual data"
  ];

  const civicflow = [
    "Instant AI Investigation",
    "Explainable reasoning & logic",
    "Cryptographic Trust Score",
    "Department recommendation",
    "Action-ready intelligent case"
  ];

  return (
    <section className="py-24 bg-muted/20 border-y border-border">
      <div className="container mx-auto px-4 lg:px-8 max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-4">Why CivicFlow?</h2>
          <p className="text-muted-foreground text-lg">Replacing bureaucratic friction with actionable intelligence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Traditional */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium text-muted-foreground/60 border-b border-border/50 pb-4">Traditional Reporting</h3>
            <ul className="space-y-6">
              {traditional.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 opacity-50">
                    <X className="w-4 h-4" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CivicFlow */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-medium text-foreground border-b border-border pb-4">The CivicFlow Standard</h3>
            <ul className="space-y-6">
              {civicflow.map((item, i) => (
                <li key={i} className="flex items-center gap-4 text-foreground">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
                    <Check className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

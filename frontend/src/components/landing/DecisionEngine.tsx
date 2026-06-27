import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function DecisionEngine() {
  const nodes = [
    { label: "Community Signal", sub: "Image & Text Ingestion" },
    { label: "Gemini AI", sub: "Multimodal Analysis", highlight: true },
    { label: "AI Investigation Case", sub: "Structured JSON Output" },
    { label: "Trust Score", sub: "Cryptographic Verification" },
    { label: "Department Recommendation", sub: "Automated Routing" },
    { label: "Ready for Action", sub: "Operational Dispatch" }
  ];

  return (
    <section id="decision-engine" className="py-24">
      <div className="container mx-auto px-4 max-w-4xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground mb-16">The AI Decision Engine</h2>
        
        <div className="flex flex-col items-center">
          {nodes.map((node, index) => (
            <div key={index} className="flex flex-col items-center w-full">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`w-full max-w-sm p-5 rounded-xl border ${node.highlight ? 'bg-primary/5 border-primary shadow-subtle' : 'bg-background border-border'} relative z-10`}
              >
                <div className={`font-semibold text-lg ${node.highlight ? 'text-primary' : 'text-foreground'}`}>
                  {node.label}
                </div>
                <div className="text-sm text-muted-foreground mt-1 font-medium tracking-wide uppercase">
                  {node.sub}
                </div>
              </motion.div>
              
              {index < nodes.length - 1 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  whileInView={{ opacity: 1, height: 40 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                  className="w-px bg-border my-2 flex items-center justify-center relative"
                >
                  <ArrowDown className="w-3 h-3 text-muted-foreground absolute -bottom-3 bg-background" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

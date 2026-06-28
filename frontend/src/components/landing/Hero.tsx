import { Button } from '../ui/Button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Camera, BrainCircuit, ShieldCheck, CheckCircle2, FileSearch } from 'lucide-react';

export function Hero() {
  const steps = [
    { icon: <Camera className="w-4 h-4" />, text: "Evidence Uploaded" },
    { icon: <BrainCircuit className="w-4 h-4" />, text: "AI Vision Analysis" },
    { icon: <FileSearch className="w-4 h-4" />, text: "Risk Assessment" },
    { icon: <ShieldCheck className="w-4 h-4" />, text: "Trust Score Generated" },
    { icon: <CheckCircle2 className="w-4 h-4" />, text: "Investigation Complete" },
  ];

  return (
    <section className="relative overflow-hidden pt-24 pb-32 flex flex-col items-center justify-center text-center">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="space-y-8 max-w-4xl px-4 relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
            From Community Signals to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60 block mt-2">Smarter Decisions.</span>
          </h1>
        </motion.div>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light"
        >
          CivicFlow transforms local issues into structured AI intelligence for faster prioritization and resolution.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link to="/signal" className="w-full sm:w-auto">
            <Button size="lg" className="w-full shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
              <span className="relative z-10">Start AI Investigation</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </Button>
          </Link>
          <a href="#decision-engine" className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full hover:bg-muted/50 transition-colors">
              Explore the Engine
            </Button>
          </a>
        </motion.div>
      </motion.div>

      {/* Floating Animated Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 w-full max-w-3xl px-4"
      >
        <div className="relative p-1 rounded-2xl bg-gradient-to-b from-border/50 to-transparent">
          <div className="bg-background/80 backdrop-blur-xl border border-border shadow-2xl rounded-xl p-8 flex flex-col md:flex-row items-center justify-between gap-4 overflow-hidden relative">
            
            {/* Shimmer Effect */}
            <motion.div 
              className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-primary/5 to-transparent -z-10"
              animate={{ x: ['-100%', '50%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            />

            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center gap-3 relative z-10 w-full">
                <motion.div 
                  initial={{ opacity: 0.3, scale: 0.8 }}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    delay: index * 0.6,
                    ease: "easeInOut"
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${index === 4 ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground border border-border'}`}
                >
                  {step.icon}
                </motion.div>
                <span className="text-xs font-medium text-muted-foreground text-center max-w-[80px]">
                  {step.text}
                </span>
                
                {/* Connector Line (except last) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-1/2 w-full h-[1px] bg-border -z-10" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}

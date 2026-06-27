import { Shield, Lock, FileKey2, Network, EyeOff } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Security() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-10">
      
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Security Overview</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Security and privacy are foundational to CivicFlow. We employ defense-in-depth strategies to protect municipal infrastructure and citizen data.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <Lock className="w-5 h-5 text-primary" /> Data Encryption
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            All data transmitted between the frontend, backend, and Gemini AI Engine is encrypted in transit using TLS 1.3. Data at rest in Firestore is encrypted automatically using AES-256.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <EyeOff className="w-5 h-5 text-primary" /> Metadata Scrubbing
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Photographic evidence submitted by citizens is automatically scrubbed of EXIF metadata (including device identifiers and hidden timestamps) prior to long-term storage or AI analysis.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <Network className="w-5 h-5 text-primary" /> Architecture Isolation
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The frontend application never communicates directly with the database or the Gemini API. All requests are routed through a hardened FastAPI backend layer that validates and sanitizes inputs.
          </p>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <FileKey2 className="w-5 h-5 text-primary" /> Secret Management
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            API keys and Firebase credentials are injected strictly at runtime via environment variables. The source code does not contain any hardcoded secrets.
          </p>
        </Card>

      </div>

      <div className="mt-12 p-6 bg-error/5 border border-error/20 rounded-2xl text-center">
        <h2 className="text-xl font-semibold mb-2">Vulnerability Reporting</h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-6">
          If you are a security researcher and have discovered a vulnerability in CivicFlow, please disclose it responsibly so we can resolve it quickly.
        </p>
        <a href="mailto:security@civicflow.io" className="text-primary font-medium hover:underline">
          security@civicflow.io
        </a>
      </div>

    </div>
  );
}

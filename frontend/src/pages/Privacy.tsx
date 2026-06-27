import { FileText, Shield, UserCheck, Database, Bell } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
      
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-lg text-muted-foreground">
          Last updated: June 2026. We are committed to protecting your personal information and your right to privacy.
        </p>
      </div>

      <Card className="p-8 space-y-8 border-none bg-muted/10">
        
        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" /> 1. Information We Collect
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            CivicFlow is designed to minimize data collection. When you submit a community signal, we collect the geographic coordinates of the issue, the photographic evidence you provide, and any textual context you enter. 
            We do <strong>not</strong> require user registration or collect personally identifiable information (PII) such as your name, email, or phone number unless you explicitly opt-in for notifications.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" /> 2. How We Use Your Information
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            The data collected is strictly used to inform municipal operations. The images and locations are processed by our AI Decision Engine (Gemini 1.5 Pro) to categorize and prioritize civic issues. 
            Aggregated, anonymized data may be used by the city for urban planning and resource allocation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" /> 3. Data Protection & EXIF Scrubbing
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            To ensure your privacy, CivicFlow automatically scrubs all EXIF metadata from uploaded photographs before they are permanently stored in our databases. We employ industry-standard encryption in transit (HTTPS) and at rest (Firestore AES-256).
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" /> 4. AI Processing
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            Photographic evidence is transmitted securely to Google's Gemini API for analysis. We have configured our API agreements such that your submitted images are <strong>not</strong> used to train Google's foundational AI models.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" /> 5. Contact Us
          </h2>
          <p className="text-muted-foreground leading-relaxed text-sm">
            If you have questions or comments about this notice, you may email our Data Protection Officer at privacy@civicflow.io.
          </p>
        </section>

      </Card>
    </div>
  );
}

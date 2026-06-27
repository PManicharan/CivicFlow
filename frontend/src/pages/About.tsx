import { Info, Code2, Server, Brain, Shield, HeartHandshake, GitBranch, Terminal } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function About() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-12">
      
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">About CivicFlow</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Empowering communities and municipalities with AI-driven civic issue detection and automated triage.
        </p>
      </div>

      {/* Vision */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <HeartHandshake className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Project Vision</h2>
        </div>
        <Card className="p-6 text-muted-foreground leading-relaxed">
          CivicFlow was built to bridge the communication gap between citizens and city operations. By allowing citizens to easily capture and report civic infrastructure issues (like potholes, broken streetlights, or graffiti) and using advanced AI to automatically analyze, categorize, and prioritize these reports, CivicFlow drastically reduces municipal response times and operational overhead.
        </Card>
      </div>

      {/* Tech Stack Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Frontend Architecture */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Terminal className="w-5 h-5 text-blue-500" />
            <h3 className="text-xl font-semibold">Frontend Architecture</h3>
          </div>
          <Card className="p-6 h-full bg-muted/10">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Framework:</strong> React 18 + Vite</li>
              <li><strong className="text-foreground">Styling:</strong> Tailwind CSS + CSS Variables</li>
              <li><strong className="text-foreground">Routing:</strong> React Router DOM v6</li>
              <li><strong className="text-foreground">Animations:</strong> Framer Motion</li>
              <li><strong className="text-foreground">Icons:</strong> Lucide React</li>
              <li><strong className="text-foreground">Mapping:</strong> Leaflet + OpenStreetMap</li>
            </ul>
          </Card>
        </div>

        {/* Backend & AI */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Server className="w-5 h-5 text-emerald-500" />
            <h3 className="text-xl font-semibold">Backend & AI Pipeline</h3>
          </div>
          <Card className="p-6 h-full bg-muted/10">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><strong className="text-foreground">Server:</strong> Python FastAPI</li>
              <li><strong className="text-foreground">Database:</strong> Firebase Firestore</li>
              <li><strong className="text-foreground">Storage:</strong> Local FS / Firebase Storage fallback</li>
              <li><strong className="text-foreground">AI Vision Engine:</strong> Google Gemini 1.5 Pro</li>
              <li><strong className="text-foreground">Processing:</strong> Synchronous AI image inference with structured JSON output</li>
            </ul>
          </Card>
        </div>
      </div>

      {/* AI Pipeline Details */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Brain className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-semibold tracking-tight">AI Decision Engine</h2>
        </div>
        <Card className="p-6">
          <p className="text-muted-foreground mb-4">
            The core of CivicFlow is its integration with <strong>Gemini 1.5 Pro</strong>. When a citizen uploads an image, the backend prompts Gemini to act as a municipal inspector. It analyzes the visual evidence and outputs a strict JSON schema that includes:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
            <li><strong>Severity & Priority:</strong> Determines if the issue is Routine, Elevated, Urgent, or Critical.</li>
            <li><strong>Confidence Score:</strong> Calculates how confident the AI is in its assessment based on image clarity.</li>
            <li><strong>Recommended Department:</strong> Automatically routes the ticket to Public Works, Sanitation, Transportation, etc.</li>
            <li><strong>Trust Score Algorithm:</strong> Generates a trustworthiness percentage based on metadata consistency and visual anomalies.</li>
          </ul>
        </Card>
      </div>

      {/* Footer Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-border">
        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><Code2 className="w-4 h-4"/> Developer</h4>
          <p className="text-sm text-muted-foreground">Pendem Manicharan</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><GitBranch className="w-4 h-4"/> Version</h4>
          <p className="text-sm text-muted-foreground">v1.0.0-rc (Release Candidate)</p>
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><Shield className="w-4 h-4"/> License</h4>
          <p className="text-sm text-muted-foreground">MIT License</p>
        </div>
      </div>

    </div>
  );
}

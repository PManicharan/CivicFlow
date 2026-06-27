import { Terminal, Settings2, Cpu, Cloud, GitPullRequest } from 'lucide-react';
import { Card } from '../components/ui/Card';

export function Documentation() {
  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-10">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Technical guides and API references for deploying and integrating CivicFlow.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <Terminal className="w-8 h-8 text-primary mb-4" />
          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">Getting Started</h3>
          <p className="text-sm text-muted-foreground">Learn how to clone, install dependencies, and run CivicFlow locally for development.</p>
        </Card>

        <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <Settings2 className="w-8 h-8 text-blue-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-500 transition-colors">Environment Variables</h3>
          <p className="text-sm text-muted-foreground">Configure your Google Gemini API key and Firebase service accounts securely.</p>
        </Card>

        <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <Cpu className="w-8 h-8 text-purple-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-500 transition-colors">AI Prompt Engineering</h3>
          <p className="text-sm text-muted-foreground">Understand the exact prompt structure used to force structured JSON from the Gemini API.</p>
        </Card>

        <Card className="p-6 hover:border-primary/50 transition-colors cursor-pointer group">
          <Cloud className="w-8 h-8 text-emerald-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-500 transition-colors">Production Deployment</h3>
          <p className="text-sm text-muted-foreground">Best practices for deploying the FastAPI backend and Vite frontend to production environments.</p>
        </Card>
      </div>

      <div className="mt-12 bg-muted/20 p-8 rounded-2xl border border-border">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <GitPullRequest className="w-6 h-6 text-primary" /> API Integration
        </h2>
        <p className="text-muted-foreground mb-6 text-sm">
          CivicFlow exposes a RESTful API built on FastAPI. Below is an example of creating a new signal via `curl`.
        </p>
        <div className="bg-[#1e1e1e] rounded-lg p-4 font-mono text-sm overflow-x-auto text-gray-300">
          <pre><code>
{`curl -X POST "https://api.civicflow.io/api/signals" \\
  -H "accept: application/json" \\
  -H "Content-Type: multipart/form-data" \\
  -F "title=Large Pothole" \\
  -F "description=Deep pothole on Main St causing traffic delays" \\
  -F "location=123 Main St" \\
  -F "image=@/path/to/evidence.jpg"`}
          </code></pre>
        </div>
      </div>

    </div>
  );
}

import { HelpCircle, Mail, Code2, FileText, Bug, ExternalLink, ChevronDown } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

import { toast } from 'sonner';

export function Support() {
  const faqs = [
    {
      question: "How does the AI determine the severity of a signal?",
      answer: "The AI model (Gemini 1.5 Pro) evaluates the provided text description alongside any attached visual evidence. It extracts context, identifies hazards, and cross-references this against standard emergency severity matrices to recommend a classification."
    },
    {
      question: "Can I remain anonymous when reporting?",
      answer: "Yes, CivicFlow supports anonymous reporting. We automatically scrub PII and EXIF metadata from uploaded media to protect user privacy."
    },
    {
      question: "What happens if the AI misclassifies an event?",
      answer: "CivicFlow operates on a human-in-the-loop principle. The AI provides a recommendation and explainable reasoning, but final confirmation and operational dispatch are always reviewed by a human operator."
    },
    {
      question: "Is the platform available for my municipality?",
      answer: "Currently, CivicFlow is in active development. We are open-sourcing the core platform so that any municipality can deploy their own instance."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-12">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-4">Support & Resources</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Need help navigating CivicFlow? Find answers to common questions, read our documentation, or get in touch with the community.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 flex flex-col space-y-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium">Documentation</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Read the full architectural overview, deployment guides, and API documentation for integrating CivicFlow.
          </p>
          <Button variant="outline" className="w-full justify-between group shadow-subtle hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => window.open('https://github.com/PManicharan/CivicFlow#readme', '_blank')}>
            Read Docs <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </Card>

        <Card className="p-6 flex flex-col space-y-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium">GitHub Repository</h3>
          <p className="text-sm text-muted-foreground flex-1">
            CivicFlow is open source. Check out the code, contribute to the project, or fork it for your own use.
          </p>
          <Button variant="outline" className="w-full justify-between group shadow-subtle hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => window.open('https://github.com/PManicharan/CivicFlow', '_blank')}>
            View on GitHub <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </Card>

        <Card className="p-6 flex flex-col space-y-4">
          <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-500">
            <Bug className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium">Report an Issue</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Found a bug or have a feature request? Let us know on our issue tracker so we can improve the platform.
          </p>
          <Button variant="outline" className="w-full justify-between group" onClick={() => window.open('https://github.com/PManicharan/CivicFlow/issues', '_blank')}>
            Open Issue <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </Card>

        <Card className="p-6 flex flex-col space-y-4">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-medium">Contact Us</h3>
          <p className="text-sm text-muted-foreground flex-1">
            Have questions about enterprise deployment, custom integrations, or partnerships? Reach out directly.
          </p>
          <Button variant="outline" className="w-full justify-between group shadow-subtle hover:shadow-md hover:-translate-y-0.5 transition-all" onClick={() => toast.success("Thanks for reaching out! A representative will contact you shortly.")}>
            support@civicflow.io <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </Button>
        </Card>
      </div>

      <div className="space-y-6 pt-8 border-t border-border">
        <div className="flex items-center gap-3 mb-6">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <details key={idx} className="group bg-muted/20 border border-border rounded-lg overflow-hidden [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/40 transition-colors font-medium">
                {faq.question}
                <ChevronDown className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform duration-200" />
              </summary>
              <div className="p-4 pt-0 text-muted-foreground leading-relaxed border-t border-border/50 mt-2">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}

import { Upload, FileText, AlertTriangle, Bug, Sparkles, GitBranch, TestTube, BarChart3, Download, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/store/documentStore";
import { useRef } from "react";

const SAMPLE_CONTENT = `# Software Requirements Specification

## Functional Requirements
### FR-001: User Authentication
The system shall provide secure authentication using OAuth 2.0.

### FR-002: Data Export
The system should allow users to export data in multiple formats.

### FR-003: Dashboard
The system shall display real-time analytics on the main dashboard.

## Non-functional Requirements
### NFR-001: Performance
The system should be fast and responsive.

### NFR-002: Scalability
The system must handle a large number of users.

### NFR-003: Security
All data must be encrypted at rest and in transit.

## Constraints
### C-001: Technology Stack
The system must use React and Node.js.

## Assumptions
### A-001: Internet Connectivity
Users will have stable internet.`;

interface PageContext {
  icon: any;
  title: string;
  tagline: string;
  description: string;
  examples?: string[];
  accentColor: string;
  iconBg: string;
}

const PAGE_CONTEXTS: Record<string, PageContext> = {
  'SRS Parser': {
    icon: FileText,
    title: 'SRS Parser',
    tagline: 'Drop your SRS to extract clean structure',
    description: 'We convert your document into structured, navigable Markdown — separating functional requirements, constraints, assumptions, and more.',
    examples: ['Collapsible section view', 'Confidence scoring per section', 'Automatic structure detection'],
    accentColor: 'text-primary',
    iconBg: 'gradient-primary glow-primary',
  },
  'Ambiguity Detector': {
    icon: AlertTriangle,
    title: 'Ambiguity Detector',
    tagline: 'Find vague and unclear requirements',
    description: 'We detect subjective and unmeasurable language that leads to misinterpretation during development.',
    examples: ['"fast" — no measurable threshold', '"user-friendly" — subjective UX term', '"secure" — undefined security scope'],
    accentColor: 'text-warning',
    iconBg: 'bg-warning/15',
  },
  'Defect Analyzer': {
    icon: Bug,
    title: 'Defect Analyzer',
    tagline: 'Scan for logical and structural defects',
    description: 'We identify conflicting requirements, version mismatches, dependency gaps, and logical inconsistencies across your specification.',
    examples: ['Conflicting authentication & encryption specs', 'Missing dependency chains', 'Undefined performance thresholds'],
    accentColor: 'text-destructive',
    iconBg: 'bg-destructive/15',
  },
  'SRS Enhancer': {
    icon: Sparkles,
    title: 'SRS Enhancer',
    tagline: 'Transform vague specs into engineering-ready requirements',
    description: 'We rewrite ambiguous requirements with measurable constraints, clearer wording, and structured formatting.',
    examples: ['Add quantitative thresholds', 'Specify user roles and permissions', 'Include edge-case handling'],
    accentColor: 'text-accent',
    iconBg: 'bg-accent/15',
  },
  'Traceability Map': {
    icon: GitBranch,
    title: 'Traceability Map',
    tagline: 'Map requirements end-to-end',
    description: 'Visualize how each requirement connects to features, implementation modules, and test cases.',
    accentColor: 'text-primary',
    iconBg: 'bg-primary/15',
  },
  'Test Case Generator': {
    icon: TestTube,
    title: 'Test Case Generator',
    tagline: 'Auto-generate test scenarios from requirements',
    description: 'We create functional, edge-case, and negative test scenarios with inputs, expected outputs, and priority levels.',
    examples: ['Functional validation tests', 'Edge-case boundary tests', 'Negative / security tests'],
    accentColor: 'text-success',
    iconBg: 'bg-success/15',
  },
  'Clarity Breakdown': {
    icon: BarChart3,
    title: 'Clarity Breakdown',
    tagline: 'Quantify your document quality',
    description: 'Get detailed metrics on ambiguity percentage, completeness coverage, consistency scoring, and defect density.',
    accentColor: 'text-primary',
    iconBg: 'gradient-primary glow-primary',
  },
  'Export Center': {
    icon: Download,
    title: 'Export Center',
    tagline: 'Download your analysis artifacts',
    description: 'Export clean Markdown, improved SRS, and generated test cases as downloadable files.',
    accentColor: 'text-primary',
    iconBg: 'bg-primary/15',
  },
  'Ask Your SRS': {
    icon: MessageSquare,
    title: 'Ask Your SRS',
    tagline: 'Chat with your parsed document',
    description: 'Ask natural language questions about your requirements — find missing specs, list constraints, or discover inconsistencies.',
    examples: ['"What are missing requirements?"', '"List all constraints"', '"Where are inconsistencies?"'],
    accentColor: 'text-accent',
    iconBg: 'bg-accent/15',
  },
};

const DEFAULT_CONTEXT: PageContext = {
  icon: FileText,
  title: 'SRS Clarity',
  tagline: 'Upload a document to begin',
  description: 'Upload an SRS document or import a Markdown file to begin analysis.',
  accentColor: 'text-primary',
  iconBg: 'gradient-primary glow-primary',
};

export function EmptyState({ title }: { title: string }) {
  const { loadDocument } = useDocumentStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const mdRef = useRef<HTMLInputElement>(null);

  const ctx = PAGE_CONTEXTS[title] || DEFAULT_CONTEXT;
  const Icon = ctx.icon;

  const handleDemo = () => loadDocument('demo-srs.md', SAMPLE_CONTENT, 'markdown');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadDocument(file.name, SAMPLE_CONTENT, 'pdf');
  };

  const handleMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => loadDocument(file.name, ev.target?.result as string, 'markdown');
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-slide-in">
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${ctx.iconBg}`}>
        <Icon className={`w-8 h-8 ${ctx.iconBg.includes('gradient') ? 'text-primary-foreground' : ctx.accentColor}`} />
      </div>

      <h2 className="text-xl font-semibold mb-1">{ctx.title}</h2>
      <p className={`text-sm font-medium mb-3 ${ctx.accentColor}`}>{ctx.tagline}</p>
      <p className="text-muted-foreground text-sm mb-6 max-w-lg leading-relaxed">{ctx.description}</p>

      {ctx.examples && (
        <div className="flex flex-wrap gap-2 mb-6 max-w-md justify-center">
          {ctx.examples.map((ex, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-muted/20 border border-border text-muted-foreground">
              {ex}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button onClick={handleDemo} className="gap-2 gradient-primary border-0">
          Load Demo SRS
        </Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
          <Upload className="w-4 h-4" /> Upload
        </Button>
        <Button variant="outline" onClick={() => mdRef.current?.click()} className="gap-2">
          <FileText className="w-4 h-4" /> Import .MD
        </Button>
      </div>
      <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
      <input ref={mdRef} type="file" accept=".md" className="hidden" onChange={handleMd} />
    </div>
  );
}

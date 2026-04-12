import { useDocumentStore } from "@/store/documentStore";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Shield, AlertTriangle, Bug, CheckCircle, TrendingUp, XCircle, Upload, FileText, ArrowRight, Zap, GitBranch, TestTube, Sparkles, Play } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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

### C-002: Browser Support
Support for Chrome, Firefox, Safari, Edge.

## Assumptions
### A-001: Internet Connectivity
Users will have stable internet.

### A-002: Modern Browsers
Users will use browsers released within the last 2 years.`;

const PIPELINE_STEPS = [
  { icon: Upload, label: "Upload", desc: "PDF / DOCX / MD" },
  { icon: FileText, label: "Parse", desc: "Structure extraction" },
  { icon: Zap, label: "Analyze", desc: "Detect issues" },
  { icon: Sparkles, label: "Improve", desc: "Generate fixes" },
  { icon: ArrowRight, label: "Export", desc: "Clean artifacts" },
];

const CAPABILITIES = [
  { icon: AlertTriangle, title: "Ambiguity Detection", desc: "Flag vague terms like \"fast\", \"scalable\", \"user-friendly\" with suggested rewrites", color: "text-warning bg-warning/10" },
  { icon: Bug, title: "Defect Analysis", desc: "Find conflicting requirements, dependency gaps, and logical inconsistencies", color: "text-destructive bg-destructive/10" },
  { icon: Sparkles, title: "Requirement Enhancement", desc: "Transform vague specs into measurable, engineering-ready requirements", color: "text-accent bg-accent/10" },
  { icon: GitBranch, title: "Traceability Mapping", desc: "Map requirements to features, modules, and test cases end-to-end", color: "text-primary bg-primary/10" },
  { icon: TestTube, title: "Test Generation", desc: "Auto-generate functional, edge-case, and negative test scenarios", color: "text-success bg-success/10" },
  { icon: Shield, title: "Clarity Scoring", desc: "Quantify document quality with ambiguity, completeness, and consistency metrics", color: "text-primary bg-primary/10" },
];

function MetricCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <div className="glass-card p-5 animate-slide-in">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="text-3xl font-bold">{value}</div>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}

function LandingView() {
  const { loadDocument } = useDocumentStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const mdRef = useRef<HTMLInputElement>(null);

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
    <div className="space-y-12 animate-slide-in">
      {/* Hero */}
      <div className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-6">
          <Zap className="w-3 h-3" /> Requirements Intelligence Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">SRS Clarity</span>
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
          Most SRS documents fail due to ambiguity, missing constraints, and inconsistent definitions.
          SRS Clarity identifies and improves these issues automatically.
        </p>
      </div>

      {/* Pipeline */}
      <div className="glass-card p-6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6 text-center">How It Works</h3>
        <div className="flex items-center justify-between max-w-3xl mx-auto">
          {PIPELINE_STEPS.map((step, i) => (
            <div key={step.label} className="flex items-center gap-0">
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${i === 0 ? 'gradient-primary glow-primary' : 'bg-muted/20 border border-border'}`}>
                  <step.icon className={`w-5 h-5 ${i === 0 ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold">{step.label}</p>
                  <p className="text-[10px] text-muted-foreground">{step.desc}</p>
                </div>
              </div>
              {i < PIPELINE_STEPS.length - 1 && (
                <div className="w-8 md:w-16 h-px bg-border mx-1 md:mx-3 mb-8" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Demo CTA */}
      <div className="glass-card p-8 text-center border-primary/20 glow-primary">
        <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary">
          <Play className="w-6 h-6 text-primary-foreground ml-0.5" />
        </div>
        <h2 className="text-xl font-bold mb-2">Try It Instantly</h2>
        <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
          Load a sample SRS document to see ambiguity detection, defect analysis, and improvement suggestions in action.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={handleDemo} className="gap-2 gradient-primary border-0 px-6">
            <Play className="w-4 h-4" /> Load Demo SRS
          </Button>
          <Button variant="outline" onClick={() => fileRef.current?.click()} className="gap-2">
            <Upload className="w-4 h-4" /> Upload File
          </Button>
          <Button variant="outline" onClick={() => mdRef.current?.click()} className="gap-2">
            <FileText className="w-4 h-4" /> Import .MD
          </Button>
        </div>
        <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
        <input ref={mdRef} type="file" accept=".md" className="hidden" onChange={handleMd} />
      </div>

      {/* Capabilities */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 text-center">Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAPABILITIES.map(cap => (
            <div key={cap.title} className="glass-card p-5 group hover:border-primary/30 transition-colors">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cap.color}`}>
                <cap.icon className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{cap.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{cap.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AnalysisView() {
  const { metrics, defects, ambiguities, missingSections } = useDocumentStore();

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Requirements intelligence overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={Shield} label="Clarity Score" value={metrics?.clarityScore ?? 0} sub="out of 100" color="bg-primary/15 text-primary" />
        <MetricCard icon={AlertTriangle} label="Ambiguity Score" value={`${metrics?.ambiguityPercent ?? 0}%`} sub={`${ambiguities.length} issues found`} color="bg-warning/15 text-warning" />
        <MetricCard icon={Bug} label="Defect Count" value={defects.length} sub="across requirements" color="bg-destructive/15 text-destructive" />
        <MetricCard icon={CheckCircle} label="Completeness" value={`${metrics?.completenessPercent ?? 0}%`} sub="sections covered" color="bg-success/15 text-success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-destructive" /> Top Issues</h3>
          <div className="space-y-3">
            {ambiguities.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <SeverityBadge severity={a.severity} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{a.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><XCircle className="w-4 h-4 text-warning" /> Sections Missing</h3>
          {missingSections.length === 0 ? (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm">
              <CheckCircle className="w-4 h-4" /> All sections present
            </div>
          ) : (
            <div className="space-y-2">
              {missingSections.map(s => (
                <div key={s} className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 text-warning text-sm">
                  <AlertTriangle className="w-3.5 h-3.5" /> {s}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="glass-card p-5">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Bug className="w-4 h-4 text-destructive" /> Critical Risks</h3>
          <div className="space-y-3">
            {defects.filter(d => d.severity === 'critical' || d.severity === 'high').map(d => (
              <div key={d.id} className="flex items-start gap-3 p-3 rounded-lg bg-background/50">
                <SeverityBadge severity={d.severity} />
                <div>
                  <p className="text-sm font-medium">{d.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{d.requirements.join(', ')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">Quality Breakdown</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Clarity', value: metrics?.clarityScore ?? 0 },
            { label: 'Completeness', value: metrics?.completenessPercent ?? 0 },
            { label: 'Consistency', value: metrics?.consistencyPercent ?? 0 },
            { label: 'Low Ambiguity', value: 100 - (metrics?.ambiguityPercent ?? 0) },
          ].map(m => (
            <div key={m.label}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">{m.label}</span>
                <span className="font-medium">{m.value}%</span>
              </div>
              <Progress value={m.value} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { analysisMode } = useDocumentStore();
  return analysisMode === 'NONE' ? <LandingView /> : <AnalysisView />;
}

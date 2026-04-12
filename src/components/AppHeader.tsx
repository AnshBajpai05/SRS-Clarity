import { Upload, FileText, RefreshCw, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
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

### C-002: Browser Support
Support for Chrome, Firefox, Safari, Edge.

## Assumptions
### A-001: Internet Connectivity
Users will have stable internet.

### A-002: Modern Browsers
Users will use browsers released within the last 2 years.`;

export function AppHeader() {
  const { fileName, analysisMode, sourceType, structureConfidence, loadDocument, reparse } = useDocumentStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const mdRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    loadDocument(file.name, SAMPLE_CONTENT, 'pdf');
  };

  const handleMd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      loadDocument(file.name, ev.target?.result as string, 'markdown');
    };
    reader.readAsText(file);
  };

  const isLoaded = analysisMode !== 'NONE';

  const modeColor = analysisMode === 'FULL' ? 'text-success'
    : analysisMode === 'PARTIAL' ? 'text-warning'
    : analysisMode === 'UNPROCESSED' ? 'text-destructive'
    : 'text-muted-foreground';

  const dotColor = analysisMode === 'FULL' ? 'fill-success text-success'
    : analysisMode === 'PARTIAL' ? 'fill-warning text-warning'
    : analysisMode === 'UNPROCESSED' ? 'fill-destructive text-destructive'
    : 'fill-muted-foreground text-muted-foreground';

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="h-6 w-px bg-border" />
        {isLoaded && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5 text-xs">
              <Upload className="w-3.5 h-3.5" /> Upload
            </Button>
            <Button variant="outline" size="sm" onClick={() => mdRef.current?.click()} className="gap-1.5 text-xs">
              <FileText className="w-3.5 h-3.5" /> Import .MD
            </Button>
            <Button variant="ghost" size="sm" onClick={reparse} className="gap-1.5 text-xs text-muted-foreground">
              <RefreshCw className="w-3.5 h-3.5" /> Re-Parse
            </Button>
          </div>
        )}
        <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
        <input ref={mdRef} type="file" accept=".md" className="hidden" onChange={handleMd} />
      </div>

      {/* System Status Panel */}
      <div className="flex items-center gap-4">
        {isLoaded ? (
          <>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Document:</span>
                <span className="text-foreground font-medium">{fileName}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <span className="text-muted-foreground">Source:</span>
                <span className="text-foreground">{sourceType === 'pdf' ? 'Parsed PDF' : 'Markdown'}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1.5">
                <Circle className={`w-2 h-2 ${dotColor}`} />
                <span className="text-muted-foreground">Mode:</span>
                <span className={`font-semibold ${modeColor}`}>{analysisMode}</span>
              </div>
              {structureConfidence && (
                <>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className={`font-medium ${structureConfidence === 'HIGH' ? 'text-success' : structureConfidence === 'MEDIUM' ? 'text-warning' : 'text-destructive'}`}>
                      {structureConfidence}
                    </span>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-muted-foreground text-muted-foreground" />
              <span>No Document</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>Mode: Idle</span>
            <div className="h-4 w-px bg-border" />
            <span>Capabilities: Inactive</span>
          </div>
        )}
      </div>
    </header>
  );
}

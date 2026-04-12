import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { SeverityBadge, CategoryBadge } from "@/components/SeverityBadge";
import { TestTube } from "lucide-react";

export default function TestsPage() {
  const { analysisMode, testCases } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Test Case Generator" />;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Test Case Generator</h1>
        <p className="text-muted-foreground text-sm">{testCases.length} test cases generated</p>
      </div>

      <div className="space-y-4">
        {testCases.map(tc => (
          <div key={tc.id} className="glass-card p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <TestTube className="w-4 h-4 text-primary" />
                <span className="font-semibold text-sm">{tc.title}</span>
              </div>
              <div className="flex gap-2">
                <CategoryBadge category={tc.type} />
                <SeverityBadge severity={tc.priority} />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Requirement:</span>
              <span className="font-mono text-primary">{tc.requirement}</span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-background/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Input</span>
                <p className="text-sm">{tc.input}</p>
              </div>
              <div className="p-3 rounded-lg bg-background/50">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-1">Expected Output</span>
                <p className="text-sm">{tc.expectedOutput}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

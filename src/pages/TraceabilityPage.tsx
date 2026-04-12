import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { ArrowRight } from "lucide-react";

export default function TraceabilityPage() {
  const { analysisMode, traceability } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Traceability Map" />;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Traceability Map</h1>
        <p className="text-muted-foreground text-sm">Requirement → Feature → Module → Test Case</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="grid grid-cols-4 gap-0 p-3 border-b border-border bg-muted/10 text-xs font-medium text-muted-foreground uppercase tracking-wider">
          <span>Requirement</span><span>Feature</span><span>Module</span><span>Test Case</span>
        </div>
        {traceability.map((t, i) => (
          <div key={i} className="grid grid-cols-4 gap-0 p-3 border-b border-border/30 hover:bg-muted/5 transition-colors items-center">
            <span className="font-mono text-sm text-primary">{t.requirement}</span>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-sm">{t.feature}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="text-sm">{t.module}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="w-3 h-3 text-muted-foreground shrink-0" />
              <span className="font-mono text-sm text-accent">{t.testCase}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

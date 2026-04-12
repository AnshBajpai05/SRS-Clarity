import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { SeverityBadge, CategoryBadge } from "@/components/SeverityBadge";
import { Bug, GitBranch } from "lucide-react";

export default function DefectsPage() {
  const { analysisMode, defects } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Defect Analyzer" />;

  const grouped = {
    critical: defects.filter(d => d.severity === 'critical'),
    high: defects.filter(d => d.severity === 'high'),
    medium: defects.filter(d => d.severity === 'medium'),
    low: defects.filter(d => d.severity === 'low'),
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Defect Analyzer</h1>
        <p className="text-muted-foreground text-sm">{defects.length} defects identified</p>
      </div>

      {Object.entries(grouped).filter(([, items]) => items.length > 0).map(([severity, items]) => (
        <div key={severity} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <SeverityBadge severity={severity} />
            <span>{items.length} {severity} {items.length === 1 ? 'issue' : 'issues'}</span>
          </h2>
          {items.map(d => (
            <div key={d.id} className="glass-card p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Bug className="w-4 h-4 text-destructive" />
                  <span className="font-semibold">{d.title}</span>
                </div>
                <CategoryBadge category={d.type} />
              </div>

              <p className="text-sm text-muted-foreground">{d.description}</p>

              <div className="p-3 rounded-lg bg-background/50 space-y-2">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Root Cause</span>
                <p className="text-sm">{d.rootCause}</p>
              </div>

              <div className="flex items-center gap-2">
                <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Affected:</span>
                {d.requirements.map(r => (
                  <span key={r} className="text-xs font-mono px-2 py-0.5 rounded bg-primary/10 text-primary">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

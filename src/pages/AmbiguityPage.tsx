import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { SeverityBadge, CategoryBadge } from "@/components/SeverityBadge";
import { Lightbulb, AlertTriangle } from "lucide-react";

export default function AmbiguityPage() {
  const { analysisMode, ambiguities } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Ambiguity Detector" />;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Ambiguity Detector</h1>
        <p className="text-muted-foreground text-sm">{ambiguities.length} ambiguous requirements detected</p>
      </div>

      <div className="space-y-4">
        {ambiguities.map(a => (
          <div key={a.id} className="glass-card p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="font-mono text-sm text-muted-foreground">{a.id}</span>
              </div>
              <div className="flex gap-2">
                <CategoryBadge category={a.category} />
                <SeverityBadge severity={a.severity} />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-warning/5 border border-warning/20">
              <p className="text-sm italic">"{a.text}"</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Why flagged</span>
              </div>
              <p className="text-sm text-muted-foreground">{a.explanation}</p>
            </div>

            <div className="p-3 rounded-lg bg-success/5 border border-success/20">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-medium text-success">Suggested Rewrite</span>
              </div>
              <p className="text-sm">{a.suggestedRewrite}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

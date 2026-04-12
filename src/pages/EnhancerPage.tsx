import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { ArrowRight, TrendingUp, Check } from "lucide-react";

export default function EnhancerPage() {
  const { analysisMode, enhancements } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="SRS Enhancer" />;

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">SRS Enhancer</h1>
        <p className="text-muted-foreground text-sm">Side-by-side improvement suggestions</p>
      </div>

      <div className="space-y-4">
        {enhancements.map(e => (
          <div key={e.id} className="glass-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-muted-foreground">{e.id}</span>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-semibold text-success">Impact: {e.impactScore}/100</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-destructive/5 border border-destructive/20">
                <span className="text-xs font-medium text-destructive uppercase tracking-wider mb-2 block">Original</span>
                <p className="text-sm">{e.original}</p>
              </div>
              <div className="p-4 rounded-lg bg-success/5 border border-success/20 relative">
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 hidden lg:block">
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="text-xs font-medium text-success uppercase tracking-wider mb-2 block">Improved</span>
                <p className="text-sm">{e.improved}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {e.changes.map((c, i) => (
                <span key={i} className="flex items-center gap-1 text-xs text-muted-foreground bg-muted/30 px-2 py-1 rounded-full">
                  <Check className="w-3 h-3 text-success" /> {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

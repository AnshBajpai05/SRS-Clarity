import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { Progress } from "@/components/ui/progress";

export default function ClarityPage() {
  const { analysisMode, metrics } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Clarity Breakdown" />;
  if (!metrics) return null;

  const items = [
    { label: 'Ambiguity', value: metrics.ambiguityPercent, desc: 'Percentage of requirements with ambiguous language', color: 'text-warning' },
    { label: 'Completeness', value: metrics.completenessPercent, desc: 'Coverage of expected SRS sections', color: 'text-success' },
    { label: 'Consistency', value: metrics.consistencyPercent, desc: 'Cross-requirement consistency and coherence', color: 'text-primary' },
    { label: 'Defect Density', value: Math.round(metrics.defectDensity * 100), desc: 'Defects per requirement ratio', color: 'text-destructive' },
  ];

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Clarity Breakdown</h1>
        <p className="text-muted-foreground text-sm">Detailed quality metrics analysis</p>
      </div>

      <div className="glass-card p-8 flex flex-col items-center">
        <div className="relative w-40 h-40">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none" stroke="url(#gradient)" strokeWidth="3"
              strokeDasharray={`${metrics.clarityScore}, 100`}
              strokeLinecap="round" />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold gradient-text">{metrics.clarityScore}</span>
            <span className="text-xs text-muted-foreground">Clarity Score</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(item => (
          <div key={item.label} className="glass-card p-5">
            <div className="flex justify-between mb-2">
              <span className="font-semibold text-sm">{item.label}</span>
              <span className={`font-bold ${item.color}`}>{item.value}%</span>
            </div>
            <Progress value={item.value} className="h-2 mb-2" />
            <p className="text-xs text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

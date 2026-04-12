import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { Download, FileText, TestTube, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExportPage() {
  const { analysisMode, fileName } = useDocumentStore();

  if (analysisMode === 'NONE') return <EmptyState title="Export Center" />;

  const exports = [
    { icon: FileText, label: 'clean.md', desc: 'Parsed and structured SRS in Markdown format', format: 'Markdown' },
    { icon: Sparkles, label: 'improved-srs.md', desc: 'Enhanced SRS with all improvements applied', format: 'Markdown' },
    { icon: TestTube, label: 'test-cases.md', desc: 'Generated test cases with inputs and expected outputs', format: 'Markdown' },
  ];

  const handleExport = (label: string) => {
    const blob = new Blob([`# ${label}\n\nExported from SRS Clarity\nSource: ${fileName}`], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = label;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold">Export Center</h1>
        <p className="text-muted-foreground text-sm">Download analysis artifacts</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {exports.map(e => (
          <div key={e.label} className="glass-card p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
              <e.icon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{e.label}</h3>
              <p className="text-xs text-muted-foreground mt-1">{e.desc}</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => handleExport(e.label)}>
              <Download className="w-3.5 h-3.5" /> Download
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

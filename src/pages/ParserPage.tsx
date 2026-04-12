import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function ParserPage() {
  const { analysisMode, sections, structureConfidence } = useDocumentStore();
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  if (analysisMode === 'NONE') return <EmptyState title="SRS Parser" />;

  const toggle = (title: string) => setOpenSections(p => ({ ...p, [title]: !p[title] }));

  const confColor = structureConfidence === 'HIGH' ? 'bg-success/15 text-success border-success/30'
    : structureConfidence === 'MEDIUM' ? 'bg-warning/15 text-warning border-warning/30'
    : 'bg-destructive/15 text-destructive border-destructive/30';

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">SRS Parser</h1>
          <p className="text-muted-foreground text-sm">Structured document view</p>
        </div>
        <Badge variant="outline" className={`${confColor}`}>
          Structure Confidence: {structureConfidence}
        </Badge>
      </div>

      <div className="space-y-3">
        {sections.map(section => (
          <Collapsible key={section.title} open={openSections[section.title] ?? true} onOpenChange={() => toggle(section.title)}>
            <div className="glass-card overflow-hidden">
              <CollapsibleTrigger className="w-full flex items-center justify-between p-4 hover:bg-muted/10 transition-colors">
                <div className="flex items-center gap-3">
                  <ChevronRight className={`w-4 h-4 transition-transform ${openSections[section.title] !== false ? 'rotate-90' : ''}`} />
                  <h3 className="font-semibold">{section.title}</h3>
                </div>
                <Badge variant="outline" className={`text-xs ${section.confidence === 'HIGH' ? 'text-success border-success/30' : section.confidence === 'MEDIUM' ? 'text-warning border-warning/30' : 'text-destructive border-destructive/30'}`}>
                  {section.confidence}
                </Badge>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 border-t border-border/50">
                  <pre className="text-sm text-foreground/80 whitespace-pre-wrap font-mono leading-relaxed mt-3">{section.content}</pre>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}

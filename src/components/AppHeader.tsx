import { Upload, FileText, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useDocumentStore } from "@/store/documentStore";
import { useRef } from "react";

export function AppHeader() {
  const { currentDocId, intelligence, isLoading, uploadProgress, uploadPdf } = useDocumentStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadPdf(file);
    // Reset input so same file can be re-uploaded
    e.target.value = '';
  };

  const isLoaded = !!currentDocId && !!intelligence;

  return (
    <header className="h-14 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-sm px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="h-6 w-px bg-border" />
        <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} className="gap-1.5 text-xs" disabled={isLoading}>
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
          Upload PDF
        </Button>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={handleUpload} />
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 text-xs">
        {uploadProgress && (
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>{uploadProgress}</span>
          </div>
        )}
        {isLoaded && !uploadProgress && (
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Circle className="w-2 h-2 fill-success text-success" />
              <span className="font-medium text-foreground">{intelligence.document_name}</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <span>{intelligence.user_stories.length} stories</span>
            <div className="h-4 w-px bg-border" />
            <span>{intelligence.actors.join(', ')}</span>
          </div>
        )}
        {!isLoaded && !uploadProgress && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Circle className="w-2 h-2 fill-muted-foreground text-muted-foreground" />
            <span>No Document</span>
          </div>
        )}
      </div>
    </header>
  );
}

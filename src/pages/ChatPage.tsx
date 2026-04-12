import { useDocumentStore } from "@/store/documentStore";
import { EmptyState } from "@/components/EmptyState";
import { useState } from "react";
import { Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const MOCK_RESPONSES: Record<string, string> = {
  'default': "Based on the parsed SRS document, I can help you understand the requirements structure. Try asking about specific sections, missing requirements, or inconsistencies.",
  'missing': "The following sections need attention:\n\n1. **Performance metrics** — NFR-001 lacks quantitative thresholds\n2. **Scalability limits** — NFR-002 doesn't define capacity\n3. **Error handling** — No requirements for error states\n4. **Accessibility** — No WCAG compliance requirements found",
  'constraint': "The document defines 2 constraints:\n\n1. **C-001: Technology Stack** — Must use React and Node.js\n2. **C-002: Browser Support** — Chrome, Firefox, Safari, Edge\n\nNote: No version constraints specified for any technology.",
  'inconsisten': "Found 3 inconsistencies:\n\n1. **FR-001 vs NFR-003** — OAuth 2.0 authentication may conflict with custom encryption requirements\n2. **NFR-001 vs NFR-002** — Performance and scalability targets are undefined and potentially conflicting\n3. **FR-003 depends on FR-002** — Dashboard requires export data pipeline, but no integration requirement exists",
};

export default function ChatPage() {
  const { analysisMode } = useDocumentStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');

  if (analysisMode === 'NONE') return <EmptyState title="Ask Your SRS" />;

  const getResponse = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('missing')) return MOCK_RESPONSES['missing'];
    if (q.includes('constraint') || q.includes('list')) return MOCK_RESPONSES['constraint'];
    if (q.includes('inconsisten') || q.includes('conflict')) return MOCK_RESPONSES['inconsisten'];
    return MOCK_RESPONSES['default'];
  };

  const send = () => {
    if (!input.trim()) return;
    const userMsg: Message = { role: 'user', content: input };
    const assistantMsg: Message = { role: 'assistant', content: getResponse(input) };
    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-slide-in">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Ask Your SRS</h1>
        <p className="text-muted-foreground text-sm">Chat with your parsed document</p>
      </div>

      <div className="flex-1 glass-card p-4 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
            <Bot className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm">Ask questions about your SRS document</p>
            <div className="flex flex-wrap gap-2 mt-4 max-w-md">
              {['What are missing requirements?', 'List all constraints', 'Where are inconsistencies?'].map(q => (
                <button key={q} onClick={() => { setInput(q); }} className="text-xs px-3 py-1.5 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
            {m.role === 'assistant' && (
              <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            )}
            <div className={`max-w-[70%] p-3 rounded-xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-primary/20 text-foreground' : 'bg-muted/20'}`}>
              {m.content}
            </div>
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about your SRS document..."
          className="bg-card border-border"
        />
        <Button onClick={send} className="gradient-primary border-0 shrink-0">
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

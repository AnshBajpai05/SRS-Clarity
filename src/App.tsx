import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import Dashboard from "./pages/Dashboard";
import DocumentViewer from "./pages/DocumentViewer";
import { WorkspacePage } from "./pages/WorkspacePage";
import NotFound from "./pages/NotFound";
import { ErrorBoundary } from "./components/ErrorBoundary";

const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isWorkspace = location.pathname === '/issues';
  
  return (
    <SidebarProvider>
      <div className="h-screen flex w-full overflow-hidden bg-slate-950">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {!isWorkspace && <AppHeader />}
          <main className={`flex-1 ${isWorkspace ? 'overflow-hidden' : 'p-6 overflow-auto'}`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/viewer" element={<DocumentViewer />} />
              <Route path="/issues" element={<WorkspacePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ErrorBoundary>
          <AppContent />
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

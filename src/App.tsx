import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import Dashboard from "./pages/Dashboard";
import ParserPage from "./pages/ParserPage";
import AmbiguityPage from "./pages/AmbiguityPage";
import DefectsPage from "./pages/DefectsPage";
import EnhancerPage from "./pages/EnhancerPage";
import TraceabilityPage from "./pages/TraceabilityPage";
import TestsPage from "./pages/TestsPage";
import ClarityPage from "./pages/ClarityPage";
import ExportPage from "./pages/ExportPage";
import ChatPage from "./pages/ChatPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <div className="flex-1 flex flex-col min-w-0">
              <AppHeader />
              <main className="flex-1 p-6 overflow-auto">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/parser" element={<ParserPage />} />
                  <Route path="/ambiguity" element={<AmbiguityPage />} />
                  <Route path="/defects" element={<DefectsPage />} />
                  <Route path="/enhancer" element={<EnhancerPage />} />
                  <Route path="/traceability" element={<TraceabilityPage />} />
                  <Route path="/tests" element={<TestsPage />} />
                  <Route path="/clarity" element={<ClarityPage />} />
                  <Route path="/export" element={<ExportPage />} />
                  <Route path="/chat" element={<ChatPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
            </div>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

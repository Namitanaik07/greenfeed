import { Toaster }        from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider }   from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route }     from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index      from "./pages/Index";
import Home       from "./pages/Home";
import Dashboard  from "./pages/Dashboard";
import HeatmapPage from "./pages/HeatmapPage";
import NotFound   from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";
import Footer     from "@/components/sections/Footer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              <Routes>
                <Route path="/"          element={<Index />} />
                <Route path="/home"      element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/heatmap"   element={<HeatmapPage />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="*"          element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TranslationProvider } from "./contexts/TranslationContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CropAdvisory from "./pages/CropAdvisory";
import Signup from "./pages/Signup";
          <Route path="/signup" element={<Signup />} />
import SoilHealth from "./pages/SoilHealth";
import MarketPrices from "./pages/MarketPrices";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TranslationProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <Routes>
                 <Route path="/" element={<Index />} />
                 <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/crop-advisory" element={<CropAdvisory />} />
          <Route path="/soil-health" element={<SoilHealth />} />
          <Route path="/market-prices" element={<MarketPrices />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </TranslationProvider>
  </QueryClientProvider>
);

export default App;

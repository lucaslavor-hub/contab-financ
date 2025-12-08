import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialPlanProvider } from "@/contexts/FinancialPlanContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Carteira from "./pages/Carteira";
import Estrategias from "./pages/Estrategias";
import Projecoes from "./pages/Projecoes";
import Cronograma from "./pages/Cronograma";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FinancialPlanProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/carteira" element={<Carteira />} />
              <Route path="/estrategias" element={<Estrategias />} />
              <Route path="/projecoes" element={<Projecoes />} />
              <Route path="/cronograma" element={<Cronograma />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </FinancialPlanProvider>
  </QueryClientProvider>
);

export default App;

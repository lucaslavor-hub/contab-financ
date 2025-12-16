import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Carteiras from "./pages/Carteiras";
import Transacoes from "./pages/Transacoes";
import Dividas from "./pages/Dividas";
import Metas from "./pages/Metas";
import Cronograma from "./pages/Cronograma";
import Insights from "./pages/Insights";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <FinancialDataProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <DashboardLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/carteiras" element={<Carteiras />} />
              <Route path="/transacoes" element={<Transacoes />} />
              <Route path="/dividas" element={<Dividas />} />
              <Route path="/metas" element={<Metas />} />
              <Route path="/cronograma" element={<Cronograma />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/configuracoes" element={<Configuracoes />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </DashboardLayout>
        </BrowserRouter>
      </TooltipProvider>
    </FinancialDataProvider>
  </QueryClientProvider>
);

export default App;

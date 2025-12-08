import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FinancialPlanConfig, defaultFinancialPlanConfig } from '@/config/financialPlanConfig';

interface FinancialPlanContextType {
  config: FinancialPlanConfig;
  updateConfig: (newConfig: Partial<FinancialPlanConfig>) => void;
  resetConfig: () => void;
}

const FinancialPlanContext = createContext<FinancialPlanContextType | undefined>(undefined);

export function FinancialPlanProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<FinancialPlanConfig>(defaultFinancialPlanConfig);

  const updateConfig = (newConfig: Partial<FinancialPlanConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig,
      persona: { ...prev.persona, ...newConfig.persona },
      renda: { ...prev.renda, ...newConfig.renda },
      despesas: { ...prev.despesas, ...newConfig.despesas },
      contas: { ...prev.contas, ...newConfig.contas },
      dividas: { ...prev.dividas, ...newConfig.dividas },
      reservaEmergencia: { ...prev.reservaEmergencia, ...newConfig.reservaEmergencia },
      investimentos: { ...prev.investimentos, ...newConfig.investimentos },
      objetivosEspecificos: { ...prev.objetivosEspecificos, ...newConfig.objetivosEspecificos },
      comportamento: { ...prev.comportamento, ...newConfig.comportamento },
      fundoCompensacao: { ...prev.fundoCompensacao, ...newConfig.fundoCompensacao },
    }));
  };

  const resetConfig = () => {
    setConfig(defaultFinancialPlanConfig);
  };

  return (
    <FinancialPlanContext.Provider value={{ config, updateConfig, resetConfig }}>
      {children}
    </FinancialPlanContext.Provider>
  );
}

export function useFinancialPlan() {
  const context = useContext(FinancialPlanContext);
  if (context === undefined) {
    throw new Error('useFinancialPlan must be used within a FinancialPlanProvider');
  }
  return context;
}

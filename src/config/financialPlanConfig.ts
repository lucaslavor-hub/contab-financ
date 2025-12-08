export interface FinancialPlanConfig {
  persona: {
    nome: string;
    idade: number;
    profissao: string;
  };
  renda: {
    rendaMinima: number;
    rendaMaxima: number;
    rendaMedia: number;
    rendaAlvoProLabore: number;
  };
  despesas: {
    despesasMensaisTotais: number;
    percentualEssenciais: number;
    percentualLazer: number;
    percentualInvestimentos: number;
  };
  contas: {
    contaPF: number;
    contaPJ: number;
    investimentosEspeculativos: number;
  };
  dividas: {
    cartaoPF: number;
    cartaoPJ: number;
    prazoQuitarDividasMeses: number;
  };
  reservaEmergencia: {
    metaTotal: number;
    aporteMensal: number;
    percentualTesouroSelic: number;
    percentualContaRemunerada: number;
    mesesEstimadosConclusao: number;
  };
  investimentos: {
    rendaFixaPercent: number;
    acoesPercent: number;
    fiisPercent: number;
    previdenciaPercent: number;
    rentabilidadeAnualEstimativa: number;
  };
  objetivosEspecificos: {
    aporteMensalIntercambio: number;
    rentabilidadeIntercambio: number;
    prazoIntercambioAnos: number;
    patrimonioIntercambioEstimado: number;
    aporteMensalIndependencia: number;
    rentabilidadeIndependencia: number;
    prazoIndependenciaAnos: number;
    patrimonioIndependenciaMin: number;
    patrimonioIndependenciaMax: number;
    rendaPassivaEstimativa: number;
  };
  comportamento: {
    valorRegraTresDias: number;
    diasReflexaoCompras: number;
    minutosRevisaoMensal: number;
  };
  fundoCompensacao: {
    rendaMediaReferencia: number;
    percentualAcimaMedia: number;
  };
}

export const defaultFinancialPlanConfig: FinancialPlanConfig = {
  persona: {
    nome: "Lucas Mendes",
    idade: 26,
    profissao: "Desenvolvedor full-stack freelancer",
  },
  renda: {
    rendaMinima: 3000,
    rendaMaxima: 10000,
    rendaMedia: 6000,
    rendaAlvoProLabore: 4000,
  },
  despesas: {
    despesasMensaisTotais: 3650,
    percentualEssenciais: 50,
    percentualLazer: 30,
    percentualInvestimentos: 20,
  },
  contas: {
    contaPF: 800,
    contaPJ: 2500,
    investimentosEspeculativos: 1500,
  },
  dividas: {
    cartaoPF: 500,
    cartaoPJ: 1000,
    prazoQuitarDividasMeses: 3,
  },
  reservaEmergencia: {
    metaTotal: 21900,
    aporteMensal: 1825,
    percentualTesouroSelic: 70,
    percentualContaRemunerada: 30,
    mesesEstimadosConclusao: 12,
  },
  investimentos: {
    rendaFixaPercent: 60,
    acoesPercent: 20,
    fiisPercent: 10,
    previdenciaPercent: 10,
    rentabilidadeAnualEstimativa: 10,
  },
  objetivosEspecificos: {
    aporteMensalIntercambio: 1000,
    rentabilidadeIntercambio: 10,
    prazoIntercambioAnos: 3,
    patrimonioIntercambioEstimado: 41000,
    aporteMensalIndependencia: 1500,
    rentabilidadeIndependencia: 10,
    prazoIndependenciaAnos: 20,
    patrimonioIndependenciaMin: 1100000,
    patrimonioIndependenciaMax: 1300000,
    rendaPassivaEstimativa: 5000,
  },
  comportamento: {
    valorRegraTresDias: 500,
    diasReflexaoCompras: 3,
    minutosRevisaoMensal: 15,
  },
  fundoCompensacao: {
    rendaMediaReferencia: 6000,
    percentualAcimaMedia: 20,
  },
};

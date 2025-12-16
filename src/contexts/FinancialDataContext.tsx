import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { 
  Carteira, 
  Transacao, 
  Divida, 
  Meta, 
  ConfiguracaoUsuario,
  AcaoOrigem 
} from '@/types/financial';

// Dados mockados iniciais
const carteirasIniciais: Carteira[] = [
  { id: 'pessoal', nome: 'Conta Pessoal', tipo: 'pessoal', saldo: 800, cor: 'bg-blue-500', icone: 'Wallet' },
  { id: 'profissional', nome: 'Conta Profissional', tipo: 'profissional', saldo: 2500, cor: 'bg-purple-500', icone: 'Building2' },
  { id: 'reserva', nome: 'Reserva de Emergência', tipo: 'reserva', saldo: 6500, cor: 'bg-green-500', icone: 'PiggyBank' },
  { id: 'investimentos', nome: 'Carteira de Investimentos', tipo: 'investimento', saldo: 15000, cor: 'bg-amber-500', icone: 'TrendingUp' },
];

const transacoesIniciais: Transacao[] = [
  {
    id: '1',
    data: new Date().toISOString(),
    descricao: 'Projeto freelance - Cliente A',
    valor: 3500,
    tipo: 'entrada',
    categoria: 'Freelance',
    carteiraDestinoId: 'profissional',
    acaoOrigem: 'receber_pagamento'
  },
  {
    id: '2',
    data: new Date(Date.now() - 86400000).toISOString(),
    descricao: 'Pró-labore mensal',
    valor: 4000,
    tipo: 'transferencia',
    categoria: 'Pró-labore',
    carteiraOrigemId: 'profissional',
    carteiraDestinoId: 'pessoal',
    acaoOrigem: 'pagar_prolabore'
  },
  {
    id: '3',
    data: new Date(Date.now() - 172800000).toISOString(),
    descricao: 'Aporte Reserva de Emergência',
    valor: 1825,
    tipo: 'transferencia',
    categoria: 'Reserva',
    carteiraOrigemId: 'pessoal',
    carteiraDestinoId: 'reserva',
    acaoOrigem: 'aportar_meta',
    metaId: 'reserva-emergencia'
  },
  {
    id: '4',
    data: new Date(Date.now() - 259200000).toISOString(),
    descricao: 'Aluguel',
    valor: 1500,
    tipo: 'saida',
    categoria: 'Moradia',
    carteiraOrigemId: 'pessoal',
    acaoOrigem: 'pagar_despesa'
  },
  {
    id: '5',
    data: new Date(Date.now() - 345600000).toISOString(),
    descricao: 'Pagamento Cartão PF',
    valor: 250,
    tipo: 'saida',
    categoria: 'Pagamento Dívida',
    carteiraOrigemId: 'pessoal',
    acaoOrigem: 'pagar_divida',
    dividaId: 'cartao-pf'
  },
];

const dividasIniciais: Divida[] = [
  {
    id: 'cartao-pf',
    nome: 'Cartão de Crédito PF',
    valorTotal: 500,
    saldoRestante: 250,
    carteiraAssociadaId: 'pessoal',
    status: 'ativa',
    dataCriacao: new Date(Date.now() - 2592000000).toISOString()
  },
  {
    id: 'cartao-pj',
    nome: 'Cartão de Crédito PJ',
    valorTotal: 1000,
    saldoRestante: 1000,
    carteiraAssociadaId: 'profissional',
    status: 'ativa',
    dataCriacao: new Date(Date.now() - 2592000000).toISOString()
  }
];

const metasIniciais: Meta[] = [
  {
    id: 'reserva-emergencia',
    nome: 'Reserva de Emergência',
    valorAlvo: 21900,
    valorAcumulado: 6500,
    prioridade: 1,
    ehReservaEmergencia: true,
    carteiraDestinoId: 'reserva',
    dataCriacao: new Date(Date.now() - 5184000000).toISOString()
  },
  {
    id: 'intercambio',
    nome: 'Intercâmbio / Produto Digital',
    valorAlvo: 41000,
    valorAcumulado: 5000,
    prioridade: 2,
    ehReservaEmergencia: false,
    carteiraDestinoId: 'investimentos',
    dataCriacao: new Date(Date.now() - 2592000000).toISOString()
  },
  {
    id: 'independencia',
    nome: 'Independência Financeira',
    valorAlvo: 1200000,
    valorAcumulado: 10000,
    prioridade: 3,
    ehReservaEmergencia: false,
    carteiraDestinoId: 'investimentos',
    dataCriacao: new Date(Date.now() - 2592000000).toISOString()
  }
];

const configuracaoInicial: ConfiguracaoUsuario = {
  persona: {
    nome: 'Lucas Mendes',
    idade: 26,
    profissao: 'Desenvolvedor Full-stack Freelancer'
  },
  tipoRenda: 'variavel',
  proLaboreAlvo: 4000,
  percentuais: {
    essenciais: 50,
    lazer: 30,
    investimentos: 20
  }
};

interface FinancialDataContextType {
  // Estado
  carteiras: Carteira[];
  transacoes: Transacao[];
  dividas: Divida[];
  metas: Meta[];
  configuracao: ConfiguracaoUsuario;
  
  // Ações de alto nível
  receberPagamento: (valor: number, carteiraId: string, descricao: string, categoria?: string) => void;
  pagarProLabore: (valor: number, carteiraOrigemId: string, carteiraDestinoId: string) => void;
  pagarDespesa: (valor: number, carteiraId: string, categoria: string, descricao: string) => void;
  aportarMeta: (valor: number, carteiraOrigemId: string, metaId: string) => void;
  pagarDivida: (valor: number, carteiraOrigemId: string, dividaId: string) => void;
  usarReservaEmergencia: (valor: number, descricao: string) => void;
  
  // CRUD básico
  adicionarCarteira: (carteira: Omit<Carteira, 'id'>) => void;
  adicionarDivida: (divida: Omit<Divida, 'id' | 'dataCriacao'>) => void;
  adicionarMeta: (meta: Omit<Meta, 'id' | 'dataCriacao'>) => void;
  atualizarConfiguracao: (config: Partial<ConfiguracaoUsuario>) => void;
  
  // Utilitários
  getSaldoTotal: () => number;
  getTotalDividas: () => number;
}

const FinancialDataContext = createContext<FinancialDataContextType | undefined>(undefined);

export function FinancialDataProvider({ children }: { children: ReactNode }) {
  const [carteiras, setCarteiras] = useState<Carteira[]>(carteirasIniciais);
  const [transacoes, setTransacoes] = useState<Transacao[]>(transacoesIniciais);
  const [dividas, setDividas] = useState<Divida[]>(dividasIniciais);
  const [metas, setMetas] = useState<Meta[]>(metasIniciais);
  const [configuracao, setConfiguracao] = useState<ConfiguracaoUsuario>(configuracaoInicial);

  const gerarId = () => Date.now().toString() + Math.random().toString(36).substr(2, 9);

  const adicionarTransacao = useCallback((
    descricao: string,
    valor: number,
    tipo: 'entrada' | 'saida' | 'transferencia',
    categoria: string,
    acaoOrigem: AcaoOrigem,
    carteiraOrigemId?: string,
    carteiraDestinoId?: string,
    metaId?: string,
    dividaId?: string
  ) => {
    const novaTransacao: Transacao = {
      id: gerarId(),
      data: new Date().toISOString(),
      descricao,
      valor,
      tipo,
      categoria,
      acaoOrigem,
      carteiraOrigemId,
      carteiraDestinoId,
      metaId,
      dividaId
    };
    setTransacoes(prev => [novaTransacao, ...prev]);
    return novaTransacao;
  }, []);

  const receberPagamento = useCallback((valor: number, carteiraId: string, descricao: string, categoria = 'Freelance') => {
    adicionarTransacao(descricao, valor, 'entrada', categoria, 'receber_pagamento', undefined, carteiraId);
    setCarteiras(prev => prev.map(c => 
      c.id === carteiraId ? { ...c, saldo: c.saldo + valor } : c
    ));
  }, [adicionarTransacao]);

  const pagarProLabore = useCallback((valor: number, carteiraOrigemId: string, carteiraDestinoId: string) => {
    adicionarTransacao('Pró-labore mensal', valor, 'transferencia', 'Pró-labore', 'pagar_prolabore', carteiraOrigemId, carteiraDestinoId);
    setCarteiras(prev => prev.map(c => {
      if (c.id === carteiraOrigemId) return { ...c, saldo: c.saldo - valor };
      if (c.id === carteiraDestinoId) return { ...c, saldo: c.saldo + valor };
      return c;
    }));
  }, [adicionarTransacao]);

  const pagarDespesa = useCallback((valor: number, carteiraId: string, categoria: string, descricao: string) => {
    adicionarTransacao(descricao, valor, 'saida', categoria, 'pagar_despesa', carteiraId);
    setCarteiras(prev => prev.map(c => 
      c.id === carteiraId ? { ...c, saldo: c.saldo - valor } : c
    ));
  }, [adicionarTransacao]);

  const aportarMeta = useCallback((valor: number, carteiraOrigemId: string, metaId: string) => {
    const meta = metas.find(m => m.id === metaId);
    if (!meta) return;

    adicionarTransacao(
      `Aporte: ${meta.nome}`, 
      valor, 
      'transferencia', 
      meta.ehReservaEmergencia ? 'Reserva' : 'Investimento', 
      'aportar_meta', 
      carteiraOrigemId, 
      meta.carteiraDestinoId,
      metaId
    );

    setCarteiras(prev => prev.map(c => {
      if (c.id === carteiraOrigemId) return { ...c, saldo: c.saldo - valor };
      if (c.id === meta.carteiraDestinoId) return { ...c, saldo: c.saldo + valor };
      return c;
    }));

    setMetas(prev => prev.map(m => 
      m.id === metaId ? { ...m, valorAcumulado: m.valorAcumulado + valor } : m
    ));
  }, [metas, adicionarTransacao]);

  const pagarDivida = useCallback((valor: number, carteiraOrigemId: string, dividaId: string) => {
    const divida = dividas.find(d => d.id === dividaId);
    if (!divida) return;

    const valorPagamento = Math.min(valor, divida.saldoRestante);
    
    adicionarTransacao(
      `Pagamento: ${divida.nome}`, 
      valorPagamento, 
      'saida', 
      'Pagamento Dívida', 
      'pagar_divida', 
      carteiraOrigemId,
      undefined,
      undefined,
      dividaId
    );

    setCarteiras(prev => prev.map(c => 
      c.id === carteiraOrigemId ? { ...c, saldo: c.saldo - valorPagamento } : c
    ));

    setDividas(prev => prev.map(d => {
      if (d.id === dividaId) {
        const novoSaldo = d.saldoRestante - valorPagamento;
        return { 
          ...d, 
          saldoRestante: novoSaldo,
          status: novoSaldo <= 0 ? 'quitada' : 'ativa',
          dataQuitacao: novoSaldo <= 0 ? new Date().toISOString() : undefined
        };
      }
      return d;
    }));
  }, [dividas, adicionarTransacao]);

  const usarReservaEmergencia = useCallback((valor: number, descricao: string) => {
    const carteiraReserva = carteiras.find(c => c.tipo === 'reserva');
    if (!carteiraReserva) return;

    adicionarTransacao(descricao, valor, 'saida', 'Emergência', 'usar_reserva', carteiraReserva.id);

    setCarteiras(prev => prev.map(c => 
      c.id === carteiraReserva.id ? { ...c, saldo: c.saldo - valor } : c
    ));

    // Atualizar meta de reserva
    const metaReserva = metas.find(m => m.ehReservaEmergencia);
    if (metaReserva) {
      setMetas(prev => prev.map(m => 
        m.ehReservaEmergencia ? { ...m, valorAcumulado: Math.max(0, m.valorAcumulado - valor) } : m
      ));
    }
  }, [carteiras, metas, adicionarTransacao]);

  const adicionarCarteira = useCallback((carteira: Omit<Carteira, 'id'>) => {
    setCarteiras(prev => [...prev, { ...carteira, id: gerarId() }]);
  }, []);

  const adicionarDivida = useCallback((divida: Omit<Divida, 'id' | 'dataCriacao'>) => {
    setDividas(prev => [...prev, { 
      ...divida, 
      id: gerarId(), 
      dataCriacao: new Date().toISOString() 
    }]);
  }, []);

  const adicionarMeta = useCallback((meta: Omit<Meta, 'id' | 'dataCriacao'>) => {
    setMetas(prev => [...prev, { 
      ...meta, 
      id: gerarId(), 
      dataCriacao: new Date().toISOString() 
    }]);
  }, []);

  const atualizarConfiguracao = useCallback((config: Partial<ConfiguracaoUsuario>) => {
    setConfiguracao(prev => ({
      ...prev,
      ...config,
      persona: { ...prev.persona, ...config.persona },
      percentuais: { ...prev.percentuais, ...config.percentuais }
    }));
  }, []);

  const getSaldoTotal = useCallback(() => {
    return carteiras.reduce((sum, c) => sum + c.saldo, 0);
  }, [carteiras]);

  const getTotalDividas = useCallback(() => {
    return dividas.filter(d => d.status === 'ativa').reduce((sum, d) => sum + d.saldoRestante, 0);
  }, [dividas]);

  return (
    <FinancialDataContext.Provider value={{
      carteiras,
      transacoes,
      dividas,
      metas,
      configuracao,
      receberPagamento,
      pagarProLabore,
      pagarDespesa,
      aportarMeta,
      pagarDivida,
      usarReservaEmergencia,
      adicionarCarteira,
      adicionarDivida,
      adicionarMeta,
      atualizarConfiguracao,
      getSaldoTotal,
      getTotalDividas
    }}>
      {children}
    </FinancialDataContext.Provider>
  );
}

export function useFinancialData() {
  const context = useContext(FinancialDataContext);
  if (context === undefined) {
    throw new Error('useFinancialData must be used within a FinancialDataProvider');
  }
  return context;
}

// Tipos base do sistema financeiro genérico

export type TipoCarteira = 'pessoal' | 'profissional' | 'reserva' | 'investimento';

export interface Carteira {
  id: string;
  nome: string;
  tipo: TipoCarteira;
  saldo: number;
  cor: string;
  icone: string;
}

export type TipoTransacao = 'entrada' | 'saida' | 'transferencia';

export type AcaoOrigem = 
  | 'receber_pagamento'
  | 'pagar_prolabore'
  | 'pagar_despesa'
  | 'aportar_meta'
  | 'pagar_divida'
  | 'usar_reserva'
  | 'transferencia_manual';

export interface Transacao {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  tipo: TipoTransacao;
  categoria: string;
  carteiraOrigemId?: string;
  carteiraDestinoId?: string;
  acaoOrigem: AcaoOrigem;
  metaId?: string;
  dividaId?: string;
}

export type StatusDivida = 'ativa' | 'quitada';

export interface Divida {
  id: string;
  nome: string;
  valorTotal: number;
  saldoRestante: number;
  carteiraAssociadaId: string;
  status: StatusDivida;
  dataCriacao: string;
  dataQuitacao?: string;
}

export interface Meta {
  id: string;
  nome: string;
  valorAlvo: number;
  valorAcumulado: number;
  prioridade: number;
  ehReservaEmergencia: boolean;
  carteiraDestinoId?: string;
  dataCriacao: string;
  dataConclusao?: string;
}

export type TipoSugestao = 'info' | 'aviso' | 'sucesso';

export interface Sugestao {
  id: string;
  tipo: TipoSugestao;
  titulo: string;
  mensagem: string;
  ativa: boolean;
}

export interface ConfiguracaoUsuario {
  persona: {
    nome: string;
    idade: number;
    profissao: string;
  };
  tipoRenda: 'fixa' | 'variavel';
  proLaboreAlvo?: number;
  percentuais: {
    essenciais: number;
    lazer: number;
    investimentos: number;
  };
}

// Categorias padrão para transações
export const CATEGORIAS_TRANSACAO = [
  'Salário',
  'Freelance',
  'Pró-labore',
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Investimento',
  'Reserva',
  'Pagamento Dívida',
  'Outros'
] as const;

export type CategoriaTransacao = typeof CATEGORIAS_TRANSACAO[number];

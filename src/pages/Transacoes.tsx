import { useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  Search,
  Filter
} from 'lucide-react';

export default function Transacoes() {
  const { transacoes, carteiras } = useFinancialData();
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroCarteira, setFiltroCarteira] = useState('todas');
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const transacoesFiltradas = transacoes.filter(t => {
    const matchTexto = t.descricao.toLowerCase().includes(filtroTexto.toLowerCase()) ||
                       t.categoria.toLowerCase().includes(filtroTexto.toLowerCase());
    const matchCarteira = filtroCarteira === 'todas' || 
                          t.carteiraOrigemId === filtroCarteira || 
                          t.carteiraDestinoId === filtroCarteira;
    const matchTipo = filtroTipo === 'todos' || t.tipo === filtroTipo;
    
    return matchTexto && matchCarteira && matchTipo;
  });

  const getTransactionIcon = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'saida': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'transferencia': return <ArrowRightLeft className="w-4 h-4 text-primary" />;
      default: return null;
    }
  };

  const getTypeBadge = (tipo: string) => {
    switch (tipo) {
      case 'entrada': return <Badge className="bg-success/10 text-success border-success/20">Entrada</Badge>;
      case 'saida': return <Badge variant="destructive">Saída</Badge>;
      case 'transferencia': return <Badge variant="secondary">Transferência</Badge>;
      default: return null;
    }
  };

  const getAcaoLabel = (acao: string) => {
    const labels: Record<string, string> = {
      'receber_pagamento': 'Recebimento',
      'pagar_prolabore': 'Pró-labore',
      'pagar_despesa': 'Despesa',
      'aportar_meta': 'Aporte em Meta',
      'pagar_divida': 'Pagamento Dívida',
      'usar_reserva': 'Uso de Reserva',
      'transferencia_manual': 'Transferência'
    };
    return labels[acao] || acao;
  };

  const getCarteiraNome = (id?: string) => {
    if (!id) return '-';
    const carteira = carteiras.find(c => c.id === id);
    return carteira?.nome || id;
  };

  // Totais do período
  const totalEntradas = transacoesFiltradas
    .filter(t => t.tipo === 'entrada')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalSaidas = transacoesFiltradas
    .filter(t => t.tipo === 'saida')
    .reduce((sum, t) => sum + t.valor, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Transações</h1>
        <p className="text-muted-foreground">Histórico completo de movimentações</p>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-success/20 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalEntradas)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Saídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalSaidas)}</div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Balanço</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalEntradas - totalSaidas >= 0 ? 'text-success' : 'text-destructive'}`}>
              {formatCurrency(totalEntradas - totalSaidas)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm">Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por descrição..."
                className="pl-9"
                value={filtroTexto}
                onChange={(e) => setFiltroTexto(e.target.value)}
              />
            </div>
            
            <Select value={filtroCarteira} onValueChange={setFiltroCarteira}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as carteiras" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as carteiras</SelectItem>
                {carteiras.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os tipos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
                <SelectItem value="transferencia">Transferências</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Transações */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico</CardTitle>
          <CardDescription>{transacoesFiltradas.length} transações encontradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transacoesFiltradas.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                Nenhuma transação encontrada
              </p>
            ) : (
              transacoesFiltradas.map(transacao => (
                <div 
                  key={transacao.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center">
                      {getTransactionIcon(transacao.tipo)}
                    </div>
                    <div>
                      <p className="font-medium">{transacao.descricao}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <span>{formatDate(transacao.data)}</span>
                        <span>•</span>
                        <span>{transacao.categoria}</span>
                        <span>•</span>
                        <span className="text-primary">{getAcaoLabel(transacao.acaoOrigem)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {transacao.carteiraOrigemId && (
                          <span>De: {getCarteiraNome(transacao.carteiraOrigemId)}</span>
                        )}
                        {transacao.carteiraOrigemId && transacao.carteiraDestinoId && ' → '}
                        {transacao.carteiraDestinoId && (
                          <span>Para: {getCarteiraNome(transacao.carteiraDestinoId)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getTypeBadge(transacao.tipo)}
                    <span className={`font-semibold text-lg ${
                      transacao.tipo === 'entrada' ? 'text-success' : 
                      transacao.tipo === 'saida' ? 'text-destructive' : 'text-foreground'
                    }`}>
                      {transacao.tipo === 'entrada' ? '+' : transacao.tipo === 'saida' ? '-' : ''}
                      {formatCurrency(transacao.valor)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

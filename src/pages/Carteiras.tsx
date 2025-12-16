import { useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';
import { 
  Wallet, 
  Plus, 
  Building2,
  PiggyBank,
  TrendingUp,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { TipoCarteira } from '@/types/financial';

const iconesPorTipo = {
  pessoal: Wallet,
  profissional: Building2,
  reserva: PiggyBank,
  investimento: TrendingUp
};

const coresPorTipo = {
  pessoal: 'bg-blue-500/10 text-blue-500',
  profissional: 'bg-purple-500/10 text-purple-500',
  reserva: 'bg-green-500/10 text-green-500',
  investimento: 'bg-amber-500/10 text-amber-500'
};

export default function Carteiras() {
  const { 
    carteiras, 
    transacoes,
    receberPagamento, 
    pagarProLabore, 
    pagarDespesa,
    adicionarCarteira,
    getSaldoTotal 
  } = useFinancialData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAcaoDialogOpen, setIsAcaoDialogOpen] = useState(false);
  const [acaoTipo, setAcaoTipo] = useState<'receber' | 'prolabore' | 'despesa'>('receber');
  const [carteiraAcaoId, setCarteiraAcaoId] = useState<string>('');
  
  const [novaCarteira, setNovaCarteira] = useState({
    nome: '',
    tipo: 'pessoal' as TipoCarteira,
    saldoInicial: ''
  });
  
  const [acaoForm, setAcaoForm] = useState({
    valor: '',
    descricao: '',
    categoria: '',
    carteiraDestino: ''
  });

  const handleNovaCarteira = () => {
    if (!novaCarteira.nome) return;
    
    adicionarCarteira({
      nome: novaCarteira.nome,
      tipo: novaCarteira.tipo,
      saldo: parseFloat(novaCarteira.saldoInicial) || 0,
      cor: `bg-${novaCarteira.tipo === 'pessoal' ? 'blue' : novaCarteira.tipo === 'profissional' ? 'purple' : novaCarteira.tipo === 'reserva' ? 'green' : 'amber'}-500`,
      icone: novaCarteira.tipo === 'pessoal' ? 'Wallet' : novaCarteira.tipo === 'profissional' ? 'Building2' : novaCarteira.tipo === 'reserva' ? 'PiggyBank' : 'TrendingUp'
    });
    
    setNovaCarteira({ nome: '', tipo: 'pessoal', saldoInicial: '' });
    setIsDialogOpen(false);
  };

  const handleAcao = () => {
    const valor = parseFloat(acaoForm.valor);
    if (!valor || valor <= 0) return;

    switch (acaoTipo) {
      case 'receber':
        receberPagamento(valor, carteiraAcaoId, acaoForm.descricao || 'Recebimento', acaoForm.categoria || 'Freelance');
        break;
      case 'prolabore':
        if (acaoForm.carteiraDestino) {
          pagarProLabore(valor, carteiraAcaoId, acaoForm.carteiraDestino);
        }
        break;
      case 'despesa':
        pagarDespesa(valor, carteiraAcaoId, acaoForm.categoria || 'Outros', acaoForm.descricao || 'Despesa');
        break;
    }

    setAcaoForm({ valor: '', descricao: '', categoria: '', carteiraDestino: '' });
    setIsAcaoDialogOpen(false);
  };

  const abrirDialogoAcao = (tipo: 'receber' | 'prolabore' | 'despesa', carteiraId: string) => {
    setAcaoTipo(tipo);
    setCarteiraAcaoId(carteiraId);
    setIsAcaoDialogOpen(true);
  };

  const getUltimasTransacoes = (carteiraId: string) => {
    return transacoes
      .filter(t => t.carteiraOrigemId === carteiraId || t.carteiraDestinoId === carteiraId)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carteiras</h1>
          <p className="text-muted-foreground">Gerencie onde seu dinheiro está</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Carteira
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova Carteira</DialogTitle>
              <DialogDescription>Adicione uma nova carteira para organizar seu dinheiro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input 
                  placeholder="Ex: Conta Nubank"
                  value={novaCarteira.nome}
                  onChange={(e) => setNovaCarteira(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={novaCarteira.tipo} 
                  onValueChange={(v: TipoCarteira) => setNovaCarteira(prev => ({ ...prev, tipo: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pessoal">Pessoal</SelectItem>
                    <SelectItem value="profissional">Profissional</SelectItem>
                    <SelectItem value="reserva">Reserva</SelectItem>
                    <SelectItem value="investimento">Investimento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Saldo Inicial</Label>
                <Input 
                  type="number"
                  placeholder="0,00"
                  value={novaCarteira.saldoInicial}
                  onChange={(e) => setNovaCarteira(prev => ({ ...prev, saldoInicial: e.target.value }))}
                />
              </div>
              
              <Button className="w-full" onClick={handleNovaCarteira}>
                Criar Carteira
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Saldo Total */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Saldo Total Consolidado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-primary">{formatCurrency(getSaldoTotal())}</div>
          <p className="text-xs text-muted-foreground mt-1">Soma de todas as carteiras</p>
        </CardContent>
      </Card>

      {/* Lista de Carteiras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {carteiras.map(carteira => {
          const Icone = iconesPorTipo[carteira.tipo];
          const corClasse = coresPorTipo[carteira.tipo];
          const ultimasTransacoes = getUltimasTransacoes(carteira.id);
          
          return (
            <Card key={carteira.id} className="card-hover">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${corClasse}`}>
                      <Icone className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{carteira.nome}</CardTitle>
                      <CardDescription className="capitalize">{carteira.tipo}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="capitalize">{carteira.tipo}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-2xl font-bold">{formatCurrency(carteira.saldo)}</div>
                
                {/* Ações rápidas */}
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => abrirDialogoAcao('receber', carteira.id)}
                  >
                    <ArrowUpRight className="w-3 h-3 mr-1 text-success" />
                    Receber
                  </Button>
                  {carteira.tipo === 'profissional' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => abrirDialogoAcao('prolabore', carteira.id)}
                    >
                      <DollarSign className="w-3 h-3 mr-1 text-primary" />
                      Pró-labore
                    </Button>
                  )}
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => abrirDialogoAcao('despesa', carteira.id)}
                  >
                    <ArrowDownRight className="w-3 h-3 mr-1 text-destructive" />
                    Pagar
                  </Button>
                </div>

                {/* Últimas transações */}
                {ultimasTransacoes.length > 0 && (
                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Últimas movimentações</p>
                    <div className="space-y-1">
                      {ultimasTransacoes.map(t => (
                        <div key={t.id} className="flex justify-between text-xs">
                          <span className="text-muted-foreground truncate max-w-[150px]">{t.descricao}</span>
                          <span className={t.tipo === 'entrada' || t.carteiraDestinoId === carteira.id ? 'text-success' : 'text-destructive'}>
                            {t.tipo === 'entrada' || t.carteiraDestinoId === carteira.id ? '+' : '-'}
                            {formatCurrency(t.valor)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Dialog de Ação */}
      <Dialog open={isAcaoDialogOpen} onOpenChange={setIsAcaoDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {acaoTipo === 'receber' ? 'Receber Pagamento' : 
               acaoTipo === 'prolabore' ? 'Pagar Pró-labore' : 'Pagar Despesa'}
            </DialogTitle>
            <DialogDescription>
              {acaoTipo === 'receber' ? 'Registre uma entrada de dinheiro' :
               acaoTipo === 'prolabore' ? 'Transferir pró-labore para conta pessoal' : 'Registre uma saída'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Valor</Label>
              <Input 
                type="number"
                placeholder="0,00"
                value={acaoForm.valor}
                onChange={(e) => setAcaoForm(prev => ({ ...prev, valor: e.target.value }))}
              />
            </div>
            
            {acaoTipo !== 'prolabore' && (
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input 
                  placeholder="Ex: Projeto cliente X"
                  value={acaoForm.descricao}
                  onChange={(e) => setAcaoForm(prev => ({ ...prev, descricao: e.target.value }))}
                />
              </div>
            )}
            
            {acaoTipo === 'prolabore' && (
              <div className="space-y-2">
                <Label>Carteira Destino</Label>
                <Select 
                  value={acaoForm.carteiraDestino} 
                  onValueChange={(v) => setAcaoForm(prev => ({ ...prev, carteiraDestino: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta pessoal" />
                  </SelectTrigger>
                  <SelectContent>
                    {carteiras.filter(c => c.tipo === 'pessoal').map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {acaoTipo !== 'prolabore' && (
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={acaoForm.categoria} 
                  onValueChange={(v) => setAcaoForm(prev => ({ ...prev, categoria: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {acaoTipo === 'receber' ? (
                      <>
                        <SelectItem value="Freelance">Freelance</SelectItem>
                        <SelectItem value="Salário">Salário</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="Alimentação">Alimentação</SelectItem>
                        <SelectItem value="Transporte">Transporte</SelectItem>
                        <SelectItem value="Moradia">Moradia</SelectItem>
                        <SelectItem value="Saúde">Saúde</SelectItem>
                        <SelectItem value="Lazer">Lazer</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button className="w-full" onClick={handleAcao}>
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

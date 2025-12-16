import { useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';
import { 
  CreditCard, 
  Plus,
  CheckCircle2,
  AlertCircle,
  DollarSign
} from 'lucide-react';

export default function Dividas() {
  const { dividas, carteiras, pagarDivida, adicionarDivida, getTotalDividas } = useFinancialData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPagarDialogOpen, setIsPagarDialogOpen] = useState(false);
  const [dividaSelecionadaId, setDividaSelecionadaId] = useState<string>('');
  
  const [novaDivida, setNovaDivida] = useState({
    nome: '',
    valorTotal: '',
    carteiraAssociadaId: ''
  });
  
  const [pagamentoForm, setPagamentoForm] = useState({
    valor: '',
    carteiraOrigemId: ''
  });

  const dividasAtivas = dividas.filter(d => d.status === 'ativa');
  const dividasQuitadas = dividas.filter(d => d.status === 'quitada');

  const handleNovaDivida = () => {
    if (!novaDivida.nome || !novaDivida.valorTotal) return;
    
    adicionarDivida({
      nome: novaDivida.nome,
      valorTotal: parseFloat(novaDivida.valorTotal),
      saldoRestante: parseFloat(novaDivida.valorTotal),
      carteiraAssociadaId: novaDivida.carteiraAssociadaId || carteiras[0]?.id,
      status: 'ativa'
    });
    
    setNovaDivida({ nome: '', valorTotal: '', carteiraAssociadaId: '' });
    setIsDialogOpen(false);
  };

  const handlePagar = () => {
    const valor = parseFloat(pagamentoForm.valor);
    if (!valor || valor <= 0 || !pagamentoForm.carteiraOrigemId) return;
    
    pagarDivida(valor, pagamentoForm.carteiraOrigemId, dividaSelecionadaId);
    
    setPagamentoForm({ valor: '', carteiraOrigemId: '' });
    setIsPagarDialogOpen(false);
  };

  const abrirDialogoPagamento = (dividaId: string) => {
    setDividaSelecionadaId(dividaId);
    setIsPagarDialogOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dívidas</h1>
          <p className="text-muted-foreground">Controle e quite suas dívidas</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Dívida
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Dívida</DialogTitle>
              <DialogDescription>Adicione uma nova dívida para acompanhar</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input 
                  placeholder="Ex: Cartão de Crédito"
                  value={novaDivida.nome}
                  onChange={(e) => setNovaDivida(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Valor Total</Label>
                <Input 
                  type="number"
                  placeholder="0,00"
                  value={novaDivida.valorTotal}
                  onChange={(e) => setNovaDivida(prev => ({ ...prev, valorTotal: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Carteira Associada</Label>
                <Select 
                  value={novaDivida.carteiraAssociadaId} 
                  onValueChange={(v) => setNovaDivida(prev => ({ ...prev, carteiraAssociadaId: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {carteiras.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={handleNovaDivida}>
                Registrar Dívida
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total em Dívidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(getTotalDividas())}</div>
            <p className="text-xs text-muted-foreground mt-1">{dividasAtivas.length} dívida(s) ativa(s)</p>
          </CardContent>
        </Card>
        
        <Card className="border-success/20 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Dívidas Quitadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{dividasQuitadas.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Parabéns pelo progresso!</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Progresso Geral</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dividas.length > 0 
                ? Math.round((dividasQuitadas.length / dividas.length) * 100) 
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Das dívidas quitadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Sugestão */}
      {dividasAtivas.length > 0 && (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Você possui dívidas ativas</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Considere direcionar aportes extras para quitá-las antes de investir em outras metas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dívidas Ativas */}
      {dividasAtivas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dívidas Ativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dividasAtivas.map(divida => {
              const percentualPago = ((divida.valorTotal - divida.saldoRestante) / divida.valorTotal) * 100;
              const carteira = carteiras.find(c => c.id === divida.carteiraAssociadaId);
              
              return (
                <Card key={divida.id} className="card-hover border-destructive/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                          <CreditCard className="w-5 h-5 text-destructive" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{divida.nome}</CardTitle>
                          <CardDescription>{carteira?.nome}</CardDescription>
                        </div>
                      </div>
                      <Badge variant="destructive">Ativa</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Valor Total</p>
                        <p className="font-semibold">{formatCurrency(divida.valorTotal)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Saldo Restante</p>
                        <p className="font-semibold text-destructive">{formatCurrency(divida.saldoRestante)}</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progresso de quitação</span>
                        <span className="font-medium">{percentualPago.toFixed(0)}%</span>
                      </div>
                      <Progress value={percentualPago} className="h-2" />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => abrirDialogoPagamento(divida.id)}
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Pagar Dívida
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Dívidas Quitadas */}
      {dividasQuitadas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Dívidas Quitadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dividasQuitadas.map(divida => (
              <Card key={divida.id} className="border-success/20 bg-success/5">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="font-medium">{divida.nome}</p>
                        <p className="text-sm text-muted-foreground">Quitada</p>
                      </div>
                    </div>
                    <Badge className="bg-success/10 text-success border-success/20">
                      {formatCurrency(divida.valorTotal)}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de Pagamento */}
      <Dialog open={isPagarDialogOpen} onOpenChange={setIsPagarDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pagar Dívida</DialogTitle>
            <DialogDescription>Escolha o valor e a carteira de origem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Valor do Pagamento</Label>
              <Input 
                type="number"
                placeholder="0,00"
                value={pagamentoForm.valor}
                onChange={(e) => setPagamentoForm(prev => ({ ...prev, valor: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Pagar com</Label>
              <Select 
                value={pagamentoForm.carteiraOrigemId} 
                onValueChange={(v) => setPagamentoForm(prev => ({ ...prev, carteiraOrigemId: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a carteira" />
                </SelectTrigger>
                <SelectContent>
                  {carteiras.map(c => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.nome} ({formatCurrency(c.saldo)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full" onClick={handlePagar}>
              Confirmar Pagamento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

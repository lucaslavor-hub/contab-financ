import { useState } from 'react';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatCurrency } from '@/lib/formatters';
import { 
  Target, 
  Plus,
  PiggyBank,
  TrendingUp,
  Star,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Metas() {
  const { metas, carteiras, aportarMeta, adicionarMeta } = useFinancialData();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAporteDialogOpen, setIsAporteDialogOpen] = useState(false);
  const [metaSelecionadaId, setMetaSelecionadaId] = useState<string>('');
  
  const [novaMeta, setNovaMeta] = useState({
    nome: '',
    valorAlvo: '',
    prioridade: '2',
    ehReservaEmergencia: false,
    carteiraDestinoId: ''
  });
  
  const [aporteForm, setAporteForm] = useState({
    valor: '',
    carteiraOrigemId: ''
  });

  const reservaEmergencia = metas.find(m => m.ehReservaEmergencia);
  const outrasMetas = metas.filter(m => !m.ehReservaEmergencia);
  const metasEmProgresso = metas.filter(m => m.valorAcumulado < m.valorAlvo);
  const metasConcluidas = metas.filter(m => m.valorAcumulado >= m.valorAlvo);

  const handleNovaMeta = () => {
    if (!novaMeta.nome || !novaMeta.valorAlvo) return;
    
    adicionarMeta({
      nome: novaMeta.nome,
      valorAlvo: parseFloat(novaMeta.valorAlvo),
      valorAcumulado: 0,
      prioridade: parseInt(novaMeta.prioridade),
      ehReservaEmergencia: novaMeta.ehReservaEmergencia,
      carteiraDestinoId: novaMeta.carteiraDestinoId || undefined
    });
    
    setNovaMeta({ nome: '', valorAlvo: '', prioridade: '2', ehReservaEmergencia: false, carteiraDestinoId: '' });
    setIsDialogOpen(false);
  };

  const handleAporte = () => {
    const valor = parseFloat(aporteForm.valor);
    if (!valor || valor <= 0 || !aporteForm.carteiraOrigemId) return;
    
    aportarMeta(valor, aporteForm.carteiraOrigemId, metaSelecionadaId);
    
    setAporteForm({ valor: '', carteiraOrigemId: '' });
    setIsAporteDialogOpen(false);
  };

  const abrirDialogoAporte = (metaId: string) => {
    setMetaSelecionadaId(metaId);
    setIsAporteDialogOpen(true);
  };

  const renderMetaCard = (meta: typeof metas[0], destaque = false) => {
    const percentual = (meta.valorAcumulado / meta.valorAlvo) * 100;
    const concluida = percentual >= 100;
    const carteiraDestino = carteiras.find(c => c.id === meta.carteiraDestinoId);
    
    return (
      <Card 
        key={meta.id} 
        className={`card-hover ${destaque ? 'border-primary/30 bg-primary/5' : ''} ${concluida ? 'border-success/30 bg-success/5' : ''}`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                concluida ? 'bg-success/10' :
                meta.ehReservaEmergencia ? 'bg-green-500/10' : 
                destaque ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {concluida ? (
                  <CheckCircle2 className="w-6 h-6 text-success" />
                ) : meta.ehReservaEmergencia ? (
                  <PiggyBank className="w-6 h-6 text-green-500" />
                ) : (
                  <Target className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {meta.nome}
                  {meta.ehReservaEmergencia && <Star className="w-4 h-4 text-amber-500 fill-amber-500" />}
                </CardTitle>
                <CardDescription>
                  {carteiraDestino ? `Destino: ${carteiraDestino.nome}` : 'Sem carteira definida'}
                </CardDescription>
              </div>
            </div>
            <Badge variant={concluida ? 'default' : 'secondary'} className={concluida ? 'bg-success' : ''}>
              {concluida ? 'Concluída' : `Prioridade ${meta.prioridade}`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Meta</p>
              <p className="text-xl font-bold">{formatCurrency(meta.valorAlvo)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
              <p className={`text-xl font-bold ${concluida ? 'text-success' : 'text-primary'}`}>
                {formatCurrency(meta.valorAcumulado)}
              </p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">{Math.min(percentual, 100).toFixed(0)}%</span>
            </div>
            <Progress value={Math.min(percentual, 100)} className="h-3" />
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Faltam {formatCurrency(Math.max(0, meta.valorAlvo - meta.valorAcumulado))}
            </span>
          </div>
          
          {!concluida && (
            <Button 
              className="w-full" 
              variant={meta.ehReservaEmergencia ? 'default' : 'outline'}
              onClick={() => abrirDialogoAporte(meta.id)}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Aportar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Metas</h1>
          <p className="text-muted-foreground">Acompanhe seus objetivos financeiros</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Meta</DialogTitle>
              <DialogDescription>Defina um novo objetivo financeiro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Nome da Meta</Label>
                <Input 
                  placeholder="Ex: Viagem, Carro, Curso..."
                  value={novaMeta.nome}
                  onChange={(e) => setNovaMeta(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Valor Alvo</Label>
                <Input 
                  type="number"
                  placeholder="0,00"
                  value={novaMeta.valorAlvo}
                  onChange={(e) => setNovaMeta(prev => ({ ...prev, valorAlvo: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select 
                  value={novaMeta.prioridade} 
                  onValueChange={(v) => setNovaMeta(prev => ({ ...prev, prioridade: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Alta (1)</SelectItem>
                    <SelectItem value="2">Média (2)</SelectItem>
                    <SelectItem value="3">Baixa (3)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Carteira de Destino (opcional)</Label>
                <Select 
                  value={novaMeta.carteiraDestinoId} 
                  onValueChange={(v) => setNovaMeta(prev => ({ ...prev, carteiraDestinoId: v }))}
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
              
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label>É Reserva de Emergência?</Label>
                  <p className="text-xs text-muted-foreground">Meta especial com prioridade máxima</p>
                </div>
                <Switch 
                  checked={novaMeta.ehReservaEmergencia}
                  onCheckedChange={(v) => setNovaMeta(prev => ({ ...prev, ehReservaEmergencia: v }))}
                />
              </div>
              
              <Button className="w-full" onClick={handleNovaMeta}>
                Criar Meta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sugestão: Reserva incompleta */}
      {reservaEmergencia && reservaEmergencia.valorAcumulado < reservaEmergencia.valorAlvo && (
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning">Sua Reserva de Emergência ainda não está completa</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Priorizar essa meta aumenta sua segurança financeira. Você está em{' '}
                  {((reservaEmergencia.valorAcumulado / reservaEmergencia.valorAlvo) * 100).toFixed(0)}% do objetivo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reserva de Emergência (destaque) */}
      {reservaEmergencia && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            Reserva de Emergência
          </h2>
          {renderMetaCard(reservaEmergencia, true)}
        </div>
      )}

      {/* Outras Metas em Progresso */}
      {outrasMetas.filter(m => m.valorAcumulado < m.valorAlvo).length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Metas em Progresso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {outrasMetas
              .filter(m => m.valorAcumulado < m.valorAlvo)
              .sort((a, b) => a.prioridade - b.prioridade)
              .map(meta => renderMetaCard(meta))}
          </div>
        </div>
      )}

      {/* Metas Concluídas */}
      {metasConcluidas.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Metas Concluídas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metasConcluidas.map(meta => renderMetaCard(meta))}
          </div>
        </div>
      )}

      {/* Dialog de Aporte */}
      <Dialog open={isAporteDialogOpen} onOpenChange={setIsAporteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aportar na Meta</DialogTitle>
            <DialogDescription>Escolha o valor e a carteira de origem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Valor do Aporte</Label>
              <Input 
                type="number"
                placeholder="0,00"
                value={aporteForm.valor}
                onChange={(e) => setAporteForm(prev => ({ ...prev, valor: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Pagar com</Label>
              <Select 
                value={aporteForm.carteiraOrigemId} 
                onValueChange={(v) => setAporteForm(prev => ({ ...prev, carteiraOrigemId: v }))}
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
            
            <Button className="w-full" onClick={handleAporte}>
              Confirmar Aporte
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

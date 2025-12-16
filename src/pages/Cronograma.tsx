import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Target, 
  Rocket,
  Plus,
  Trash2
} from 'lucide-react';

type TipoPrazo = 'curtissimo' | 'curto' | 'medio' | 'longo';

interface Tarefa {
  id: string;
  texto: string;
  concluida: boolean;
  prazo: TipoPrazo;
}

const configPrazos = {
  curtissimo: {
    titulo: 'Curtíssimo Prazo',
    periodo: '0 a 3 meses',
    icone: Clock,
    cor: 'bg-orange-500/10 text-orange-500'
  },
  curto: {
    titulo: 'Curto Prazo',
    periodo: '3 a 12 meses',
    icone: Calendar,
    cor: 'bg-amber-500/10 text-amber-500'
  },
  medio: {
    titulo: 'Médio Prazo',
    periodo: '1 a 5 anos',
    icone: Target,
    cor: 'bg-pink-500/10 text-pink-500'
  },
  longo: {
    titulo: 'Longo Prazo',
    periodo: '10+ anos',
    icone: Rocket,
    cor: 'bg-red-500/10 text-red-500'
  }
};

const tarefasIniciais: Tarefa[] = [
  // Curtíssimo Prazo
  { id: '1', texto: 'Quitar dívidas de cartão (PF primeiro, depois PJ)', concluida: false, prazo: 'curtissimo' },
  { id: '2', texto: 'Iniciar formação da reserva de emergência equivalente a 6 meses de despesas', concluida: false, prazo: 'curtissimo' },
  { id: '3', texto: 'Implantar sistema de controle financeiro', concluida: false, prazo: 'curtissimo' },
  { id: '4', texto: 'Solicitar redução de limite do cartão PJ', concluida: false, prazo: 'curtissimo' },
  
  // Curto Prazo
  { id: '5', texto: 'Completar reserva de emergência (R$ 21.900)', concluida: false, prazo: 'curto' },
  { id: '6', texto: 'Criar fundo de compensação para meses fracos', concluida: false, prazo: 'curto' },
  { id: '7', texto: 'Automatizar transferências para investimentos', concluida: false, prazo: 'curto' },
  
  // Médio Prazo
  { id: '8', texto: 'Montar carteira de investimentos diversificada (60/20/10/10)', concluida: false, prazo: 'medio' },
  { id: '9', texto: 'Aumentar aportes conforme crescimento da renda', concluida: false, prazo: 'medio' },
  { id: '10', texto: 'Acumular R$ 41.000 para intercâmbio/produto digital', concluida: false, prazo: 'medio' },
  { id: '11', texto: 'Revisar estratégia de investimentos anualmente', concluida: false, prazo: 'medio' },
  { id: '12', texto: 'Avaliar necessidade de seguros e proteção patrimonial', concluida: false, prazo: 'medio' },
  
  // Longo Prazo
  { id: '13', texto: 'Atingir patrimônio de R$ 1.1M+', concluida: false, prazo: 'longo' },
  { id: '14', texto: 'Gerar renda passiva de R$ 5.000/mês', concluida: false, prazo: 'longo' },
  { id: '15', texto: 'Alcançar independência financeira', concluida: false, prazo: 'longo' },
  { id: '16', texto: 'Planejar estratégia de legado e sucessão', concluida: false, prazo: 'longo' },
];

export default function Cronograma() {
  const [tarefas, setTarefas] = useState<Tarefa[]>(tarefasIniciais);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [novaTarefa, setNovaTarefa] = useState({ texto: '', prazo: 'curtissimo' as TipoPrazo });

  const toggleTarefa = (id: string) => {
    setTarefas(prev => prev.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));
  };

  const adicionarTarefa = () => {
    if (!novaTarefa.texto.trim()) return;
    
    const nova: Tarefa = {
      id: Date.now().toString(),
      texto: novaTarefa.texto,
      concluida: false,
      prazo: novaTarefa.prazo
    };
    
    setTarefas(prev => [...prev, nova]);
    setNovaTarefa({ texto: '', prazo: 'curtissimo' });
    setIsDialogOpen(false);
  };

  const removerTarefa = (id: string) => {
    setTarefas(prev => prev.filter(t => t.id !== id));
  };

  const getTarefasPorPrazo = (prazo: TipoPrazo) => {
    return tarefas.filter(t => t.prazo === prazo);
  };

  const getProgresso = (prazo: TipoPrazo) => {
    const tarefasPrazo = getTarefasPorPrazo(prazo);
    const concluidas = tarefasPrazo.filter(t => t.concluida).length;
    return { concluidas, total: tarefasPrazo.length };
  };

  const renderCard = (prazo: TipoPrazo) => {
    const config = configPrazos[prazo];
    const Icone = config.icone;
    const tarefasPrazo = getTarefasPorPrazo(prazo);
    const { concluidas, total } = getProgresso(prazo);

    return (
      <Card key={prazo} className="card-hover">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.cor}`}>
                <Icone className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{config.titulo}</CardTitle>
                <p className="text-sm text-muted-foreground">{config.periodo}</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-sm">
              {concluidas}/{total}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tarefasPrazo.map(tarefa => (
            <div 
              key={tarefa.id} 
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors group"
            >
              <Checkbox 
                id={tarefa.id}
                checked={tarefa.concluida}
                onCheckedChange={() => toggleTarefa(tarefa.id)}
                className="mt-0.5"
              />
              <label 
                htmlFor={tarefa.id}
                className={`flex-1 text-sm cursor-pointer ${tarefa.concluida ? 'line-through text-muted-foreground' : ''}`}
              >
                {tarefa.texto}
              </label>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removerTarefa(tarefa.id)}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </Button>
            </div>
          ))}
          {tarefasPrazo.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Nenhuma tarefa neste período
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Cronograma</h1>
          <p className="text-muted-foreground">Acompanhe seu progresso em cada fase do plano</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Tarefa</DialogTitle>
              <DialogDescription>Crie uma nova tarefa para o seu cronograma financeiro</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Descrição da Tarefa</Label>
                <Input 
                  placeholder="Ex: Quitar empréstimo pessoal"
                  value={novaTarefa.texto}
                  onChange={(e) => setNovaTarefa(prev => ({ ...prev, texto: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Prazo</Label>
                <Select 
                  value={novaTarefa.prazo} 
                  onValueChange={(v: TipoPrazo) => setNovaTarefa(prev => ({ ...prev, prazo: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curtissimo">Curtíssimo Prazo (0-3 meses)</SelectItem>
                    <SelectItem value="curto">Curto Prazo (3-12 meses)</SelectItem>
                    <SelectItem value="medio">Médio Prazo (1-5 anos)</SelectItem>
                    <SelectItem value="longo">Longo Prazo (10+ anos)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={adicionarTarefa}>
                Adicionar Tarefa
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards do Cronograma */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderCard('curtissimo')}
        {renderCard('curto')}
        {renderCard('medio')}
        {renderCard('longo')}
      </div>
    </div>
  );
}

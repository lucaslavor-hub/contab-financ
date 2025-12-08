import { useState } from 'react';
import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  Calendar, 
  Target,
  Rocket,
  CheckCircle2
} from 'lucide-react';

interface TarefaItem {
  id: string;
  texto: string;
  concluida: boolean;
}

interface CronogramaFase {
  titulo: string;
  periodo: string;
  icone: typeof Clock;
  cor: string;
  tarefas: TarefaItem[];
}

export default function Cronograma() {
  const { config } = useFinancialPlan();
  
  const [fases, setFases] = useState<CronogramaFase[]>([
    {
      titulo: 'Curtíssimo Prazo',
      periodo: '0 a 3 meses',
      icone: Clock,
      cor: 'bg-destructive/10 text-destructive',
      tarefas: [
        { id: 'quitar-dividas', texto: 'Quitar dívidas de cartão (PF primeiro, depois PJ)', concluida: false },
        { id: 'iniciar-reserva', texto: 'Iniciar formação da reserva de emergência equivalente a 6 meses de despesas', concluida: false },
        { id: 'sistema-controle', texto: 'Implantar sistema de controle financeiro', concluida: false },
        { id: 'reducao-limite', texto: 'Solicitar redução de limite do cartão PJ', concluida: false },
      ]
    },
    {
      titulo: 'Curto Prazo',
      periodo: '3 a 12 meses',
      icone: Calendar,
      cor: 'bg-warning/10 text-warning',
      tarefas: [
        { id: 'completar-reserva', texto: 'Completar reserva de emergência (R$ 21.900)', concluida: false },
        { id: 'fundo-compensacao', texto: 'Criar fundo de compensação para meses fracos', concluida: false },
        { id: 'automatizar', texto: 'Automatizar transferências para investimentos', concluida: false },
      ]
    },
    {
      titulo: 'Médio Prazo',
      periodo: '1 a 5 anos',
      icone: Target,
      cor: 'bg-chart-4/10 text-chart-4',
      tarefas: [
        { id: 'carteira-diversificada', texto: 'Montar carteira de investimentos diversificada (60/20/10/10)', concluida: false },
        { id: 'aumentar-aportes', texto: 'Aumentar aportes conforme crescimento da renda', concluida: false },
        { id: 'objetivo-intercambio', texto: `Acumular R$ ${config.objetivosEspecificos.patrimonioIntercambioEstimado.toLocaleString('pt-BR')} para intercâmbio/produto digital`, concluida: false },
        { id: 'revisar-estrategia', texto: 'Revisar estratégia de investimentos anualmente', concluida: false },
        { id: 'protecao-patrimonio', texto: 'Avaliar necessidade de seguros e proteção patrimonial', concluida: false },
      ]
    },
    {
      titulo: 'Longo Prazo',
      periodo: '10+ anos',
      icone: Rocket,
      cor: 'bg-primary/10 text-primary',
      tarefas: [
        { id: 'patrimonio-1m', texto: `Atingir patrimônio de R$ ${(config.objetivosEspecificos.patrimonioIndependenciaMin / 1000000).toFixed(1)}M+`, concluida: false },
        { id: 'renda-passiva', texto: `Gerar renda passiva de R$ ${config.objetivosEspecificos.rendaPassivaEstimativa.toLocaleString('pt-BR')}/mês`, concluida: false },
        { id: 'independencia', texto: 'Alcançar independência financeira', concluida: false },
        { id: 'legado', texto: 'Planejar estratégia de legado e sucessão', concluida: false },
      ]
    }
  ]);

  const toggleTarefa = (faseIndex: number, tarefaId: string) => {
    setFases(prev => prev.map((fase, idx) => {
      if (idx !== faseIndex) return fase;
      return {
        ...fase,
        tarefas: fase.tarefas.map(tarefa => 
          tarefa.id === tarefaId 
            ? { ...tarefa, concluida: !tarefa.concluida }
            : tarefa
        )
      };
    }));
  };

  const getTotalConcluidas = (tarefas: TarefaItem[]) => 
    tarefas.filter(t => t.concluida).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cronograma</h1>
        <p className="text-muted-foreground">Acompanhe seu progresso em cada fase do plano</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fases.map((fase, faseIndex) => {
          const concluidas = getTotalConcluidas(fase.tarefas);
          const total = fase.tarefas.length;
          const progresso = (concluidas / total) * 100;

          return (
            <Card key={fase.titulo} className="card-hover">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${fase.cor}`}>
                      <fase.icone className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{fase.titulo}</CardTitle>
                      <CardDescription>{fase.periodo}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={progresso === 100 ? "default" : "secondary"} className={progresso === 100 ? "bg-success" : ""}>
                    {concluidas}/{total}
                  </Badge>
                </div>
                {/* Progress bar */}
                <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${progresso === 100 ? 'bg-success' : 'bg-primary'}`}
                    style={{ width: `${progresso}%` }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fase.tarefas.map((tarefa) => (
                    <div
                      key={tarefa.id}
                      className={`flex items-start gap-3 p-3 rounded-lg transition-all cursor-pointer hover:bg-muted/50 ${
                        tarefa.concluida ? 'bg-success/5' : 'bg-muted/30'
                      }`}
                      onClick={() => toggleTarefa(faseIndex, tarefa.id)}
                    >
                      <Checkbox
                        id={tarefa.id}
                        checked={tarefa.concluida}
                        onCheckedChange={() => toggleTarefa(faseIndex, tarefa.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={tarefa.id}
                        className={`text-sm cursor-pointer flex-1 ${
                          tarefa.concluida ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {tarefa.texto}
                      </label>
                      {tarefa.concluida && (
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Resumo */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="text-center">
              <p className="text-3xl font-bold text-primary">
                {fases.reduce((acc, fase) => acc + getTotalConcluidas(fase.tarefas), 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tarefas Concluídas</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold">
                {fases.reduce((acc, fase) => acc + fase.tarefas.length, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total de Tarefas</p>
            </div>
            <div className="h-12 w-px bg-border hidden sm:block" />
            <div className="text-center">
              <p className="text-3xl font-bold text-success">
                {Math.round(
                  (fases.reduce((acc, fase) => acc + getTotalConcluidas(fase.tarefas), 0) /
                  fases.reduce((acc, fase) => acc + fase.tarefas.length, 0)) * 100
                )}%
              </p>
              <p className="text-sm text-muted-foreground">Progresso Geral</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

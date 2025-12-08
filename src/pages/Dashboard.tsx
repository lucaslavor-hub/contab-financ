import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  Target,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { config } = useFinancialPlan();
  
  const saldoTeorico = config.renda.rendaMedia - config.despesas.despesasMensaisTotais;
  const totalDividas = config.dividas.cartaoPF + config.dividas.cartaoPJ;
  const progressoReserva = 30; // Mock: 30% concluído

  const investimentosDistribuicao = [
    { nome: 'Renda Fixa', percentual: config.investimentos.rendaFixaPercent, cor: 'bg-chart-1' },
    { nome: 'Ações', percentual: config.investimentos.acoesPercent, cor: 'bg-chart-4' },
    { nome: 'FIIs', percentual: config.investimentos.fiisPercent, cor: 'bg-chart-2' },
    { nome: 'Previdência', percentual: config.investimentos.previdenciaPercent, cor: 'bg-chart-3' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu plano de independência financeira</p>
      </div>

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Visão Geral */}
        <Card className="card-hover md:col-span-2 lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Visão Geral</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Renda Média</p>
                <p className="text-lg font-semibold">{formatCurrency(config.renda.rendaMedia)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Despesas</p>
                <p className="text-lg font-semibold">{formatCurrency(config.despesas.despesasMensaisTotais)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Renda Mínima</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(config.renda.rendaMinima)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Renda Máxima</p>
                <p className="text-sm text-muted-foreground">{formatCurrency(config.renda.rendaMaxima)}</p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Saldo Teórico</span>
                <span className="text-xl font-bold text-success">{formatCurrency(saldoTeorico)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reserva de Emergência */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-success/10">
                <PiggyBank className="w-5 h-5 text-success" />
              </div>
              <CardTitle className="text-lg">Reserva de Emergência</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-medium">{progressoReserva}%</span>
              </div>
              <Progress value={progressoReserva} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Meta Total</p>
                <p className="font-semibold">{formatCurrency(config.reservaEmergencia.metaTotal)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Aporte Mensal</p>
                <p className="font-semibold">{formatCurrency(config.reservaEmergencia.aporteMensal)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-accent p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>Prioridade absoluta até completar a reserva de emergência.</span>
            </div>
          </CardContent>
        </Card>

        {/* Dívidas */}
        <Card className="card-hover">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <CreditCard className="w-5 h-5 text-destructive" />
                </div>
                <CardTitle className="text-lg">Dívidas</CardTitle>
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                Em andamento
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Total de Dívidas</p>
              <p className="text-2xl font-bold text-destructive">{formatCurrency(totalDividas)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Cartão PF</p>
                <p className="font-semibold">{formatCurrency(config.dividas.cartaoPF)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cartão PJ</p>
                <p className="font-semibold">{formatCurrency(config.dividas.cartaoPJ)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs">Quitar em até {config.dividas.prazoQuitarDividasMeses} meses</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segunda linha */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Distribuição de Investimentos */}
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <TrendingUp className="w-5 h-5 text-chart-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Distribuição de Investimentos</CardTitle>
                <CardDescription>
                  Rentabilidade anual estimada: {formatPercent(config.investimentos.rentabilidadeAnualEstimativa)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {investimentosDistribuicao.map((item) => (
                <div key={item.nome} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{item.nome}</span>
                    <span className="font-medium">{item.percentual}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${item.cor} rounded-full transition-all duration-500`}
                      style={{ width: `${item.percentual}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Objetivos */}
        <Card className="card-hover">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <CardTitle className="text-lg">Objetivos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Intercâmbio */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Intercâmbio / Produto Digital</h4>
                <Badge variant="outline">Médio prazo</Badge>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(config.objetivosEspecificos.patrimonioIntercambioEstimado)}
              </p>
              <p className="text-xs text-muted-foreground">
                Em {config.objetivosEspecificos.prazoIntercambioAnos} anos com aporte de {formatCurrency(config.objetivosEspecificos.aporteMensalIntercambio)}/mês
              </p>
            </div>

            {/* Independência Financeira */}
            <div className="p-4 bg-accent rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Independência Financeira</h4>
                <Badge className="bg-primary text-primary-foreground">Longo prazo</Badge>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(config.objetivosEspecificos.patrimonioIndependenciaMin)} - {formatCurrency(config.objetivosEspecificos.patrimonioIndependenciaMax)}
              </p>
              <p className="text-xs text-muted-foreground">
                Em {config.objetivosEspecificos.prazoIndependenciaAnos} anos • Renda passiva: {formatCurrency(config.objetivosEspecificos.rendaPassivaEstimativa)}/mês
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

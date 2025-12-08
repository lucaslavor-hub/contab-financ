import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { formatCurrency, formatPercent, calculateCompoundInterest } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  PiggyBank, 
  Plane, 
  Target,
  TrendingUp,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function Projecoes() {
  const { config } = useFinancialPlan();

  // Cálculos de projeção
  const patrimonioIntercambioCalculado = calculateCompoundInterest(
    config.objetivosEspecificos.aporteMensalIntercambio,
    config.objetivosEspecificos.rentabilidadeIntercambio,
    config.objetivosEspecificos.prazoIntercambioAnos
  );

  const patrimonioIndependenciaCalculado = calculateCompoundInterest(
    config.objetivosEspecificos.aporteMensalIndependencia,
    config.objetivosEspecificos.rentabilidadeIndependencia,
    config.objetivosEspecificos.prazoIndependenciaAnos
  );

  const mesesReserva = Array.from({ length: 12 }, (_, i) => ({
    mes: i + 1,
    valor: config.reservaEmergencia.aporteMensal * (i + 1),
    percentual: ((config.reservaEmergencia.aporteMensal * (i + 1)) / config.reservaEmergencia.metaTotal) * 100
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Projeções</h1>
        <p className="text-muted-foreground">Simulações e projeções financeiras de longo prazo</p>
      </div>

      {/* Reserva de Emergência */}
      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-success/10">
              <PiggyBank className="w-6 h-6 text-success" />
            </div>
            <div>
              <CardTitle>Reserva de Emergência</CardTitle>
              <CardDescription>
                Meta: {formatCurrency(config.reservaEmergencia.metaTotal)} em {config.reservaEmergencia.mesesEstimadosConclusao} meses
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Aporte Mensal</p>
              <p className="text-lg font-bold">{formatCurrency(config.reservaEmergencia.aporteMensal)}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Meta Total</p>
              <p className="text-lg font-bold">{formatCurrency(config.reservaEmergencia.metaTotal)}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Tesouro Selic</p>
              <p className="text-lg font-bold">{config.reservaEmergencia.percentualTesouroSelic}%</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Conta Remunerada</p>
              <p className="text-lg font-bold">{config.reservaEmergencia.percentualContaRemunerada}%</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Evolução ao Longo do Tempo
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mesesReserva.filter((_, i) => [0, 2, 5, 8, 11].includes(i)).map((item) => (
                <div key={item.mes} className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Mês {item.mes}</p>
                  <p className="font-semibold text-sm">{formatCurrency(item.valor)}</p>
                  <Progress value={Math.min(item.percentual, 100)} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Objetivos de Médio Prazo */}
      <Card className="card-hover">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-chart-4/10">
              <Plane className="w-6 h-6 text-chart-4" />
            </div>
            <div>
              <CardTitle>Intercâmbio / Produto Digital</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge variant="outline">Médio prazo</Badge>
                {config.objetivosEspecificos.prazoIntercambioAnos} anos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Aporte Mensal</p>
              <p className="text-xl font-bold">{formatCurrency(config.objetivosEspecificos.aporteMensalIntercambio)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Rentabilidade Anual</p>
              <p className="text-xl font-bold">{formatPercent(config.objetivosEspecificos.rentabilidadeIntercambio)}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Patrimônio Estimado</p>
              <p className="text-xl font-bold text-primary">{formatCurrency(patrimonioIntercambioCalculado)}</p>
            </div>
          </div>

          <div className="p-4 bg-accent rounded-lg">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">Fórmula de Juros Compostos</p>
                <p className="text-sm text-muted-foreground mt-1">
                  M = C × [(1 + i)^n - 1] / i
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Onde: M = Montante final, C = Contribuição mensal, i = taxa mensal, n = número de meses
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Independência Financeira */}
      <Card className="card-hover border-2 border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Independência Financeira
                <Sparkles className="w-4 h-4 text-primary" />
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                <Badge className="bg-primary text-primary-foreground">Longo prazo</Badge>
                {config.objetivosEspecificos.prazoIndependenciaAnos} anos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Aporte Mensal</p>
              <p className="text-xl font-bold">{formatCurrency(config.objetivosEspecificos.aporteMensalIndependencia)}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Rentabilidade Anual</p>
              <p className="text-xl font-bold">{formatPercent(config.objetivosEspecificos.rentabilidadeIndependencia)}</p>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl border border-primary/20">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">Patrimônio Estimado em {config.objetivosEspecificos.prazoIndependenciaAnos} anos</p>
              <p className="text-4xl font-bold text-primary">
                {formatCurrency(config.objetivosEspecificos.patrimonioIndependenciaMin)} - {formatCurrency(config.objetivosEspecificos.patrimonioIndependenciaMax)}
              </p>
              <div className="pt-4 border-t border-primary/20">
                <p className="text-sm text-muted-foreground">Renda Passiva Mensal Estimada</p>
                <p className="text-2xl font-bold text-success">
                  {formatCurrency(config.objetivosEspecificos.rendaPassivaEstimativa)}/mês
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">Patrimônio Calculado (Juros Compostos)</p>
              <p className="text-2xl font-bold">{formatCurrency(patrimonioIndependenciaCalculado)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Considerando aportes constantes e rentabilidade de {config.objetivosEspecificos.rentabilidadeIndependencia}% a.a.
              </p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-2">O que isso significa?</p>
              <p className="text-sm text-muted-foreground">
                Com esse patrimônio, você pode viver dos rendimentos sem precisar trabalhar, 
                mantendo seu padrão de vida atual e ainda reinvestindo parte dos ganhos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

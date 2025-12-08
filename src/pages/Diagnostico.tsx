import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Lightbulb,
  Wallet,
  Building2,
  CreditCard,
  PiggyBank,
  BarChart3,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export default function Diagnostico() {
  const { config } = useFinancialPlan();
  
  const saldoTeorico = config.renda.rendaMedia - config.despesas.despesasMensaisTotais;
  const totalAtivos = config.contas.contaPF + config.contas.contaPJ + config.contas.investimentosEspeculativos;
  const totalPassivos = config.dividas.cartaoPF + config.dividas.cartaoPJ;

  const problemas = [
    { texto: "Renda variável sem fundo de compensação para meses fracos", icone: AlertTriangle },
    { texto: "Uso inadequado de crédito rotativo (cartões)", icone: CreditCard },
    { texto: "Ausência de planejamento e controle financeiro estruturado", icone: XCircle },
    { texto: "Mistura de finanças PF e PJ", icone: Building2 },
    { texto: "Falta de reserva de emergência", icone: PiggyBank },
  ];

  const oportunidades = [
    { texto: "Implementar sistema de controle de fluxo de caixa", icone: BarChart3 },
    { texto: "Estabelecer pró-labore fixo mensal", icone: Wallet },
    { texto: "Construir reserva robusta de 6 meses", icone: PiggyBank },
    { texto: "Montar carteira de investimentos adequada ao perfil", icone: TrendingUp },
    { texto: "Reeducação comportamental para gastos", icone: Lightbulb },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Diagnóstico</h1>
        <p className="text-muted-foreground">Análise completa da situação financeira atual</p>
      </div>

      <Tabs defaultValue="situacao" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="situacao">Situação Atual</TabsTrigger>
          <TabsTrigger value="ativos">Ativos e Passivos</TabsTrigger>
          <TabsTrigger value="analise">Problemas e Oportunidades</TabsTrigger>
        </TabsList>

        {/* Tab Situação Atual */}
        <TabsContent value="situacao" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Renda Média Mensal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-success">{formatCurrency(config.renda.rendaMedia)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Variação: {formatCurrency(config.renda.rendaMinima)} a {formatCurrency(config.renda.rendaMaxima)}
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <TrendingDown className="w-4 h-4" />
                  Despesas Mensais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-destructive">{formatCurrency(config.despesas.despesasMensaisTotais)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Aproximadamente 61% da renda média
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                  <Wallet className="w-4 h-4" />
                  Saldo Teórico
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-primary">{formatCurrency(saldoTeorico)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Disponível para investir/poupar
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análise da Situação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Pontos de Atenção
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Mistura de PF/PJ:</strong> Dificulta o controle e pode gerar problemas fiscais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Falta de reserva:</strong> Sem proteção para meses de baixa renda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Gastos impulsivos:</strong> Comprometendo a capacidade de poupança</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Investimentos especulativos:</strong> Exposição a risco sem estratégia definida</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-accent rounded-lg space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Pontos Positivos
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    <span>Boa capacidade de geração de renda</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    <span>Saldo teórico positivo significativo</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-success mt-1">•</span>
                    <span>Idade favorável para planejamento de longo prazo</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Ativos e Passivos */}
        <TabsContent value="ativos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ativos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Ativos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Wallet className="w-5 h-5 text-success" />
                    <span>Conta PF</span>
                  </div>
                  <span className="font-semibold text-success">{formatCurrency(config.contas.contaPF)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-success" />
                    <span>Conta PJ</span>
                  </div>
                  <span className="font-semibold text-success">{formatCurrency(config.contas.contaPJ)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-success/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <BarChart3 className="w-5 h-5 text-success" />
                    <span>Investimentos Especulativos</span>
                  </div>
                  <span className="font-semibold text-success">{formatCurrency(config.contas.investimentosEspeculativos)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total de Ativos</span>
                    <span className="text-xl font-bold text-success">{formatCurrency(totalAtivos)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passivos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <TrendingDown className="w-5 h-5" />
                  Passivos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-destructive" />
                    <span>Cartão PF</span>
                  </div>
                  <span className="font-semibold text-destructive">{formatCurrency(config.dividas.cartaoPF)}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-destructive" />
                    <span>Cartão PJ</span>
                  </div>
                  <span className="font-semibold text-destructive">{formatCurrency(config.dividas.cartaoPJ)}</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total de Passivos</span>
                    <span className="text-xl font-bold text-destructive">{formatCurrency(totalPassivos)}</span>
                  </div>
                </div>
                <div className="pt-3">
                  <div className="flex justify-between items-center p-3 bg-primary/10 rounded-lg">
                    <span className="font-medium">Patrimônio Líquido</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(totalAtivos - totalPassivos)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Problemas e Oportunidades */}
        <TabsContent value="analise" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Problemas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Problemas Identificados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {problemas.map((problema, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-destructive/5 rounded-lg border border-destructive/10">
                    <problema.icone className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{problema.texto}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Oportunidades */}
            <Card>
              <CardHeader>
                <CardTitle className="text-success flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Oportunidades de Melhoria
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {oportunidades.map((oportunidade, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-success/5 rounded-lg border border-success/10">
                    <oportunidade.icone className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{oportunidade.texto}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

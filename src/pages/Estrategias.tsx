import { useState } from 'react';
import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { formatCurrency, formatPercent } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  PiggyBank, 
  CreditCard, 
  TrendingUp, 
  Brain,
  ArrowRight,
  Calculator,
  Target
} from 'lucide-react';

export default function Estrategias() {
  const { config } = useFinancialPlan();
  const [rendaSimulada, setRendaSimulada] = useState(config.renda.rendaMedia);

  const valorEssencial = (rendaSimulada * config.despesas.percentualEssenciais) / 100;
  const valorLazer = (rendaSimulada * config.despesas.percentualLazer) / 100;
  const valorInvestimentos = (rendaSimulada * config.despesas.percentualInvestimentos) / 100;

  const rendaAcimaDaMedia = Math.max(0, rendaSimulada - config.fundoCompensacao.rendaMediaReferencia);
  const valorFundoCompensacao = (rendaAcimaDaMedia * config.fundoCompensacao.percentualAcimaMedia) / 100;

  const investimentosTabela = [
    { categoria: 'Renda Fixa', percentual: config.investimentos.rendaFixaPercent, objetivo: 'Segurança e liquidez para emergências' },
    { categoria: 'Ações', percentual: config.investimentos.acoesPercent, objetivo: 'Exposição gradual a renda variável' },
    { categoria: 'FIIs', percentual: config.investimentos.fiisPercent, objetivo: 'Renda mensal passiva' },
    { categoria: 'Previdência', percentual: config.investimentos.previdenciaPercent, objetivo: 'Planejamento de longo prazo' },
  ];

  const acoesComportamentais = [
    { 
      desafio: 'Compras por impulso', 
      acao: `Regra dos ${config.comportamento.diasReflexaoCompras} dias para compras acima de ${formatCurrency(config.comportamento.valorRegraTresDias)}` 
    },
    { 
      desafio: 'Falta de organização', 
      acao: 'Automatizar transferências no dia do recebimento' 
    },
    { 
      desafio: 'Descontrole financeiro', 
      acao: `Ritual de revisão mensal de ${config.comportamento.minutosRevisaoMensal} minutos` 
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Estratégias</h1>
        <p className="text-muted-foreground">Plano de ação detalhado para alcançar seus objetivos</p>
      </div>

      <Accordion type="multiple" defaultValue={["orcamento", "compensacao"]} className="space-y-4">
        {/* Organização do Orçamento */}
        <AccordionItem value="orcamento" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Organização do Orçamento e Fluxo de Caixa</h3>
                <p className="text-sm text-muted-foreground">Modelo 50/30/20 adaptado</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Separação PF/PJ</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Manter contas separadas. Receber na PJ e transferir pró-labore fixo de{' '}
                    <strong className="text-foreground">{formatCurrency(config.renda.rendaAlvoProLabore)}</strong> para PF.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Pró-labore Fixo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Salário mensal fixo de <strong className="text-foreground">{formatCurrency(config.renda.rendaAlvoProLabore)}</strong>{' '}
                    independente da renda do mês.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calculator className="w-4 h-4" />
                  Simulador de Orçamento (50/30/20)
                </CardTitle>
                <CardDescription>Ajuste a renda mensal para ver a distribuição</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Renda do mês</span>
                    <span className="font-semibold">{formatCurrency(rendaSimulada)}</span>
                  </div>
                  <Slider
                    value={[rendaSimulada]}
                    onValueChange={(value) => setRendaSimulada(value[0])}
                    min={config.renda.rendaMinima}
                    max={config.renda.rendaMaxima}
                    step={100}
                    className="py-2"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-chart-1/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Essencial ({config.despesas.percentualEssenciais}%)</p>
                    <p className="text-xl font-bold text-chart-1">{formatCurrency(valorEssencial)}</p>
                  </div>
                  <div className="p-4 bg-chart-3/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Lazer ({config.despesas.percentualLazer}%)</p>
                    <p className="text-xl font-bold text-chart-3">{formatCurrency(valorLazer)}</p>
                  </div>
                  <div className="p-4 bg-chart-2/10 rounded-lg text-center">
                    <p className="text-xs text-muted-foreground mb-1">Investimentos ({config.despesas.percentualInvestimentos}%)</p>
                    <p className="text-xl font-bold text-chart-2">{formatCurrency(valorInvestimentos)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Fundo de Compensação */}
        <AccordionItem value="compensacao" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <PiggyBank className="w-5 h-5 text-chart-4" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Fundo de Compensação de Renda</h3>
                <p className="text-sm text-muted-foreground">Proteção contra meses de baixa</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Nos meses em que a renda ultrapassar a média de{' '}
              <strong className="text-foreground">{formatCurrency(config.fundoCompensacao.rendaMediaReferencia)}</strong>,
              reserve <strong className="text-foreground">{config.fundoCompensacao.percentualAcimaMedia}%</strong> do excedente.
            </p>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Simulação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Renda simulada</p>
                    <p className="font-semibold">{formatCurrency(rendaSimulada)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Acima da média</p>
                    <p className="font-semibold text-success">+{formatCurrency(rendaAcimaDaMedia)}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Reservar ({config.fundoCompensacao.percentualAcimaMedia}%)</p>
                    <p className="font-semibold text-primary">{formatCurrency(valorFundoCompensacao)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Gestão de Dívidas */}
        <AccordionItem value="dividas" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <CreditCard className="w-5 h-5 text-destructive" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Gestão de Dívidas</h3>
                <p className="text-sm text-muted-foreground">Quitar em até {config.dividas.prazoQuitarDividasMeses} meses</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-destructive/5 rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive">Prioridade 1</Badge>
                  <span>Cartão PF</span>
                </div>
                <span className="font-semibold">{formatCurrency(config.dividas.cartaoPF)}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Prioridade 2</Badge>
                  <span>Cartão PJ</span>
                </div>
                <span className="font-semibold">{formatCurrency(config.dividas.cartaoPJ)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Após quitar, considere reduzir o limite do cartão PJ para evitar novos endividamentos.
            </p>
          </AccordionContent>
        </AccordionItem>

        {/* Reserva de Emergência */}
        <AccordionItem value="reserva" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <PiggyBank className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Formação da Reserva de Emergência</h3>
                <p className="text-sm text-muted-foreground">6 meses de despesas</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4 space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Meta</p>
                <p className="font-semibold">{formatCurrency(config.reservaEmergencia.metaTotal)}</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Aporte Mensal</p>
                <p className="font-semibold">{formatCurrency(config.reservaEmergencia.aporteMensal)}</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Tesouro Selic</p>
                <p className="font-semibold">{config.reservaEmergencia.percentualTesouroSelic}%</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Conta Remunerada</p>
                <p className="font-semibold">{config.reservaEmergencia.percentualContaRemunerada}%</p>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Projeção de Acumulação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[3, 6, 9, 12].map((mes) => (
                    <div key={mes} className="flex items-center gap-4">
                      <span className="text-sm w-20">Mês {mes}</span>
                      <Progress value={(mes / 12) * 100} className="flex-1 h-2" />
                      <span className="text-sm font-medium w-24 text-right">
                        {formatCurrency(config.reservaEmergencia.aporteMensal * mes)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Estratégia de Investimentos */}
        <AccordionItem value="investimentos" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <TrendingUp className="w-5 h-5 text-chart-4" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Estratégia de Investimentos</h3>
                <p className="text-sm text-muted-foreground">Rentabilidade estimada: {config.investimentos.rentabilidadeAnualEstimativa}% a.a.</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Categoria</th>
                    <th className="text-center py-3 px-4 font-medium">Percentual</th>
                    <th className="text-left py-3 px-4 font-medium">Objetivo</th>
                  </tr>
                </thead>
                <tbody>
                  {investimentosTabela.map((item) => (
                    <tr key={item.categoria} className="border-b border-border/50">
                      <td className="py-3 px-4 font-medium">{item.categoria}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge variant="secondary">{item.percentual}%</Badge>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{item.objetivo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Plano de Ação Comportamental */}
        <AccordionItem value="comportamento" className="border rounded-lg px-4">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-chart-5/10">
                <Brain className="w-5 h-5 text-chart-5" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold">Plano de Ação Comportamental</h3>
                <p className="text-sm text-muted-foreground">Mudança de hábitos</p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium">Desafio</th>
                    <th className="text-left py-3 px-4 font-medium">Ação Proposta</th>
                  </tr>
                </thead>
                <tbody>
                  {acoesComportamentais.map((item, index) => (
                    <tr key={index} className="border-b border-border/50">
                      <td className="py-3 px-4 text-destructive">{item.desafio}</td>
                      <td className="py-3 px-4 text-sm">{item.acao}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

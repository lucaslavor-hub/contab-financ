import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Wallet, 
  Receipt, 
  Building2, 
  CreditCard, 
  PiggyBank, 
  TrendingUp, 
  Target,
  Brain,
  RotateCcw
} from 'lucide-react';
import { toast } from 'sonner';

export default function Configuracoes() {
  const { config, updateConfig, resetConfig } = useFinancialPlan();

  const handleReset = () => {
    resetConfig();
    toast.success('Configurações restauradas para os valores padrão');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configurações</h1>
          <p className="text-muted-foreground">Ajuste os parâmetros do seu plano financeiro</p>
        </div>
        <Button variant="outline" onClick={handleReset} className="gap-2">
          <RotateCcw className="w-4 h-4" />
          Restaurar Padrão
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persona */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Persona & Perfil</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={config.persona.nome}
                onChange={(e) => updateConfig({ persona: { ...config.persona, nome: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idade">Idade</Label>
                <Input
                  id="idade"
                  type="number"
                  value={config.persona.idade}
                  onChange={(e) => updateConfig({ persona: { ...config.persona, idade: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="profissao">Profissão</Label>
                <Input
                  id="profissao"
                  value={config.persona.profissao}
                  onChange={(e) => updateConfig({ persona: { ...config.persona, profissao: e.target.value } })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Renda */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-success" />
              <CardTitle>Renda</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rendaMinima">Renda Mínima</Label>
                <Input
                  id="rendaMinima"
                  type="number"
                  value={config.renda.rendaMinima}
                  onChange={(e) => updateConfig({ renda: { ...config.renda, rendaMinima: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rendaMaxima">Renda Máxima</Label>
                <Input
                  id="rendaMaxima"
                  type="number"
                  value={config.renda.rendaMaxima}
                  onChange={(e) => updateConfig({ renda: { ...config.renda, rendaMaxima: parseInt(e.target.value) || 0 } })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rendaMedia">Renda Média</Label>
                <Input
                  id="rendaMedia"
                  type="number"
                  value={config.renda.rendaMedia}
                  onChange={(e) => updateConfig({ renda: { ...config.renda, rendaMedia: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="proLabore">Pró-labore Alvo</Label>
                <Input
                  id="proLabore"
                  type="number"
                  value={config.renda.rendaAlvoProLabore}
                  onChange={(e) => updateConfig({ renda: { ...config.renda, rendaAlvoProLabore: parseInt(e.target.value) || 0 } })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Despesas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Receipt className="w-5 h-5 text-destructive" />
              <CardTitle>Despesas & Orçamento</CardTitle>
            </div>
            <CardDescription>Modelo 50/30/20</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="despesasTotais">Despesas Mensais Totais</Label>
              <Input
                id="despesasTotais"
                type="number"
                value={config.despesas.despesasMensaisTotais}
                onChange={(e) => updateConfig({ despesas: { ...config.despesas, despesasMensaisTotais: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Essenciais: {config.despesas.percentualEssenciais}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency((config.renda.rendaMedia * config.despesas.percentualEssenciais) / 100)}
                  </span>
                </div>
                <Slider
                  value={[config.despesas.percentualEssenciais]}
                  onValueChange={(value) => updateConfig({ despesas: { ...config.despesas, percentualEssenciais: value[0] } })}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Lazer: {config.despesas.percentualLazer}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency((config.renda.rendaMedia * config.despesas.percentualLazer) / 100)}
                  </span>
                </div>
                <Slider
                  value={[config.despesas.percentualLazer]}
                  onValueChange={(value) => updateConfig({ despesas: { ...config.despesas, percentualLazer: value[0] } })}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Investimentos: {config.despesas.percentualInvestimentos}%</Label>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency((config.renda.rendaMedia * config.despesas.percentualInvestimentos) / 100)}
                  </span>
                </div>
                <Slider
                  value={[config.despesas.percentualInvestimentos]}
                  onValueChange={(value) => updateConfig({ despesas: { ...config.despesas, percentualInvestimentos: value[0] } })}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-chart-4" />
              <CardTitle>Contas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contaPF">Conta PF</Label>
              <Input
                id="contaPF"
                type="number"
                value={config.contas.contaPF}
                onChange={(e) => updateConfig({ contas: { ...config.contas, contaPF: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contaPJ">Conta PJ</Label>
              <Input
                id="contaPJ"
                type="number"
                value={config.contas.contaPJ}
                onChange={(e) => updateConfig({ contas: { ...config.contas, contaPJ: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="investEspec">Investimentos Especulativos</Label>
              <Input
                id="investEspec"
                type="number"
                value={config.contas.investimentosEspeculativos}
                onChange={(e) => updateConfig({ contas: { ...config.contas, investimentosEspeculativos: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Dívidas */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-destructive" />
              <CardTitle>Dívidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cartaoPF">Cartão PF</Label>
                <Input
                  id="cartaoPF"
                  type="number"
                  value={config.dividas.cartaoPF}
                  onChange={(e) => updateConfig({ dividas: { ...config.dividas, cartaoPF: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cartaoPJ">Cartão PJ</Label>
                <Input
                  id="cartaoPJ"
                  type="number"
                  value={config.dividas.cartaoPJ}
                  onChange={(e) => updateConfig({ dividas: { ...config.dividas, cartaoPJ: parseInt(e.target.value) || 0 } })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="prazoQuitar">Prazo para Quitar (meses)</Label>
              <Input
                id="prazoQuitar"
                type="number"
                value={config.dividas.prazoQuitarDividasMeses}
                onChange={(e) => updateConfig({ dividas: { ...config.dividas, prazoQuitarDividasMeses: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Reserva de Emergência */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-5 h-5 text-success" />
              <CardTitle>Reserva de Emergência</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="metaReserva">Meta Total</Label>
                <Input
                  id="metaReserva"
                  type="number"
                  value={config.reservaEmergencia.metaTotal}
                  onChange={(e) => updateConfig({ reservaEmergencia: { ...config.reservaEmergencia, metaTotal: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="aporteReserva">Aporte Mensal</Label>
                <Input
                  id="aporteReserva"
                  type="number"
                  value={config.reservaEmergencia.aporteMensal}
                  onChange={(e) => updateConfig({ reservaEmergencia: { ...config.reservaEmergencia, aporteMensal: parseInt(e.target.value) || 0 } })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tesouro Selic: {config.reservaEmergencia.percentualTesouroSelic}%</Label>
                <Slider
                  value={[config.reservaEmergencia.percentualTesouroSelic]}
                  onValueChange={(value) => updateConfig({ reservaEmergencia: { ...config.reservaEmergencia, percentualTesouroSelic: value[0] } })}
                  max={100}
                  step={5}
                />
              </div>
              <div className="space-y-2">
                <Label>Conta Remunerada: {config.reservaEmergencia.percentualContaRemunerada}%</Label>
                <Slider
                  value={[config.reservaEmergencia.percentualContaRemunerada]}
                  onValueChange={(value) => updateConfig({ reservaEmergencia: { ...config.reservaEmergencia, percentualContaRemunerada: value[0] } })}
                  max={100}
                  step={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investimentos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-chart-4" />
              <CardTitle>Investimentos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Renda Fixa: {config.investimentos.rendaFixaPercent}%</Label>
              <Slider
                value={[config.investimentos.rendaFixaPercent]}
                onValueChange={(value) => updateConfig({ investimentos: { ...config.investimentos, rendaFixaPercent: value[0] } })}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Ações: {config.investimentos.acoesPercent}%</Label>
              <Slider
                value={[config.investimentos.acoesPercent]}
                onValueChange={(value) => updateConfig({ investimentos: { ...config.investimentos, acoesPercent: value[0] } })}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>FIIs: {config.investimentos.fiisPercent}%</Label>
              <Slider
                value={[config.investimentos.fiisPercent]}
                onValueChange={(value) => updateConfig({ investimentos: { ...config.investimentos, fiisPercent: value[0] } })}
                max={100}
                step={5}
              />
            </div>
            <div className="space-y-2">
              <Label>Previdência: {config.investimentos.previdenciaPercent}%</Label>
              <Slider
                value={[config.investimentos.previdenciaPercent]}
                onValueChange={(value) => updateConfig({ investimentos: { ...config.investimentos, previdenciaPercent: value[0] } })}
                max={100}
                step={5}
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="rentabilidade">Rentabilidade Anual Estimada (%)</Label>
              <Input
                id="rentabilidade"
                type="number"
                value={config.investimentos.rentabilidadeAnualEstimativa}
                onChange={(e) => updateConfig({ investimentos: { ...config.investimentos, rentabilidadeAnualEstimativa: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Objetivos */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle>Objetivos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h4 className="font-medium mb-3">Intercâmbio / Produto Digital</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aporteInt">Aporte Mensal</Label>
                  <Input
                    id="aporteInt"
                    type="number"
                    value={config.objetivosEspecificos.aporteMensalIntercambio}
                    onChange={(e) => updateConfig({ objetivosEspecificos: { ...config.objetivosEspecificos, aporteMensalIntercambio: parseInt(e.target.value) || 0 } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazoInt">Prazo (anos)</Label>
                  <Input
                    id="prazoInt"
                    type="number"
                    value={config.objetivosEspecificos.prazoIntercambioAnos}
                    onChange={(e) => updateConfig({ objetivosEspecificos: { ...config.objetivosEspecificos, prazoIntercambioAnos: parseInt(e.target.value) || 0 } })}
                  />
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="font-medium mb-3">Independência Financeira</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aporteInd">Aporte Mensal</Label>
                  <Input
                    id="aporteInd"
                    type="number"
                    value={config.objetivosEspecificos.aporteMensalIndependencia}
                    onChange={(e) => updateConfig({ objetivosEspecificos: { ...config.objetivosEspecificos, aporteMensalIndependencia: parseInt(e.target.value) || 0 } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prazoInd">Prazo (anos)</Label>
                  <Input
                    id="prazoInd"
                    type="number"
                    value={config.objetivosEspecificos.prazoIndependenciaAnos}
                    onChange={(e) => updateConfig({ objetivosEspecificos: { ...config.objetivosEspecificos, prazoIndependenciaAnos: parseInt(e.target.value) || 0 } })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rendaPassiva">Renda Passiva Alvo</Label>
                  <Input
                    id="rendaPassiva"
                    type="number"
                    value={config.objetivosEspecificos.rendaPassivaEstimativa}
                    onChange={(e) => updateConfig({ objetivosEspecificos: { ...config.objetivosEspecificos, rendaPassivaEstimativa: parseInt(e.target.value) || 0 } })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comportamento */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-chart-5" />
              <CardTitle>Comportamento</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="valorRegra">Valor Regra dos 3 Dias</Label>
              <Input
                id="valorRegra"
                type="number"
                value={config.comportamento.valorRegraTresDias}
                onChange={(e) => updateConfig({ comportamento: { ...config.comportamento, valorRegraTresDias: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diasReflexao">Dias de Reflexão</Label>
              <Input
                id="diasReflexao"
                type="number"
                value={config.comportamento.diasReflexaoCompras}
                onChange={(e) => updateConfig({ comportamento: { ...config.comportamento, diasReflexaoCompras: parseInt(e.target.value) || 0 } })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minutosRevisao">Minutos Revisão Mensal</Label>
              <Input
                id="minutosRevisao"
                type="number"
                value={config.comportamento.minutosRevisaoMensal}
                onChange={(e) => updateConfig({ comportamento: { ...config.comportamento, minutosRevisaoMensal: parseInt(e.target.value) || 0 } })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useFinancialData } from '@/contexts/FinancialDataContext';
import { gerarSugestoes } from '@/lib/suggestions';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Lightbulb, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  TrendingUp,
  PiggyBank,
  CreditCard,
  Target,
  Brain
} from 'lucide-react';

export default function Insights() {
  const { carteiras, dividas, metas, configuracao } = useFinancialData();
  
  const sugestoes = gerarSugestoes({ carteiras, dividas, metas });

  const getIconePorTipo = (tipo: string) => {
    switch (tipo) {
      case 'aviso': return <AlertCircle className="w-5 h-5 text-warning" />;
      case 'sucesso': return <CheckCircle2 className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-primary" />;
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'aviso': return 'border-warning/20 bg-warning/5';
      case 'sucesso': return 'border-success/20 bg-success/5';
      default: return 'border-primary/20 bg-primary/5';
    }
  };

  const estrategias = [
    {
      titulo: 'Modelo 50/30/20',
      descricao: 'Organize seu orçamento de forma equilibrada',
      icone: PiggyBank,
      conteudo: [
        { label: 'Essenciais', valor: `${configuracao.percentuais.essenciais}%`, descricao: 'Moradia, alimentação, contas fixas' },
        { label: 'Lazer', valor: `${configuracao.percentuais.lazer}%`, descricao: 'Entretenimento, hobbies, viagens' },
        { label: 'Investimentos', valor: `${configuracao.percentuais.investimentos}%`, descricao: 'Poupança, reserva, aportes' },
      ]
    },
    {
      titulo: 'Prioridade de Alocação',
      descricao: 'Ordem recomendada para direcionar seus recursos',
      icone: Target,
      conteudo: [
        { label: '1º', valor: 'Reserva de Emergência', descricao: 'Segurança financeira básica (6 meses de despesas)' },
        { label: '2º', valor: 'Quitação de Dívidas', descricao: 'Elimine juros altos primeiro' },
        { label: '3º', valor: 'Metas de Curto Prazo', descricao: 'Objetivos para os próximos 1-3 anos' },
        { label: '4º', valor: 'Investimentos de Longo Prazo', descricao: 'Independência financeira, aposentadoria' },
      ]
    },
    {
      titulo: 'Separação PF/PJ',
      descricao: 'Para quem tem renda variável ou é autônomo',
      icone: TrendingUp,
      conteudo: [
        { label: 'Receba', valor: 'Na conta PJ', descricao: 'Todo faturamento entra na conta profissional' },
        { label: 'Pró-labore', valor: 'Valor fixo mensal', descricao: configuracao.proLaboreAlvo ? formatCurrency(configuracao.proLaboreAlvo) : 'Defina nas configurações' },
        { label: 'Excedente', valor: 'Reserva ou investimento', descricao: 'O que sobrar na PJ vai para objetivos' },
      ]
    },
    {
      titulo: 'Gestão de Dívidas',
      descricao: 'Estratégias para quitar dívidas mais rápido',
      icone: CreditCard,
      conteudo: [
        { label: 'Bola de Neve', valor: 'Menor primeiro', descricao: 'Quite as menores para ganhar momentum' },
        { label: 'Avalanche', valor: 'Maior juros primeiro', descricao: 'Economize mais no longo prazo' },
        { label: 'Após quitar', valor: 'Reduza limites', descricao: 'Evite novos endividamentos' },
      ]
    },
    {
      titulo: 'Comportamento Financeiro',
      descricao: 'Hábitos que fazem diferença',
      icone: Brain,
      conteudo: [
        { label: 'Regra dos 3 dias', valor: 'Compras > R$ 500', descricao: 'Espere 3 dias antes de compras grandes' },
        { label: 'Automatize', valor: 'Transferências', descricao: 'Programe aportes no dia do recebimento' },
        { label: 'Revisão mensal', valor: '15 minutos', descricao: 'Analise gastos e ajuste o plano' },
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Insights</h1>
        <p className="text-muted-foreground">Sugestões e estratégias para sua saúde financeira</p>
      </div>

      {/* Sugestões Inteligentes */}
      {sugestoes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Sugestões para Você</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sugestoes.map(sugestao => (
              <Card key={sugestao.id} className={getCorPorTipo(sugestao.tipo)}>
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    {getIconePorTipo(sugestao.tipo)}
                    <div>
                      <p className="font-medium">{sugestao.titulo}</p>
                      <p className="text-sm text-muted-foreground mt-1">{sugestao.mensagem}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Nota: Sistema não bloqueante */}
      <Card className="border-muted">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-muted-foreground">Sistema Opinativo</p>
              <p className="text-sm text-muted-foreground mt-1">
                Estas são apenas sugestões baseadas em boas práticas financeiras. 
                Nenhuma ação é bloqueada - você tem total liberdade para gerenciar seu dinheiro como preferir.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estratégias */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Estratégias Financeiras</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {estrategias.map((estrategia, index) => {
            const Icone = estrategia.icone;
            return (
              <Card key={index} className="card-hover">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{estrategia.titulo}</CardTitle>
                      <CardDescription>{estrategia.descricao}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {estrategia.conteudo.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                        <Badge variant="outline" className="mt-0.5 shrink-0">{item.label}</Badge>
                        <div>
                          <p className="font-medium text-sm">{item.valor}</p>
                          <p className="text-xs text-muted-foreground">{item.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

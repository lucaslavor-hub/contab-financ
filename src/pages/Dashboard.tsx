import { useFinancialData } from '@/contexts/FinancialDataContext';
import { gerarSugestoes } from '@/lib/suggestions';
import { formatCurrency } from '@/lib/formatters';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Wallet, 
  PiggyBank, 
  CreditCard, 
  Target,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function Dashboard() {
  const { carteiras, dividas, metas, getSaldoTotal, getTotalDividas } = useFinancialData();
  
  const sugestoes = gerarSugestoes({ carteiras, dividas, metas });
  const reservaEmergencia = metas.find(m => m.ehReservaEmergencia);
  const dividasAtivas = dividas.filter(d => d.status === 'ativa');

  const getIconeSugestao = (tipo: string) => {
    switch (tipo) {
      case 'aviso': return <AlertCircle className="w-4 h-4 text-warning" />;
      case 'sucesso': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <Info className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral das suas finanças</p>
      </div>

      {/* Sugestões Inteligentes */}
      {sugestoes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {sugestoes.slice(0, 2).map(s => (
            <Card key={s.id} className={`${s.tipo === 'aviso' ? 'border-warning/20 bg-warning/5' : s.tipo === 'sucesso' ? 'border-success/20 bg-success/5' : 'border-primary/20 bg-primary/5'}`}>
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  {getIconeSugestao(s.tipo)}
                  <div>
                    <p className="font-medium text-sm">{s.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.mensagem}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Wallet className="w-4 h-4 text-primary" />
              </div>
              <CardTitle className="text-sm">Saldo Total</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">{formatCurrency(getSaldoTotal())}</p>
            <p className="text-xs text-muted-foreground">{carteiras.length} carteiras</p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-destructive/10">
                <CreditCard className="w-4 h-4 text-destructive" />
              </div>
              <CardTitle className="text-sm">Dívidas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-destructive">{formatCurrency(getTotalDividas())}</p>
            <p className="text-xs text-muted-foreground">{dividasAtivas.length} ativa(s)</p>
          </CardContent>
        </Card>

        {reservaEmergencia && (
          <Card className="card-hover md:col-span-2">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-success/10">
                  <PiggyBank className="w-4 h-4 text-success" />
                </div>
                <CardTitle className="text-sm">Reserva de Emergência</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-2xl font-bold">{formatCurrency(reservaEmergencia.valorAcumulado)}</span>
                <span className="text-muted-foreground">/ {formatCurrency(reservaEmergencia.valorAlvo)}</span>
              </div>
              <Progress value={(reservaEmergencia.valorAcumulado / reservaEmergencia.valorAlvo) * 100} className="h-2" />
            </CardContent>
          </Card>
        )}
      </div>

      {/* Carteiras */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Carteiras</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {carteiras.map(c => (
              <div key={c.id} className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium truncate">{c.nome}</p>
                <p className="text-lg font-bold">{formatCurrency(c.saldo)}</p>
                <Badge variant="outline" className="text-xs capitalize">{c.tipo}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metas */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Metas em Progresso</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metas.filter(m => m.valorAcumulado < m.valorAlvo).map(meta => (
              <div key={meta.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{meta.nome}</span>
                  <span>{((meta.valorAcumulado / meta.valorAlvo) * 100).toFixed(0)}%</span>
                </div>
                <Progress value={(meta.valorAcumulado / meta.valorAlvo) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

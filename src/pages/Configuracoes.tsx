import { useFinancialData } from '@/contexts/FinancialDataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { User, Wallet, Settings } from 'lucide-react';

export default function Configuracoes() {
  const { configuracao, atualizarConfiguracao } = useFinancialData();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Personalize seu sistema financeiro</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Persona */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Perfil</CardTitle>
            </div>
            <CardDescription>Dados do usuário (apenas exemplo)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input 
                value={configuracao.persona.nome}
                onChange={(e) => atualizarConfiguracao({ persona: { ...configuracao.persona, nome: e.target.value } })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Idade</Label>
                <Input 
                  type="number"
                  value={configuracao.persona.idade}
                  onChange={(e) => atualizarConfiguracao({ persona: { ...configuracao.persona, idade: parseInt(e.target.value) || 0 } })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo de Renda</Label>
                <Select 
                  value={configuracao.tipoRenda}
                  onValueChange={(v: 'fixa' | 'variavel') => atualizarConfiguracao({ tipoRenda: v })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixa">Fixa</SelectItem>
                    <SelectItem value="variavel">Variável</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profissão</Label>
              <Input 
                value={configuracao.persona.profissao}
                onChange={(e) => atualizarConfiguracao({ persona: { ...configuracao.persona, profissao: e.target.value } })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Pró-labore */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <CardTitle>Pró-labore</CardTitle>
            </div>
            <CardDescription>Salário fixo mensal (para renda variável)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Valor Alvo do Pró-labore</Label>
              <Input 
                type="number"
                value={configuracao.proLaboreAlvo || ''}
                onChange={(e) => atualizarConfiguracao({ proLaboreAlvo: parseFloat(e.target.value) || undefined })}
                placeholder="Ex: 4000"
              />
              <p className="text-xs text-muted-foreground">
                Defina quanto você quer transferir da conta PJ para a PF mensalmente.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Percentuais */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <CardTitle>Percentuais do Orçamento</CardTitle>
            </div>
            <CardDescription>Modelo 50/30/20 ajustável</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Essenciais</Label>
                  <span className="font-bold">{configuracao.percentuais.essenciais}%</span>
                </div>
                <Slider 
                  value={[configuracao.percentuais.essenciais]}
                  onValueChange={([v]) => atualizarConfiguracao({ percentuais: { ...configuracao.percentuais, essenciais: v } })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">Moradia, alimentação, contas</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Lazer</Label>
                  <span className="font-bold">{configuracao.percentuais.lazer}%</span>
                </div>
                <Slider 
                  value={[configuracao.percentuais.lazer]}
                  onValueChange={([v]) => atualizarConfiguracao({ percentuais: { ...configuracao.percentuais, lazer: v } })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">Entretenimento, hobbies</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <Label>Investimentos</Label>
                  <span className="font-bold">{configuracao.percentuais.investimentos}%</span>
                </div>
                <Slider 
                  value={[configuracao.percentuais.investimentos]}
                  onValueChange={([v]) => atualizarConfiguracao({ percentuais: { ...configuracao.percentuais, investimentos: v } })}
                  max={100}
                  step={5}
                />
                <p className="text-xs text-muted-foreground">Reserva, aportes, metas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useFinancialPlan } from '@/contexts/FinancialPlanContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { 
  Wallet, 
  Plus, 
  TrendingUp, 
  TrendingDown, 
  ArrowRightLeft,
  Building2,
  CreditCard,
  PiggyBank,
  Landmark,
  BarChart3
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  account: string;
  category: string;
}

interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment' | 'credit';
  balance: number;
  icon: React.ElementType;
}

const initialAccounts: Account[] = [
  { id: 'pf', name: 'Conta PF', type: 'checking', balance: 800, icon: Wallet },
  { id: 'pj', name: 'Conta PJ', type: 'checking', balance: 2500, icon: Building2 },
  { id: 'especulativos', name: 'Investimentos Especulativos', type: 'investment', balance: 1500, icon: BarChart3 },
  { id: 'reserva', name: 'Reserva de Emergência', type: 'savings', balance: 0, icon: PiggyBank },
];

const categories = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Lazer',
  'Saúde',
  'Educação',
  'Freelance',
  'Investimento',
  'Transferência',
  'Outros'
];

export default function Carteira() {
  const { config } = useFinancialPlan();
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      date: new Date().toISOString(),
      description: 'Projeto freelance - Cliente A',
      amount: 3500,
      type: 'income',
      account: 'pj',
      category: 'Freelance'
    },
    {
      id: '2',
      date: new Date(Date.now() - 86400000).toISOString(),
      description: 'Aporte reserva emergência',
      amount: 1825,
      type: 'transfer',
      account: 'reserva',
      category: 'Investimento'
    },
    {
      id: '3',
      date: new Date(Date.now() - 172800000).toISOString(),
      description: 'Aluguel',
      amount: 1500,
      type: 'expense',
      account: 'pf',
      category: 'Moradia'
    },
    {
      id: '4',
      date: new Date(Date.now() - 259200000).toISOString(),
      description: 'Supermercado',
      amount: 450,
      type: 'expense',
      account: 'pf',
      category: 'Alimentação'
    },
  ]);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense' as 'income' | 'expense' | 'transfer',
    account: '',
    category: ''
  });

  const totalAssets = accounts
    .filter(a => a.balance > 0)
    .reduce((sum, a) => sum + a.balance, 0);
  
  const totalLiabilities = accounts
    .filter(a => a.balance < 0)
    .reduce((sum, a) => sum + Math.abs(a.balance), 0);
  
  const netWorth = totalAssets - totalLiabilities;

  const handleAddTransaction = () => {
    if (!newTransaction.description || !newTransaction.amount || !newTransaction.account) return;
    
    const amount = parseFloat(newTransaction.amount);
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      description: newTransaction.description,
      amount: amount,
      type: newTransaction.type,
      account: newTransaction.account,
      category: newTransaction.category || 'Outros'
    };
    
    setTransactions(prev => [transaction, ...prev]);
    
    // Update account balance
    setAccounts(prev => prev.map(acc => {
      if (acc.id === newTransaction.account) {
        const balanceChange = newTransaction.type === 'income' ? amount : 
                              newTransaction.type === 'expense' ? -amount : 
                              amount;
        return { ...acc, balance: acc.balance + balanceChange };
      }
      return acc;
    }));
    
    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      account: '',
      category: ''
    });
    setIsDialogOpen(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'income': return <TrendingUp className="w-4 h-4 text-success" />;
      case 'expense': return <TrendingDown className="w-4 h-4 text-destructive" />;
      case 'transfer': return <ArrowRightLeft className="w-4 h-4 text-primary" />;
      default: return null;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'income': return <Badge className="bg-success/10 text-success border-success/20">Entrada</Badge>;
      case 'expense': return <Badge variant="destructive">Saída</Badge>;
      case 'transfer': return <Badge variant="secondary">Transferência</Badge>;
      default: return null;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carteira</h1>
          <p className="text-muted-foreground">Acompanhe seus saldos e lançamentos</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Novo Lançamento
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Lançamento</DialogTitle>
              <DialogDescription>Registre uma nova transação financeira</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={newTransaction.type} 
                  onValueChange={(v: 'income' | 'expense' | 'transfer') => 
                    setNewTransaction(prev => ({ ...prev, type: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Entrada</SelectItem>
                    <SelectItem value="expense">Saída</SelectItem>
                    <SelectItem value="transfer">Transferência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input 
                  placeholder="Ex: Projeto freelance"
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Valor</Label>
                <Input 
                  type="number"
                  placeholder="0,00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Conta</Label>
                <Select 
                  value={newTransaction.account} 
                  onValueChange={(v) => setNewTransaction(prev => ({ ...prev, account: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>{acc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Categoria</Label>
                <Select 
                  value={newTransaction.category} 
                  onValueChange={(v) => setNewTransaction(prev => ({ ...prev, category: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button className="w-full" onClick={handleAddTransaction}>
                Adicionar Lançamento
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-success/20 bg-success/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total em Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalAssets)}</div>
            <p className="text-xs text-muted-foreground mt-1">Contas e investimentos</p>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total em Dívidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{formatCurrency(totalLiabilities)}</div>
            <p className="text-xs text-muted-foreground mt-1">Cartões e empréstimos</p>
          </CardContent>
        </Card>
        
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patrimônio Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(netWorth)}</div>
            <p className="text-xs text-muted-foreground mt-1">Ativos - Dívidas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Contas</TabsTrigger>
          <TabsTrigger value="transactions">Lançamentos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="accounts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map(account => {
              const Icon = account.icon;
              const isNegative = account.balance < 0;
              
              return (
                <Card key={account.id} className="card-hover">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isNegative ? 'bg-destructive/10' : 'bg-primary/10'
                        }`}>
                          <Icon className={`w-5 h-5 ${isNegative ? 'text-destructive' : 'text-primary'}`} />
                        </div>
                        <div>
                          <h3 className="font-medium">{account.name}</h3>
                          <p className="text-xs text-muted-foreground capitalize">
                            {account.type === 'checking' ? 'Conta Corrente' :
                             account.type === 'savings' ? 'Poupança' :
                             account.type === 'investment' ? 'Investimento' : 'Crédito'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className={`mt-4 text-xl font-bold ${isNegative ? 'text-destructive' : ''}`}>
                      {formatCurrency(account.balance)}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Lançamentos</CardTitle>
              <CardDescription>Suas transações mais recentes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum lançamento registrado ainda
                  </p>
                ) : (
                  transactions.map(transaction => {
                    const account = accounts.find(a => a.id === transaction.account);
                    
                    return (
                      <div 
                        key={transaction.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center">
                            {getTransactionIcon(transaction.type)}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{formatDate(transaction.date)}</span>
                              <span>•</span>
                              <span>{account?.name}</span>
                              <span>•</span>
                              <span>{transaction.category}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getTypeBadge(transaction.type)}
                          <span className={`font-semibold ${
                            transaction.type === 'income' ? 'text-success' : 
                            transaction.type === 'expense' ? 'text-destructive' : ''
                          }`}>
                            {transaction.type === 'expense' ? '-' : '+'}{formatCurrency(transaction.amount)}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

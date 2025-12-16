import { Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFinancialData } from '@/contexts/FinancialDataContext';
import { useState, useEffect } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { configuracao } = useFinancialData();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <header className="h-16 bg-card border-b border-border px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="font-semibold text-foreground">{configuracao.persona.nome}</h2>
          <p className="text-xs text-muted-foreground">Sistema de Planejamento Financeiro</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
          <User className="w-5 h-5 text-primary" />
        </div>
      </div>
    </header>
  );
}

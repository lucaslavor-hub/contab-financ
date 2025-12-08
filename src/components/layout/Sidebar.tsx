import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileSearch, 
  Lightbulb, 
  TrendingUp, 
  Calendar, 
  Settings,
  Target,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileSearch, label: 'Diagnóstico', path: '/diagnostico' },
  { icon: Lightbulb, label: 'Estratégias', path: '/estrategias' },
  { icon: TrendingUp, label: 'Projeções', path: '/projecoes' },
  { icon: Calendar, label: 'Cronograma', path: '/cronograma' },
  { icon: Settings, label: 'Configurações', path: '/configuracoes' },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen bg-sidebar border-r border-sidebar-border",
          "transition-all duration-300 ease-in-out",
          isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
            <div className={cn("flex items-center gap-3 overflow-hidden", !isOpen && "lg:justify-center")}>
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              {isOpen && (
                <div className="animate-slide-in">
                  <h1 className="font-bold text-sidebar-foreground text-sm">Plano Financeiro</h1>
                  <p className="text-xs text-muted-foreground">Lucas Mendes</p>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onToggle}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && onToggle()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent group",
                    isActive 
                      ? "bg-sidebar-accent text-sidebar-primary font-medium" 
                      : "text-sidebar-foreground",
                    !isOpen && "lg:justify-center lg:px-0"
                  )
                }
              >
                <item.icon className={cn(
                  "w-5 h-5 flex-shrink-0 transition-colors",
                  "group-hover:text-sidebar-primary"
                )} />
                {isOpen && (
                  <span className="text-sm animate-slide-in">{item.label}</span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer */}
          {isOpen && (
            <div className="p-4 border-t border-sidebar-border">
              <p className="text-xs text-muted-foreground text-center">
                Plano de Independência Financeira
              </p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

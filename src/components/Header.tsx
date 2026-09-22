import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut } from 'lucide-react';

interface HeaderProps {
  subtitle?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ subtitle, className = '' }) => {
  const { user, signOut, navigate } = useApp();

  return (
    <header className={`flex items-center justify-between w-full py-2.5 ${className}`}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('clientes')}
          className="transition-opacity hover:opacity-90 flex items-center"
        >
          <img
            src="/assets/floraison-logo.png"
            alt="Floraison"
            className="h-8 sm:h-9 w-auto select-none opacity-95"
            draggable={false}
          />
        </button>
        {subtitle && (
          <span className="hidden sm:inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
            {subtitle}
          </span>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-2 shrink-0">
          <div className="glass-soft flex items-center gap-2 rounded-full py-1.5 pl-3 pr-1.5 text-xs font-semibold text-foreground">
            <span className="max-w-[120px] truncate">{user.name}</span>
            <button
              type="button"
              onClick={signOut}
              title="Sair do painel"
              className="press grid size-7 place-items-center rounded-full bg-danger/10 text-danger hover:bg-danger/20"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

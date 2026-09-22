import React from 'react';
import { Users, TrendingUp, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavigationProps {
  active: 'clientes' | 'faturamento' | 'adicionar';
}

export const Navigation: React.FC<NavigationProps> = ({ active }) => {
  const { navigate } = useApp();
  const itemClass =
    'flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-[13px] font-semibold transition-all press';

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-5 pb-6">
      <nav className="glass pointer-events-auto flex w-full max-w-md items-center gap-1 rounded-full p-1.5 shadow-xl">
        <button
          id="nav-clientes"
          type="button"
          onClick={() => navigate('clientes')}
          className={`${itemClass} ${
            active === 'clientes' ? 'glass-tint text-primary' : 'text-muted-foreground'
          }`}
        >
          <Users className="size-[18px]" strokeWidth={1.75} />
          Clientes
        </button>

        <button
          id="nav-faturamento"
          type="button"
          onClick={() => navigate('faturamento')}
          className={`${itemClass} ${
            active === 'faturamento' ? 'glass-tint text-primary' : 'text-muted-foreground'
          }`}
        >
          <TrendingUp className="size-[18px]" strokeWidth={1.75} />
          Faturamento
        </button>

        <button
          id="nav-adicionar"
          type="button"
          onClick={() => navigate('adicionar')}
          className={`${itemClass} ${
            active === 'adicionar' ? 'glass-tint text-primary' : 'text-muted-foreground'
          }`}
        >
          <Plus className="size-[18px]" strokeWidth={1.75} />
          Adicionar
        </button>
      </nav>
    </div>
  );
};

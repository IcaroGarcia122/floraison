import React from 'react';
import { useApp } from '../context/AppContext';
import { Header } from './Header';
import { ClienteForm } from './ClienteForm';
import { Navigation } from './Navigation';
import { ArrowLeft } from 'lucide-react';

export const ClienteDetalhesView: React.FC = () => {
  const { clientes, selectedClienteId, navigate } = useApp();

  const cliente = clientes.find((c) => c.id === selectedClienteId);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-36 pt-9">
      <Header />

      <div className="mb-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => navigate('clientes')}
          className="glass-soft press flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-white/50"
        >
          <ArrowLeft className="size-3.5" />
          Voltar para clientes
        </button>
      </div>

      {cliente ? (
        <ClienteForm cliente={cliente} />
      ) : (
        <div className="glass rounded-3xl p-6 text-center text-muted-foreground">
          <p>Cliente não encontrado ou excluído.</p>
          <button
            type="button"
            onClick={() => navigate('clientes')}
            className="press mt-3 text-sm font-semibold text-primary underline"
          >
            Voltar para a lista
          </button>
        </div>
      )}

      <Navigation active="clientes" />
    </div>
  );
};

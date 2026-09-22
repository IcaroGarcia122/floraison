/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { ToastProvider } from './context/ToastContext';
import { AuthPage } from './components/AuthPage';
import { ClientesView } from './components/ClientesView';
import { FaturamentoView } from './components/FaturamentoView';
import { AdicionarView } from './components/AdicionarView';
import { ClienteDetalhesView } from './components/ClienteDetalhesView';

function AppContent() {
  const { user, currentRoute, navigate } = useApp();

  // Handle URL path initialization and sync (/auth, /faturamento, /adicionar, /)
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/auth') {
      navigate('auth');
    } else if (path === '/faturamento' && user) {
      navigate('faturamento');
    } else if (path === '/adicionar' && user) {
      navigate('adicionar');
    }
  }, []);

  // Update browser history URL cleanly without full reload
  useEffect(() => {
    const targetPath =
      currentRoute === 'auth'
        ? '/auth'
        : currentRoute === 'faturamento'
        ? '/faturamento'
        : currentRoute === 'adicionar'
        ? '/adicionar'
        : '/';

    if (window.location.pathname !== targetPath) {
      try {
        window.history.replaceState({}, '', targetPath);
      } catch {
        // Safe fallback in restricted environments
      }
    }
  }, [currentRoute]);

  // If not logged in or explicitly in auth route, render the exact AuthPage
  if (!user || currentRoute === 'auth') {
    return <AuthPage />;
  }

  switch (currentRoute) {
    case 'clientes':
      return <ClientesView />;
    case 'faturamento':
      return <FaturamentoView />;
    case 'adicionar':
      return <AdicionarView />;
    case 'cliente-detalhes':
      return <ClienteDetalhesView />;
    default:
      return <ClientesView />;
  }
}

export default function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
}


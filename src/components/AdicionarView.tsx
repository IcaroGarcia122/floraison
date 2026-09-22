import React from 'react';
import { Header } from './Header';
import { ClienteForm } from './ClienteForm';
import { Navigation } from './Navigation';

export const AdicionarView: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-36 pt-9">
      <Header />
      <ClienteForm />
      <Navigation active="adicionar" />
    </div>
  );
};

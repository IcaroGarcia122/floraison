import React from 'react';
import { StatusCliente } from '../types';
import { STATUS_CONFIG } from '../utils/formatters';

interface StatusBadgeProps {
  status: StatusCliente;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.aguardando;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-md ${config.className}`}
    >
      <span className={`size-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

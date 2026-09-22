import { StatusCliente } from '../types';

export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value || 0);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return '—';
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

export function formatPhone(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) {
    return digits.length ? `(${digits}` : '';
  }
  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function parseCurrency(str: string): number {
  const digits = (str || '').replace(/\D/g, '');
  return digits ? Number(digits) / 100 : 0;
}

export const STATUS_CONFIG: Record<
  StatusCliente,
  { label: string; shortLabel: string; className: string; dot: string; bgSoft: string; border: string; hexColor: string; description?: string }
> = {
  'pedido-a-enviar': {
    label: 'pedido-a-enviar',
    shortLabel: 'A Enviar',
    className: 'text-blue-700 border-blue-600/35 bg-blue-600/10',
    dot: 'bg-[#1400FF]',
    bgSoft: 'bg-[#1400FF]/5',
    border: 'border-[#1400FF]/30',
    hexColor: '#1400FF',
    description: 'endereçoconfirmado',
  },
  'pedido-enviado': {
    label: 'pedido-enviado',
    shortLabel: 'Enviado',
    className: 'text-emerald-700 border-emerald-500/35 bg-emerald-500/10',
    dot: 'bg-[#00FF22]',
    bgSoft: 'bg-[#00FF22]/5',
    border: 'border-[#00FF22]/30',
    hexColor: '#00FF22',
    description: 'PRODUTOENVIADO',
  },
  'pedido-a-cobrar': {
    label: 'pedido-a-cobrar',
    shortLabel: 'A Cobrar',
    className: 'text-red-700 border-red-500/35 bg-red-500/10',
    dot: 'bg-[#FF0000]',
    bgSoft: 'bg-[#FF0000]/5',
    border: 'border-[#FF0000]/30',
    hexColor: '#FF0000',
    description: 'COBRAR',
  },
  'pedido-pago': {
    label: 'pedido-pago',
    shortLabel: 'Pago',
    className: 'text-green-700 border-green-500/35 bg-green-500/10',
    dot: 'bg-[#21FF00]',
    bgSoft: 'bg-[#21FF00]/5',
    border: 'border-[#21FF00]/30',
    hexColor: '#21FF00',
    description: 'Pedido pago',
  },
  'pagamento-futuro': {
    label: 'pagamento-futuro',
    shortLabel: 'Pag. Futuro',
    className: 'text-purple-700 border-purple-500/35 bg-purple-500/10',
    dot: 'bg-[#873D82]',
    bgSoft: 'bg-[#873D82]/5',
    border: 'border-[#873D82]/30',
    hexColor: '#873D82',
    description: 'Pagamento-futuro',
  },
  'erro-envio': {
    label: 'erro-envio',
    shortLabel: 'Erro Envio',
    className: 'text-yellow-700 border-yellow-500/35 bg-yellow-500/10',
    dot: 'bg-[#CCD021]',
    bgSoft: 'bg-[#CCD021]/5',
    border: 'border-[#CCD021]/30',
    hexColor: '#CCD021',
    description: 'erro-envio',
  },
  'leads-atencao': {
    label: 'leads-atencao',
    shortLabel: 'Atenção',
    className: 'text-amber-700 border-amber-600/35 bg-amber-500/10',
    dot: 'bg-[#C48A19]',
    bgSoft: 'bg-[#C48A19]/5',
    border: 'border-[#C48A19]/30',
    hexColor: '#C48A19',
    description: 'Leads-atencao',
  },
  'leads-reembolso': {
    label: 'leads-reembolso',
    shortLabel: 'Reembolso',
    className: 'text-rose-800 border-rose-700/35 bg-rose-700/10',
    dot: 'bg-[#923F65]',
    bgSoft: 'bg-[#923F65]/5',
    border: 'border-[#923F65]/30',
    hexColor: '#923F65',
    description: 'Leads-reembolso',
  },
  // Fallbacks for any legacy stage values
  novo: {
    label: 'pedido-a-enviar',
    shortLabel: 'A Enviar',
    className: 'text-blue-700 border-blue-600/35 bg-blue-600/10',
    dot: 'bg-[#1400FF]',
    bgSoft: 'bg-[#1400FF]/5',
    border: 'border-[#1400FF]/30',
    hexColor: '#1400FF',
    description: 'endereçoconfirmado',
  },
  envio_pendente: {
    label: 'pedido-a-enviar',
    shortLabel: 'A Enviar',
    className: 'text-blue-700 border-blue-600/35 bg-blue-600/10',
    dot: 'bg-[#1400FF]',
    bgSoft: 'bg-[#1400FF]/5',
    border: 'border-[#1400FF]/30',
    hexColor: '#1400FF',
    description: 'endereçoconfirmado',
  },
  enviado: {
    label: 'pedido-enviado',
    shortLabel: 'Enviado',
    className: 'text-emerald-700 border-emerald-500/35 bg-emerald-500/10',
    dot: 'bg-[#00FF22]',
    bgSoft: 'bg-[#00FF22]/5',
    border: 'border-[#00FF22]/30',
    hexColor: '#00FF22',
    description: 'PRODUTOENVIADO',
  },
  aguardando: {
    label: 'pedido-a-cobrar',
    shortLabel: 'A Cobrar',
    className: 'text-red-700 border-red-500/35 bg-red-500/10',
    dot: 'bg-[#FF0000]',
    bgSoft: 'bg-[#FF0000]/5',
    border: 'border-[#FF0000]/30',
    hexColor: '#FF0000',
    description: 'COBRAR',
  },
  pago: {
    label: 'pedido-pago',
    shortLabel: 'Pago',
    className: 'text-green-700 border-green-500/35 bg-green-500/10',
    dot: 'bg-[#21FF00]',
    bgSoft: 'bg-[#21FF00]/5',
    border: 'border-[#21FF00]/30',
    hexColor: '#21FF00',
    description: 'Pedido pago',
  },
  atendimento: {
    label: 'leads-atencao',
    shortLabel: 'Atenção',
    className: 'text-amber-700 border-amber-600/35 bg-amber-500/10',
    dot: 'bg-[#C48A19]',
    bgSoft: 'bg-[#C48A19]/5',
    border: 'border-[#C48A19]/30',
    hexColor: '#C48A19',
    description: 'Leads-atencao',
  },
};

export const STATUS_LIST: {
  value: StatusCliente;
  label: string;
  shortLabel: string;
  color: string;
  description?: string;
}[] = [
  {
    value: 'pedido-a-enviar',
    label: 'pedido-a-enviar',
    shortLabel: 'A Enviar',
    color: '#1400FF',
    description: 'endereçoconfirmado',
  },
  {
    value: 'pedido-enviado',
    label: 'pedido-enviado',
    shortLabel: 'Enviado',
    color: '#00FF22',
    description: 'PRODUTOENVIADO',
  },
  {
    value: 'pedido-a-cobrar',
    label: 'pedido-a-cobrar',
    shortLabel: 'A Cobrar',
    color: '#FF0000',
    description: 'COBRAR',
  },
  {
    value: 'pedido-pago',
    label: 'pedido-pago',
    shortLabel: 'Pago',
    color: '#21FF00',
    description: 'Pedido pago',
  },
  {
    value: 'pagamento-futuro',
    label: 'pagamento-futuro',
    shortLabel: 'Pag. Futuro',
    color: '#873D82',
    description: 'Pagamento-futuro',
  },
  {
    value: 'erro-envio',
    label: 'erro-envio',
    shortLabel: 'Erro Envio',
    color: '#CCD021',
    description: 'erro-envio',
  },
  {
    value: 'leads-atencao',
    label: 'leads-atencao',
    shortLabel: 'Atenção',
    color: '#C48A19',
    description: 'Leads-atencao',
  },
  {
    value: 'leads-reembolso',
    label: 'leads-reembolso',
    shortLabel: 'Reembolso',
    color: '#923F65',
    description: 'Leads-reembolso',
  },
];

export const TEAM_MEMBERS = ['Raysson', 'Icaro'] as const;

export function getTagColor(tag: string): { bg: string; text: string; border: string } {
  const t = (tag || '').toLowerCase();
  if (t.includes('vip')) {
    return { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-300' };
  }
  if (t.includes('quente') || t.includes('urgente') || t.includes('golpe')) {
    return { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-300' };
  }
  if (t.includes('pago') || t.includes('pix')) {
    return { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-300' };
  }
  if (t.includes('duvida') || t.includes('suporte')) {
    return { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' };
  }
  if (t.includes('carrinho') || t.includes('pendente')) {
    return { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' };
  }
  return { bg: 'bg-zinc-100', text: 'text-zinc-700', border: 'border-zinc-200' };
}


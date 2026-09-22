export type ChatwootEtiqueta =
  | 'pedido-a-enviar'
  | 'pedido-enviado'
  | 'pedido-a-cobrar'
  | 'pedido-pago'
  | 'pagamento-futuro'
  | 'erro-envio'
  | 'leads-atencao'
  | 'leads-reembolso';

export type StatusCliente =
  | ChatwootEtiqueta
  | 'novo'
  | 'atendimento'
  | 'aguardando'
  | 'pago'
  | 'envio_pendente'
  | 'enviado';

export interface NotaLead {
  id: string;
  texto: string;
  autor: string;
  data: string;
}

export interface ParsedOrderData {
  nomeDestinatario?: string;
  enderecoCompleto?: string;
  rua?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  produto?: string;
  quantidade?: string;
  valorFormatado?: string;
  formaPagamento?: string;
  instrucoesEntrega?: string;
  mensagemOriginal: string;
  horarioMensagem?: string;
  remetente?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  whatsapp: string;
  valor: number;
  data_pagamento: string | null;
  status: StatusCliente;
  responsavel: 'Raysson' | 'Icaro' | string;
  observacoes: string;
  suspeita_golpe: boolean;
  tags?: string[];
  notas?: NotaLead[];
  chatwoot_conversation_id?: number | string;
  chatwoot_contact_id?: number | string;
  chatwoot_last_message?: string | null;
  chatwoot_last_message_at?: string | null;
  chatwoot_last_message_sender?: string | null;
  parsed_order?: ParsedOrderData;
  criado_em?: string;
}

export interface ChatwootTag {
  id: string | number;
  title: string;
  color: string;
  description?: string;
}

export interface ChatwootConfig {
  url: string;
  accountId: string;
  apiAccessToken: string;
  lastSyncAt: string | null;
}

export interface Atalho {
  id: string;
  titulo: string;
  url: string;
  icone_url: string | null;
}

export interface MetaMes {
  mes: string; // YYYY-MM
  valor: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}


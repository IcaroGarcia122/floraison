import React, { useState } from 'react';
import { Cliente } from '../types';
import { parsePedidoMensagem } from '../utils/orderParser';
import { getLatestOrderMessage } from '../services/chatwootService';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import {
  Package,
  MapPin,
  User,
  Hash,
  ShoppingBag,
  CreditCard,
  Copy,
  Check,
  RefreshCw,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Edit3,
} from 'lucide-react';

interface PedidoAEnviarSectionProps {
  lead: Cliente;
}

export const PedidoAEnviarSection: React.FC<PedidoAEnviarSectionProps> = ({ lead }) => {
  const { saveCliente, chatwootConfig } = useApp();
  const { showToast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isEditingMessage, setIsEditingMessage] = useState(false);
  const [manualMessageText, setManualMessageText] = useState(
    lead.chatwoot_last_message || lead.observacoes || ''
  );

  // Derive parsed order from stored parsed_order or parse on-the-fly
  const activeMessage = lead.chatwoot_last_message || lead.observacoes || '';
  const parsed =
    lead.parsed_order ||
    parsePedidoMensagem(activeMessage, lead.nome, lead.whatsapp);

  const copyToClipboard = (text: string, fieldKey: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    showToast(`${label} copiado!`, 'success');
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleRefreshFromChatwoot = async () => {
    if (!lead.chatwoot_conversation_id) {
      showToast('Este lead não possui ID de conversa do Chatwoot vinculado.', 'info');
      return;
    }

    setIsLoading(true);
    try {
      const result = await getLatestOrderMessage(
        lead.chatwoot_conversation_id,
        chatwootConfig
      );

      if (result.orderConfirmationMessage || result.lastMessage) {
        const msgToUse = result.orderConfirmationMessage || result.lastMessage;
        const newParsed = parsePedidoMensagem(msgToUse, lead.nome, lead.whatsapp);

        saveCliente({
          ...lead,
          chatwoot_last_message: msgToUse,
          chatwoot_last_message_at: result.sentAt || new Date().toLocaleString('pt-BR'),
          chatwoot_last_message_sender: result.senderName || 'Chatwoot',
          parsed_order: newParsed,
        });

        setManualMessageText(msgToUse);
        showToast('Última mensagem do Chatwoot atualizada e analisada!', 'success');
      } else {
        showToast('Nenhuma mensagem recente encontrada nesta conversa.', 'info');
      }
    } catch (err) {
      console.error(err);
      showToast('Não foi possível atualizar a mensagem do Chatwoot.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveManualMessage = () => {
    const text = manualMessageText.trim();
    const newParsed = parsePedidoMensagem(text, lead.nome, lead.whatsapp);

    saveCliente({
      ...lead,
      chatwoot_last_message: text,
      parsed_order: newParsed,
    });

    setIsEditingMessage(false);
    showToast('Mensagem atualizada e dados re-identificados com sucesso!', 'success');
  };

  return (
    <div className="rounded-2xl border-2 border-primary/40 bg-gradient-to-br from-primary/5 via-card to-background p-4 sm:p-5 shadow-sm space-y-4 animate-fade-in">
      {/* Header with badge and actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-primary/20 pb-3">
        <div className="flex items-center gap-2">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow">
            <Package className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-foreground">
                Pedido a Enviar — Dados Identificados
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/20 px-2 py-0.5 text-[10px] font-extrabold text-primary uppercase tracking-wide">
                <Sparkles className="size-3" />
                Chatwoot
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Informações extraídas automaticamente da última mensagem do lead
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {lead.chatwoot_conversation_id && (
            <button
              type="button"
              onClick={handleRefreshFromChatwoot}
              disabled={isLoading}
              title="Buscar mensagem mais recente direto do Chatwoot"
              className="press flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40 disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin text-primary' : ''}`} />
              <span className="hidden sm:inline">Atualizar</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditingMessage((prev) => !prev)}
            title="Editar ou colar mensagem manualmente"
            className="press flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <Edit3 className="size-3.5" />
            <span className="hidden sm:inline">{isEditingMessage ? 'Cancelar' : 'Editar Mensagem'}</span>
          </button>
        </div>
      </div>

      {/* Manual message editor toggle */}
      {isEditingMessage && (
        <div className="rounded-xl border border-primary/30 bg-card p-3 space-y-2 animate-fade-in">
          <label className="block text-xs font-semibold text-foreground">
            Cole ou edite a mensagem do WhatsApp para re-identificar os campos:
          </label>
          <textarea
            rows={4}
            value={manualMessageText}
            onChange={(e) => setManualMessageText(e.target.value)}
            placeholder="Cole aqui a mensagem de confirmação do pedido com nome, endereço, CEP, produto..."
            className="w-full rounded-xl border border-border bg-background p-2.5 text-xs text-foreground outline-none focus:border-primary font-mono leading-relaxed"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditingMessage(false)}
              className="press rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground"
            >
              Fechar
            </button>
            <button
              type="button"
              onClick={handleSaveManualMessage}
              className="press rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow"
            >
              Salvar e Identificar
            </button>
          </div>
        </div>
      )}

      {/* Separated Fields Grid (identificação inteligente do pedido) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Destinatário */}
        <div className="rounded-xl border border-border/80 bg-card/80 p-3 flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              <User className="size-3 text-primary" />
              <span>Destinatário</span>
            </div>
            <p className="text-xs font-bold text-foreground truncate">
              {parsed.nomeDestinatario || lead.nome || 'Não identificado'}
            </p>
          </div>
          {(parsed.nomeDestinatario || lead.nome) && (
            <button
              type="button"
              onClick={() =>
                copyToClipboard(
                  parsed.nomeDestinatario || lead.nome,
                  'nome',
                  'Nome do destinatário'
                )
              }
              className="press grid size-7 place-items-center rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground"
              title="Copiar nome"
            >
              {copiedField === 'nome' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </button>
          )}
        </div>

        {/* CEP */}
        <div className="rounded-xl border border-border/80 bg-card/80 p-3 flex items-start justify-between gap-2">
          <div className="space-y-0.5 min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              <Hash className="size-3 text-primary" />
              <span>CEP</span>
            </div>
            <p className="text-xs font-bold text-primary truncate">
              {parsed.cep || 'Não identificado na mensagem'}
            </p>
          </div>
          {parsed.cep && (
            <button
              type="button"
              onClick={() => copyToClipboard(parsed.cep!, 'cep', 'CEP')}
              className="press grid size-7 place-items-center rounded-lg bg-muted/50 text-muted-foreground hover:text-foreground"
              title="Copiar CEP"
            >
              {copiedField === 'cep' ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </button>
          )}
        </div>

        {/* Endereço Completo */}
        <div className="sm:col-span-2 rounded-xl border border-border/80 bg-card/80 p-3 space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
              <MapPin className="size-3 text-primary" />
              <span>Endereço de Entrega</span>
            </div>
            {parsed.enderecoCompleto && (
              <button
                type="button"
                onClick={() =>
                  copyToClipboard(parsed.enderecoCompleto!, 'endereco', 'Endereço completo')
                }
                className="press flex items-center gap-1 rounded-md bg-muted/50 px-2 py-0.5 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
              >
                {copiedField === 'endereco' ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>Copiar Endereço</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs font-semibold text-foreground leading-relaxed">
            {parsed.enderecoCompleto || 'Endereço não identificado na última mensagem.'}
          </p>
        </div>

        {/* Produto & Quantidade */}
        <div className="rounded-xl border border-border/80 bg-card/80 p-3 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <ShoppingBag className="size-3 text-leaf" />
            <span>Produto / Quantidade</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            {parsed.produto || (parsed.quantidade ? `${parsed.quantidade} do produto` : 'Magnésio Treonato')}
          </p>
          {parsed.valorFormatado && (
            <p className="text-xs font-bold text-leaf">
              Valor: {parsed.valorFormatado}
            </p>
          )}
        </div>

        {/* Condição de Pagamento */}
        <div className="rounded-xl border border-border/80 bg-card/80 p-3 space-y-1">
          <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
            <CreditCard className="size-3 text-emerald-600" />
            <span>Forma de Pagamento</span>
          </div>
          <p className="text-xs font-semibold text-foreground">
            {parsed.formaPagamento || 'Pagamento pós-entrega via WhatsApp'}
          </p>
        </div>
      </div>

      {/* Raw message preview in WhatsApp-like bubble */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
            <MessageSquare className="size-3.5 text-emerald-600" />
            <span>Última Mensagem Completa:</span>
            {lead.chatwoot_last_message_sender && (
              <span className="text-[11px] font-normal text-muted-foreground">
                ({lead.chatwoot_last_message_sender} · {lead.chatwoot_last_message_at || 'recente'})
              </span>
            )}
          </div>

          {activeMessage && (
            <button
              type="button"
              onClick={() => copyToClipboard(activeMessage, 'msg_all', 'Mensagem completa')}
              className="press flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
            >
              {copiedField === 'msg_all' ? (
                <>
                  <Check className="size-3 text-emerald-600" />
                  <span>Copiada!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copiar Mensagem Íntegra</span>
                </>
              )}
            </button>
          )}
        </div>

        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-xs text-foreground/90 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
          {activeMessage || (
            <span className="text-muted-foreground italic font-sans">
              Nenhuma mensagem registrada ainda. Clique em &ldquo;Atualizar&rdquo; para puxar do Chatwoot ou &ldquo;Editar Mensagem&rdquo; para colar.
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

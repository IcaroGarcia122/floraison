import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Cliente, StatusCliente } from '../types';
import { formatBRL, formatDate, formatPhone, STATUS_CONFIG, STATUS_LIST, getTagColor } from '../utils/formatters';
import { PedidoAEnviarSection } from './PedidoAEnviarSection';
import {
  X,
  MessageCircle,
  AlertTriangle,
  DollarSign,
  Tag,
  UserCheck,
  Calendar,
  Trash2,
  Send,
  Check,
  Plus,
  ExternalLink,
} from 'lucide-react';

interface LeadDetailModalProps {
  leadId: string | null;
  onClose: () => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ leadId, onClose }) => {
  const {
    clientes,
    saveCliente,
    deleteCliente,
    updateLeadStatus,
    addLeadNota,
    toggleLeadTag,
    chatwootTags,
    chatwootConfig,
  } = useApp();

  const { showToast } = useToast();

  const lead = clientes.find((c) => c.id === leadId);

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [valorStr, setValorStr] = useState('');
  const [responsavel, setResponsavel] = useState<'Icaro' | 'Raysson' | string>('Icaro');
  const [observacoes, setObservacoes] = useState('');
  const [suspeitaGolpe, setSuspeitaGolpe] = useState(false);
  const [novaNota, setNovaNota] = useState('');
  const [showTagSelector, setShowTagSelector] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  useEffect(() => {
    if (lead) {
      setNome(lead.nome);
      setWhatsapp(lead.whatsapp);
      setValorStr(lead.valor ? lead.valor.toFixed(2).replace('.', ',') : '');
      setResponsavel(lead.responsavel);
      setObservacoes(lead.observacoes || '');
      setSuspeitaGolpe(lead.suspeita_golpe);
      setIsConfirmingDelete(false);
    }
  }, [lead]);

  if (!leadId || !lead) return null;

  const handleSaveBasic = () => {
    const rawVal = valorStr.replace(/\D/g, '');
    const numVal = rawVal ? Number(rawVal) / 100 : 0;

    saveCliente({
      ...lead,
      nome: nome.trim() || lead.nome,
      whatsapp: whatsapp.trim() || lead.whatsapp,
      valor: numVal,
      responsavel,
      observacoes: observacoes.trim(),
      suspeita_golpe: suspeitaGolpe,
    });
    showToast('Dados do lead atualizados com sucesso!', 'success');
  };

  const handleAddNota = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaNota.trim()) return;
    addLeadNota(lead.id, novaNota.trim());
    setNovaNota('');
    showToast('Nota adicionada ao histórico!', 'success');
  };

  const handleStageChange = (newStage: StatusCliente) => {
    updateLeadStatus(lead.id, newStage);
    showToast(`Lead movido para "${STATUS_CONFIG[newStage].label}"`, 'info');
  };

  const handleDelete = () => {
    deleteCliente(lead.id);
    showToast('Lead excluído do CRM', 'info');
    onClose();
  };

  const cleanPhone = lead.whatsapp.replace(/\D/g, '');
  const waUrl = cleanPhone
    ? `https://wa.me/55${cleanPhone.replace(/^55/, '')}?text=${encodeURIComponent(
        `Olá ${lead.nome.split(' ')[0]}, tudo bem? Aqui é da Floraison!`
      )}`
    : null;

  const chatwootConversationUrl =
    chatwootConfig.url && chatwootConfig.accountId && lead.chatwoot_conversation_id
      ? `${chatwootConfig.url.replace(/\/+$/, '')}/app/accounts/${chatwootConfig.accountId}/conversations/${lead.chatwoot_conversation_id}`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4 backdrop-blur-sm animate-fade-in">
      <div
        id="lead-detail-modal"
        className="glass relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-[28px] bg-background shadow-2xl border border-white/20"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary/10 text-primary font-bold text-lg shrink-0">
              {lead.nome.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground truncate">
                  {lead.nome}
                </h2>
                {lead.suspeita_golpe && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 border border-rose-500/30 shrink-0">
                    <AlertTriangle className="size-3" />
                    Suspeita de Golpe
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Criado em {formatDate(lead.criado_em)} · ID: {lead.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noreferrer"
                className="press flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-600"
              >
                <MessageCircle className="size-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}

            <button
              type="button"
              onClick={onClose}
              className="press grid size-9 place-items-center rounded-full bg-muted/40 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Stage Switcher */}
          <div className="rounded-2xl border border-border/60 bg-muted/10 p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Fase Atual no CRM (Clique para mover):
              </span>
              <span className="text-xs font-bold text-foreground">
                {STATUS_CONFIG[lead.status].label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-1.5">
              {STATUS_LIST.map((stage) => {
                const isActive = lead.status === stage.value;
                const conf = STATUS_CONFIG[stage.value];
                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => handleStageChange(stage.value)}
                    className={`press flex flex-col items-center justify-center rounded-xl p-2 text-center transition-all border ${
                      isActive
                        ? `${conf.className} ring-2 ring-primary/40 font-bold shadow-sm`
                        : 'bg-card border-border/70 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                    }`}
                  >
                    <span className={`size-2 rounded-full mb-1 ${conf.dot}`} />
                    <span className="text-[11px] font-semibold leading-tight">{stage.shortLabel}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Dedicated Section when Lead is Tagged 'pedido-a-enviar' */}
          {(lead.tags?.includes('pedido-a-enviar') || lead.status === 'pedido-a-enviar' || lead.status === 'envio_pendente') && (
            <PedidoAEnviarSection lead={lead} />
          )}

          {/* Core Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left Col: Lead Data */}
            <div className="space-y-4 rounded-2xl border border-border/60 bg-card p-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <UserCheck className="size-3.5 text-primary" />
                Dados do Lead
              </h3>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Nome Completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  onBlur={handleSaveBasic}
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">WhatsApp</label>
                  <input
                    type="text"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                    onBlur={handleSaveBasic}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <DollarSign className="size-3 text-leaf" />
                    Valor (R$)
                  </label>
                  <input
                    type="text"
                    value={valorStr}
                    placeholder="0,00"
                    onChange={(e) => setValorStr(e.target.value)}
                    onBlur={handleSaveBasic}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm font-semibold text-leaf outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Responsável</label>
                  <select
                    value={responsavel}
                    onChange={(e) => {
                      setResponsavel(e.target.value);
                      saveCliente({ ...lead, responsavel: e.target.value });
                    }}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="Icaro">Icaro</option>
                    <option value="Raysson">Raysson</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <Calendar className="size-3" />
                    Data Pagamento
                  </label>
                  <input
                    type="date"
                    value={lead.data_pagamento || ''}
                    onChange={(e) => {
                      saveCliente({ ...lead, data_pagamento: e.target.value || null });
                    }}
                    className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">Observações Gerais</label>
                <textarea
                  rows={2}
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  onBlur={handleSaveBasic}
                  placeholder="Detalhes sobre a compra, produtos de interesse..."
                  className="w-full rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Suspeita de golpe switch */}
              <div className="flex items-center justify-between rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`size-4 ${suspeitaGolpe ? 'text-danger' : 'text-muted-foreground'}`} />
                  <span className="text-xs font-semibold text-foreground">Marcar como Suspeita de Golpe</span>
                </div>
                <input
                  type="checkbox"
                  checked={suspeitaGolpe}
                  onChange={(e) => {
                    setSuspeitaGolpe(e.target.checked);
                    saveCliente({ ...lead, suspeita_golpe: e.target.checked });
                  }}
                  className="size-4 cursor-pointer accent-danger"
                />
              </div>

              {chatwootConversationUrl && (
                <a
                  href={chatwootConversationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="press flex items-center justify-center gap-1.5 rounded-xl border border-primary/30 bg-primary/5 py-2 text-xs font-semibold text-primary hover:bg-primary/10"
                >
                  <ExternalLink className="size-3.5" />
                  Abrir Conversa no Chatwoot
                </a>
              )}
            </div>

            {/* Right Col: Tags & Notes History */}
            <div className="space-y-4">
              {/* Tags Section */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Tag className="size-3.5 text-primary" />
                    Tags do Chatwoot no Lead
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowTagSelector((prev) => !prev)}
                    className="press flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    <Plus className="size-3.5" />
                    {showTagSelector ? 'Fechar Seletor' : 'Adicionar Tag'}
                  </button>
                </div>

                {/* Applied tags */}
                <div className="flex flex-wrap gap-1.5 min-h-[32px] items-center">
                  {(lead.tags && lead.tags.length > 0) ? (
                    lead.tags.map((tag) => {
                      const col = getTagColor(tag);
                      return (
                        <span
                          key={tag}
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${col.bg} ${col.text} ${col.border}`}
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => toggleLeadTag(lead.id, tag)}
                            className="hover:opacity-70"
                            title="Remover tag do lead"
                          >
                            <X className="size-3" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      Nenhuma tag aplicada ainda.
                    </span>
                  )}
                </div>

                {/* Tag Selector Drawer */}
                {showTagSelector && (
                  <div className="rounded-xl border border-border/80 bg-muted/20 p-3 space-y-2">
                    <p className="text-[11px] font-semibold text-muted-foreground">
                      Etiquetas do Chatwoot:
                    </p>
                    {chatwootTags.length === 0 ? (
                      <p className="text-xs text-muted-foreground italic py-1">
                        Nenhuma etiqueta sincronizada no momento. Informe os dados do Chatwoot no chat para carregar todas as suas etiquetas reais.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {chatwootTags.map((tag) => {
                          const isSelected = lead.tags?.includes(tag.title);
                          return (
                            <button
                              key={tag.id}
                              type="button"
                              onClick={() => toggleLeadTag(lead.id, tag.title)}
                              className={`press flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all border ${
                                isSelected
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'bg-background border-border/80 text-foreground hover:border-primary/50'
                              }`}
                            >
                              <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: isSelected ? '#ffffff' : tag.color }}
                              />
                              {tag.title}
                              {isSelected && <Check className="size-3 ml-0.5" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Notes / Conversation History */}
              <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-primary" />
                  Histórico de Notas & Atendimento
                </h3>

                {/* New note input */}
                <form onSubmit={handleAddNota} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Adicionar nota rápida (ex: Fechou Pix 15h)..."
                    value={novaNota}
                    onChange={(e) => setNovaNota(e.target.value)}
                    className="flex-1 rounded-xl border border-border/80 bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="press flex items-center gap-1 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90"
                  >
                    <Send className="size-3" />
                  </button>
                </form>

                {/* Notes List */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {lead.notas && lead.notas.length > 0 ? (
                    lead.notas.map((n) => (
                      <div
                        key={n.id}
                        className="rounded-xl border border-border/50 bg-muted/15 p-2.5 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                          <span className="font-semibold text-foreground">{n.autor}</span>
                          <span>{n.data}</span>
                        </div>
                        <p className="text-foreground text-xs leading-relaxed">{n.texto}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground italic text-center py-3">
                      Nenhuma nota registrada para este lead.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-4">
          <div>
            {isConfirmingDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-danger">Confirmar exclusão?</span>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="press rounded-lg bg-danger px-3 py-1.5 text-xs font-semibold text-white hover:bg-danger/90"
                >
                  Sim, Excluir
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="press rounded-lg border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(true)}
                className="press flex items-center gap-1 text-xs font-semibold text-danger/80 hover:text-danger hover:underline"
              >
                <Trash2 className="size-3.5" />
                Excluir Lead
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="press rounded-xl bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

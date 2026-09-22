import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { StatusCliente } from '../types';
import { formatPhone, STATUS_LIST } from '../utils/formatters';
import { X, Plus, UserPlus, DollarSign } from 'lucide-react';

interface NovoLeadModalProps {
  isOpen: boolean;
  initialStatus?: StatusCliente;
  onClose: () => void;
}

export const NovoLeadModal: React.FC<NovoLeadModalProps> = ({
  isOpen,
  initialStatus = 'novo',
  onClose,
}) => {
  const { saveCliente, chatwootTags, user } = useApp();
  const { showToast } = useToast();

  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [valorStr, setValorStr] = useState('');
  const [status, setStatus] = useState<StatusCliente>(initialStatus);
  const [responsavel, setResponsavel] = useState<'Icaro' | 'Raysson' | string>(user?.name || 'Icaro');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [observacoes, setObservacoes] = useState('');

  if (!isOpen) return null;

  const handleToggleTag = (tagTitle: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagTitle) ? prev.filter((t) => t !== tagTitle) : [...prev, tagTitle]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      showToast('Por favor, informe o nome do lead.', 'error');
      return;
    }

    const rawVal = valorStr.replace(/\D/g, '');
    const valor = rawVal ? Number(rawVal) / 100 : 0;

    saveCliente({
      nome: nome.trim(),
      whatsapp: whatsapp.trim(),
      valor,
      data_pagamento: status === 'pago' ? new Date().toISOString().slice(0, 10) : null,
      status,
      responsavel,
      observacoes: observacoes.trim(),
      suspeita_golpe: false,
      tags: selectedTags,
      notas: observacoes.trim()
        ? [
            {
              id: 'nota-' + Date.now(),
              texto: observacoes.trim(),
              autor: user?.name || 'Equipe',
              data: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            },
          ]
        : [],
    });

    showToast(`Lead "${nome.trim()}" criado com sucesso!`, 'success');
    setNome('');
    setWhatsapp('');
    setValorStr('');
    setObservacoes('');
    setSelectedTags([]);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div
        id="novo-lead-modal"
        className="glass relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[28px] bg-background shadow-2xl border border-white/20"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border/60 px-6 py-4 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Cadastrar Novo Lead no CRM
              </h2>
              <p className="text-xs text-muted-foreground">
                Adicione um contato para iniciar o atendimento no pipeline
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="press grid size-9 place-items-center rounded-full bg-muted/30 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Nome do Lead / Cliente *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Amanda Silveira"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                WhatsApp
              </label>
              <input
                type="text"
                placeholder="(00) 00000-0000"
                value={whatsapp}
                onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1">
                <DollarSign className="size-3 text-leaf" />
                Valor Estimado (R$)
              </label>
              <input
                type="text"
                placeholder="R$ 0,00"
                value={valorStr}
                onChange={(e) => setValorStr(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm font-semibold text-leaf outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Fase Inicial no Funil
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as StatusCliente)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              >
                {STATUS_LIST.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Responsável
              </label>
              <select
                value={responsavel}
                onChange={(e) => setResponsavel(e.target.value)}
                className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              >
                <option value="Icaro">Icaro</option>
                <option value="Raysson">Raysson</option>
              </select>
            </div>
          </div>

          {/* Tags selector (shown only when tags are synced) */}
          {chatwootTags.length > 0 && (
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Etiquetas Iniciais (Chatwoot)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 rounded-xl border border-border/60 bg-muted/10">
                {chatwootTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.title);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleToggleTag(tag.title)}
                      className={`press flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-card border-border/80 text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: isSelected ? '#ffffff' : tag.color }}
                      />
                      {tag.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
              Observações Iniciais
            </label>
            <textarea
              rows={2}
              placeholder="Informações sobre produto de interesse, origem..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full rounded-xl border border-border/80 bg-background px-3.5 py-2.5 text-xs text-foreground outline-none focus:border-primary"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              className="press rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="press flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow hover:opacity-90"
            >
              <Plus className="size-3.5" />
              Criar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

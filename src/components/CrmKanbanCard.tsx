import React, { useState } from 'react';
import { Cliente, StatusCliente } from '../types';
import { formatBRL, formatPhone, getTagColor, STATUS_LIST, STATUS_CONFIG } from '../utils/formatters';
import {
  AlertTriangle,
  MessageCircle,
  MoreVertical,
  ArrowRightLeft,
  Calendar,
  Package,
} from 'lucide-react';

interface CrmKanbanCardProps {
  lead: Cliente;
  onClick: () => void;
  onMoveStage: (leadId: string, newStage: StatusCliente) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
}

export const CrmKanbanCard: React.FC<CrmKanbanCardProps> = ({
  lead,
  onClick,
  onMoveStage,
  onDragStart,
}) => {
  const [showMoveMenu, setShowMoveMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const cleanPhone = lead.whatsapp.replace(/\D/g, '');
  const waUrl = cleanPhone ? `https://wa.me/55${cleanPhone.replace(/^55/, '')}` : null;

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(e, lead.id);
      }}
      onDragEnd={() => setIsDragging(false)}
      onClick={onClick}
      className={`group relative cursor-pointer select-none rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:border-primary/40 ${
        isDragging ? 'opacity-40 scale-95 border-dashed border-primary' : ''
      } ${lead.suspeita_golpe ? 'border-danger/40 bg-danger/[0.02]' : ''}`}
    >
      {/* Top row: Name, alert, and quick move menu */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <h4 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors">
              {lead.nome}
            </h4>
            {lead.suspeita_golpe && (
              <span
                title="Suspeita de golpe!"
                className="grid size-5 place-items-center rounded-full bg-danger/15 text-danger shrink-0"
              >
                <AlertTriangle className="size-3" />
              </span>
            )}
          </div>
          {lead.whatsapp && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <span>{formatPhone(lead.whatsapp)}</span>
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-emerald-600 hover:text-emerald-700 ml-0.5"
                  title="Abrir no WhatsApp"
                >
                  <MessageCircle className="size-3" />
                </a>
              )}
            </p>
          )}
        </div>

        {/* Quick move dropdown toggle */}
        <div className="relative shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Mover para outra fase"
            onClick={() => setShowMoveMenu((prev) => !prev)}
            className="press grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted/50 hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="size-4" />
          </button>

          {showMoveMenu && (
            <div className="absolute right-0 top-8 z-30 w-44 rounded-xl border border-border/80 bg-background/95 p-1.5 shadow-xl backdrop-blur-md animate-fade-in">
              <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <ArrowRightLeft className="size-3" /> Mover para:
              </p>
              {STATUS_LIST.map((st) => (
                <button
                  key={st.value}
                  type="button"
                  disabled={st.value === lead.status}
                  onClick={() => {
                    onMoveStage(lead.id, st.value);
                    setShowMoveMenu(false);
                  }}
                  className={`flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs text-left transition-colors ${
                    st.value === lead.status
                      ? 'bg-muted font-bold text-foreground opacity-50 cursor-default'
                      : 'text-foreground hover:bg-primary/10 hover:text-primary'
                  }`}
                >
                  <span className={`size-1.5 rounded-full ${STATUS_CONFIG[st.value].dot}`} />
                  <span className="truncate">{st.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Value & Date */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-sm font-bold text-leaf tracking-tight">
          {formatBRL(lead.valor)}
        </span>

        {lead.data_pagamento ? (
          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
            <Calendar className="size-3" />
            {lead.data_pagamento.split('-').reverse().slice(0, 2).join('/')}
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">
            {lead.responsavel}
          </span>
        )}
      </div>

      {/* Tags list (Chatwoot tags) */}
      {lead.tags && lead.tags.length > 0 && (
        <div className="mt-2.5 flex flex-wrap gap-1">
          {lead.tags.slice(0, 3).map((tag) => {
            const col = getTagColor(tag);
            return (
              <span
                key={tag}
                className={`inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold leading-none ${col.bg} ${col.text} ${col.border}`}
              >
                {tag}
              </span>
            );
          })}
          {lead.tags.length > 3 && (
            <span className="inline-flex items-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
              +{lead.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Highlight badge for pedido-a-enviar */}
      {(lead.tags?.includes('pedido-a-enviar') || lead.status === 'pedido-a-enviar' || lead.status === 'envio_pendente') && (
        <div className="mt-2 flex items-center justify-between rounded-lg bg-blue-500/10 border border-blue-500/25 px-2 py-1 text-[11px] font-bold text-blue-600">
          <span className="flex items-center gap-1 truncate">
            <Package className="size-3 shrink-0" />
            <span className="truncate">
              {lead.parsed_order?.quantidade ? `${lead.parsed_order.quantidade} un.` : ''}
              {lead.parsed_order?.cep ? ` · CEP ${lead.parsed_order.cep}` : 'Endereço'}
            </span>
          </span>
          <span className="text-[10px] font-medium text-blue-600/80 shrink-0">Ver dados →</span>
        </div>
      )}

      {/* Footer assignee & notes count */}
      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <span className="size-2 rounded-full bg-primary/70" />
          {lead.responsavel}
        </span>

        {lead.notas && lead.notas.length > 0 && (
          <span className="text-[10px] bg-muted/60 px-1.5 py-0.5 rounded-md">
            {lead.notas.length} {lead.notas.length === 1 ? 'nota' : 'notas'}
          </span>
        )}
      </div>
    </div>
  );
};

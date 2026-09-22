import React, { useState } from 'react';
import { Cliente, StatusCliente } from '../types';
import { formatBRL, STATUS_CONFIG } from '../utils/formatters';
import { CrmKanbanCard } from './CrmKanbanCard';
import { Plus } from 'lucide-react';

interface CrmKanbanColumnProps {
  stage: StatusCliente;
  title: string;
  leads: Cliente[];
  onCardClick: (leadId: string) => void;
  onMoveStage: (leadId: string, newStage: StatusCliente) => void;
  onQuickAdd: (stage: StatusCliente) => void;
  onDragStart: (e: React.DragEvent, leadId: string) => void;
  onDropCard: (e: React.DragEvent, targetStage: StatusCliente) => void;
}

export const CrmKanbanColumn: React.FC<CrmKanbanColumnProps> = ({
  stage,
  title,
  leads,
  onCardClick,
  onMoveStage,
  onQuickAdd,
  onDragStart,
  onDropCard,
}) => {
  const [isOver, setIsOver] = useState(false);
  const conf = STATUS_CONFIG[stage] || {
    label: stage,
    shortLabel: stage,
    className: 'text-zinc-600 border-zinc-500/25 bg-zinc-500/10',
    dot: 'bg-primary',
    bgSoft: 'bg-muted/5',
    border: 'border-border/70',
    hexColor: '#3b82f6',
    description: '',
  };

  const totalValue = leads.reduce((acc, curr) => acc + (curr.valor || 0), 0);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    onDropCard(e, stage);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col rounded-3xl border transition-all duration-200 min-w-[280px] sm:min-w-[300px] lg:min-w-[310px] flex-1 ${
        isOver
          ? 'border-primary bg-primary/10 shadow-lg scale-[1.01]'
          : `${conf.border} bg-muted/15 shadow-sm`
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between border-b border-border/50 px-4 py-3 bg-card/60 rounded-t-3xl backdrop-blur-sm">
        <div className="flex items-center gap-2.5 min-w-0">
          <span
            className="size-2.5 rounded-full shrink-0"
            style={{ backgroundColor: conf.hexColor || undefined }}
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-xs sm:text-sm text-foreground truncate tracking-tight font-mono">
                {conf.label}
              </h3>
              <span className="rounded-full bg-muted/70 px-2 py-0.2 text-[11px] font-bold text-muted-foreground shrink-0">
                {leads.length}
              </span>
            </div>
            {conf.description && (
              <p className="text-[10px] text-muted-foreground truncate">{conf.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onQuickAdd(stage)}
            title={`Adicionar lead em ${title}`}
            className="press grid size-7 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <Plus className="size-4" />
          </button>
        </div>
      </div>

      {/* Sub-header with column financial total */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-card/30 border-b border-border/30 text-[11px] text-muted-foreground">
        <span>Total da fase:</span>
        <span className="font-semibold text-foreground">{formatBRL(totalValue)}</span>
      </div>

      {/* Column Card Body */}
      <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[160px]">
        {leads.length === 0 ? (
          <div className="flex h-36 flex-col items-center justify-center rounded-2xl border border-dashed border-border/60 text-center p-4 text-muted-foreground">
            <p className="text-xs font-medium">Nenhum lead nesta fase</p>
            <button
              type="button"
              onClick={() => onQuickAdd(stage)}
              className="mt-2 text-[11px] font-semibold text-primary hover:underline"
            >
              + Adicionar lead
            </button>
          </div>
        ) : (
          leads.map((lead) => (
            <CrmKanbanCard
              key={lead.id}
              lead={lead}
              onClick={() => onCardClick(lead.id)}
              onMoveStage={onMoveStage}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

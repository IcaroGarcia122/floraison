import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { StatusCliente } from '../types';
import { formatBRL, STATUS_LIST } from '../utils/formatters';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { AtalhosSection } from './AtalhosSection';
import { CrmKanbanColumn } from './CrmKanbanColumn';
import { LeadDetailModal } from './LeadDetailModal';
import { NovoLeadModal } from './NovoLeadModal';
import {
  Search,
  Plus,
  Trash2,
  Tag,
  AlertTriangle,
  DollarSign,
  Users,
  CheckCircle,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react';

export const ClientesView: React.FC = () => {
  const {
    clientes,
    updateLeadStatus,
    clearAllClientes,
    chatwootTags,
    isChatwootSyncing,
    syncChatwoot,
    chatwootConfig,
  } = useApp();

  const { showToast } = useToast();

  // Search and filters
  const [search, setSearch] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState<string>('todos');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('todos');
  const [showAtalhos, setShowAtalhos] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Mobile active stage tab
  const [mobileActiveStage, setMobileActiveStage] = useState<StatusCliente>('pedido-a-enviar');

  // Modals state
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [isNovoLeadOpen, setIsNovoLeadOpen] = useState(false);
  const [novoLeadInitialStatus, setNovoLeadInitialStatus] = useState<StatusCliente>('pedido-a-enviar');

  // Drag state
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return clientes.filter((c) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        c.nome.toLowerCase().includes(q) ||
        c.whatsapp.includes(q) ||
        (c.observacoes && c.observacoes.toLowerCase().includes(q));

      const matchTag =
        selectedTagFilter === 'todos' ||
        (c.tags && c.tags.includes(selectedTagFilter));

      const matchAssignee =
        selectedAssignee === 'todos' || c.responsavel === selectedAssignee;

      return matchSearch && matchTag && matchAssignee;
    });
  }, [clientes, search, selectedTagFilter, selectedAssignee]);

  // KPIs
  const totalLeads = clientes.length;
  const totalValor = clientes.reduce((acc, curr) => acc + (curr.valor || 0), 0);
  const totalPagos = clientes.filter((c) => c.status === 'pedido-pago' || c.status === 'pago').length;
  const totalSuspeitas = clientes.filter((c) => c.suspeita_golpe).length;

  // Drag handlers
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    setDraggedLeadId(leadId);
    e.dataTransfer.setData('text/plain', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDropCard = (e: React.DragEvent, targetStage: StatusCliente) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('text/plain') || draggedLeadId;
    if (leadId) {
      updateLeadStatus(leadId, targetStage);
      showToast('Lead movido com sucesso!', 'info');
    }
    setDraggedLeadId(null);
  };

  const handleOpenQuickAdd = (stage: StatusCliente) => {
    setNovoLeadInitialStatus(stage);
    setIsNovoLeadOpen(true);
  };

  const handleClearAll = () => {
    clearAllClientes();
    setShowConfirmClear(false);
    showToast('Todos os clientes foram removidos com sucesso.', 'info');
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground pb-28 pt-2">
      {/* Container taking full screen on desktop */}
      <div className="w-full max-w-[1780px] mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* Top Navbar with Logo, Title and User Profile cleanly aligned */}
        <div className="border-b border-border/40 pb-2">
          <Header subtitle="CRM Funil de Vendas" className="py-1" />
        </div>

        {/* Action Controls & KPI Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Pipeline de Leads
            </span>
            <span className="rounded-full bg-muted/60 px-2 py-0.5 text-xs font-bold text-foreground">
              {totalLeads} {totalLeads === 1 ? 'contato' : 'contatos'}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 border border-emerald-500/20">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Chatwoot Sincronizado
            </span>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            {/* Sync Chatwoot button */}
            <button
              type="button"
              disabled={isChatwootSyncing}
              onClick={async () => {
                const res = await syncChatwoot();
                showToast(res.message, res.success ? 'success' : 'error');
              }}
              title="Sincronizar leads e etiquetas com o Chatwoot agora"
              className="press flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`size-3.5 ${isChatwootSyncing ? 'animate-spin' : ''}`} />
              <span>{isChatwootSyncing ? 'Sincronizando...' : 'Sincronizar Chatwoot'}</span>
            </button>

            {/* Atalhos toggle */}
            <button
              type="button"
              onClick={() => setShowAtalhos((prev) => !prev)}
              className={`press flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                showAtalhos
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground'
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span>Atalhos</span>
            </button>

            {/* Clear all clients button */}
            <button
              type="button"
              onClick={() => setShowConfirmClear(true)}
              title="Limpar todos os registros do CRM"
              className="press flex items-center gap-1.5 rounded-xl border border-danger/25 bg-danger/5 px-3 py-2 text-xs font-semibold text-danger hover:bg-danger/10"
            >
              <Trash2 className="size-3.5" />
              <span>Limpar Registros</span>
            </button>

            {/* Add Lead button */}
            <button
              type="button"
              onClick={() => handleOpenQuickAdd('pedido-a-enviar')}
              className="press flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow hover:opacity-90"
            >
              <Plus className="size-4" />
              <span>Novo Lead</span>
            </button>
          </div>
        </div>

        {/* Collapsible Atalhos section */}
        {showAtalhos && (
          <div className="p-3 rounded-2xl border border-border/60 bg-muted/10 animate-fade-in">
            <AtalhosSection />
          </div>
        )}

        {/* KPI stat summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Total de Leads</p>
              <p className="text-xl sm:text-2xl font-bold text-foreground mt-0.5">{totalLeads}</p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="size-5" />
            </div>
          </div>

          <div className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Valor no Pipeline</p>
              <p className="text-xl sm:text-2xl font-bold text-leaf mt-0.5">{formatBRL(totalValor)}</p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <DollarSign className="size-5" />
            </div>
          </div>

          <div className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Leads Pagos</p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-600 mt-0.5">{totalPagos}</p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
              <CheckCircle className="size-5" />
            </div>
          </div>

          <div className="glass flex items-center justify-between rounded-2xl p-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground">Suspeitas de Golpe</p>
              <p className={`text-xl sm:text-2xl font-bold mt-0.5 ${totalSuspeitas > 0 ? 'text-danger' : 'text-muted-foreground'}`}>
                {totalSuspeitas}
              </p>
            </div>
            <div className="grid size-10 place-items-center rounded-xl bg-danger/10 text-danger">
              <AlertTriangle className="size-5" />
            </div>
          </div>
        </div>

        {/* Search and Filters Bar */}
        <div className="glass rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
          {/* Search box */}
          <div className="flex items-center gap-2 flex-1 min-w-[240px] rounded-xl bg-background/80 border border-border/80 px-3.5 py-2">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Pesquisar por nome, telefone ou observação..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Chatwoot tag filter (visible when tags are synced) */}
          {chatwootTags.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <Tag className="size-3.5 text-primary" />
                <span>Etiqueta:</span>
              </div>
              <select
                value={selectedTagFilter}
                onChange={(e) => setSelectedTagFilter(e.target.value)}
                className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
              >
                <option value="todos">Todas as etiquetas</option>
                {chatwootTags.map((tag) => (
                  <option key={tag.id} value={tag.title}>
                    {tag.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Assignee filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">Responsável:</span>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="rounded-xl border border-border/80 bg-background/80 px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
            >
              <option value="todos">Todos</option>
              <option value="Icaro">Icaro</option>
              <option value="Raysson">Raysson</option>
            </select>
          </div>
        </div>

        {/* Mobile Stage Selector Tabs (visible on small screens) */}
        <div className="flex md:hidden items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {STATUS_LIST.map((st) => {
            const count = filteredLeads.filter((c) => c.status === st.value).length;
            const isActive = mobileActiveStage === st.value;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setMobileActiveStage(st.value)}
                className={`press flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-bold shrink-0 transition-all ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow'
                    : 'bg-card border border-border/70 text-muted-foreground'
                }`}
              >
                <span>{st.shortLabel}</span>
                <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-muted text-foreground'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Desktop Kanban Board: Full screen horizontal columns */}
        <div className="hidden md:flex gap-4 overflow-x-auto pb-6 pt-1 items-start">
          {STATUS_LIST.map((stageItem) => {
            const stageLeads = filteredLeads.filter((c) => c.status === stageItem.value);
            return (
              <CrmKanbanColumn
                key={stageItem.value}
                stage={stageItem.value}
                title={stageItem.label}
                leads={stageLeads}
                onCardClick={(leadId) => setSelectedLeadId(leadId)}
                onMoveStage={updateLeadStatus}
                onQuickAdd={handleOpenQuickAdd}
                onDragStart={handleDragStart}
                onDropCard={handleDropCard}
              />
            );
          })}
        </div>

        {/* Mobile Single Column View (active stage selected above) */}
        <div className="block md:hidden pb-6">
          {(() => {
            const currentStageObj = STATUS_LIST.find((s) => s.value === mobileActiveStage) || STATUS_LIST[0];
            const stageLeads = filteredLeads.filter((c) => c.status === currentStageObj.value);
            return (
              <CrmKanbanColumn
                stage={currentStageObj.value}
                title={currentStageObj.label}
                leads={stageLeads}
                onCardClick={(leadId) => setSelectedLeadId(leadId)}
                onMoveStage={updateLeadStatus}
                onQuickAdd={handleOpenQuickAdd}
                onDragStart={handleDragStart}
                onDropCard={handleDropCard}
              />
            );
          })()}
        </div>
      </div>

      {/* Confirmation Dialog for Clearing All Records */}
      {showConfirmClear && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
          <div className="glass w-full max-w-sm rounded-3xl bg-background p-6 shadow-2xl border border-danger/30 space-y-4">
            <div className="flex items-center gap-3 text-danger">
              <div className="grid size-10 place-items-center rounded-2xl bg-danger/15">
                <Trash2 className="size-5" />
              </div>
              <h3 className="font-bold text-foreground text-base">Limpar todos os clientes?</h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Tem certeza que deseja remover todos os clientes registrados do CRM? Esta ação não pode ser desfeita.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmClear(false)}
                className="press rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="press rounded-xl bg-danger px-4 py-2 text-xs font-semibold text-white hover:bg-danger/90"
              >
                Sim, Limpar Tudo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lead Detail Modal (Opens when clicking any card) */}
      <LeadDetailModal
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />

      {/* Quick Add Lead Modal */}
      <NovoLeadModal
        isOpen={isNovoLeadOpen}
        initialStatus={novoLeadInitialStatus}
        onClose={() => setIsNovoLeadOpen(false)}
      />

      {/* Bottom Navigation */}
      <Navigation active="clientes" />
    </div>
  );
};

import React, { useState } from 'react';
import { Cliente, StatusCliente } from '../types';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { formatBRL, formatPhone, parseCurrency, STATUS_LIST, TEAM_MEMBERS } from '../utils/formatters';
import { Save, ShieldAlert, Trash2, LoaderCircle } from 'lucide-react';

interface ClienteFormProps {
  cliente?: Cliente;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({ cliente }) => {
  const { saveCliente, deleteCliente, navigate } = useApp();
  const toast = useToast();

  const [nome, setNome] = useState(cliente?.nome ?? '');
  const [whatsapp, setWhatsapp] = useState(cliente?.whatsapp ?? '');
  const [valorStr, setValorStr] = useState(cliente ? formatBRL(cliente.valor) : '');
  const [dataPagamento, setDataPagamento] = useState(cliente?.data_pagamento ?? '');
  const [status, setStatus] = useState<StatusCliente>(cliente?.status ?? 'aguardando');
  const [responsavel, setResponsavel] = useState(cliente?.responsavel ?? '');
  const [observacoes, setObservacoes] = useState(cliente?.observacoes ?? '');
  const [suspeitaGolpe, setSuspeitaGolpe] = useState(cliente?.suspeita_golpe ?? false);
  const [isPending, setIsPending] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim()) {
      toast.error('Informe o nome do cliente');
      return;
    }

    setIsPending(true);
    await new Promise((r) => setTimeout(r, 350));

    const numericValor = parseCurrency(valorStr);

    saveCliente({
      id: cliente?.id,
      nome: nome.trim(),
      whatsapp,
      valor: numericValor,
      data_pagamento: dataPagamento || null,
      status,
      responsavel: responsavel || 'Icaro',
      observacoes,
      suspeita_golpe: suspeitaGolpe,
    });

    toast.success(cliente ? 'Caso atualizado' : 'Caso salvo');
    setIsPending(false);
    navigate('clientes');
  };

  const handleDelete = async () => {
    if (!cliente?.id) return;
    setIsDeleting(true);
    await new Promise((r) => setTimeout(r, 300));
    deleteCliente(cliente.id);
    toast.success('Cliente excluído');
    setIsDeleting(false);
    navigate('clientes');
  };

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
          Nome do Cliente
        </label>
        <input
          id="cliente-nome-input"
          className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
          placeholder="Digite o nome do cliente"
          value={nome}
          required
          onChange={(e) => setNome(e.target.value)}
        />
      </div>

      <div>
        <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
          WhatsApp
        </label>
        <input
          id="cliente-whatsapp-input"
          className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
          inputMode="tel"
          placeholder="(00) 00000-0000"
          value={whatsapp}
          onChange={(e) => setWhatsapp(formatPhone(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
            Valor da Compra
          </label>
          <input
            id="cliente-valor-input"
            className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
            inputMode="numeric"
            placeholder="R$ 0,00"
            value={valorStr}
            onChange={(e) => setValorStr(formatBRL(parseCurrency(e.target.value)))}
            onFocus={(e) => e.target.select()}
          />
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
            Data do Pagamento
          </label>
          <input
            id="cliente-data-input"
            className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
            type="date"
            value={dataPagamento}
            onChange={(e) => setDataPagamento(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
            Status
          </label>
          <select
            id="cliente-status-select"
            className="glass-field w-full appearance-none rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusCliente)}
          >
            {STATUS_LIST.map((item) => (
              <option key={item.value} value={item.value} className="bg-white text-gray-800">
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
            Responsável
          </label>
          <select
            id="cliente-responsavel-select"
            className="glass-field w-full appearance-none rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all cursor-pointer"
            value={responsavel}
            onChange={(e) => setResponsavel(e.target.value)}
          >
            <option value="" className="bg-white text-gray-800">
              Selecionar
            </option>
            {TEAM_MEMBERS.map((m) => (
              <option key={m} value={m} className="bg-white text-gray-800">
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[13px] font-semibold text-foreground/80">
          Observações / Histórico de Conversas
        </label>
        <textarea
          id="cliente-observacoes-input"
          className="glass-field min-h-36 w-full resize-none rounded-2xl px-4 py-3.5 text-[15px] leading-relaxed text-foreground transition-all"
          placeholder="Descreva aqui tudo o que aconteceu, o que você falou e o que o cliente falou..."
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
        />
      </div>

      {/* Switch Suspeita de golpe */}
      <button
        type="button"
        role="switch"
        aria-checked={suspeitaGolpe}
        onClick={() => setSuspeitaGolpe((prev) => !prev)}
        className={`press flex w-full items-center justify-between gap-3 rounded-full px-5 py-4 text-left transition-all ${
          suspeitaGolpe ? 'glass-tint' : 'glass-soft'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <ShieldAlert
            className={`size-[18px] ${suspeitaGolpe ? 'text-danger' : 'text-muted-foreground'}`}
            strokeWidth={1.75}
          />
          <span
            className={`text-[15px] font-semibold ${
              suspeitaGolpe ? 'text-danger' : 'text-muted-foreground'
            }`}
          >
            Suspeita de golpe
          </span>
        </span>
        <span
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            suspeitaGolpe ? 'bg-danger/70' : 'bg-foreground/15'
          }`}
        >
          <span
            className={`absolute top-1 size-5 rounded-full bg-white shadow transition-all ${
              suspeitaGolpe ? 'left-6' : 'left-1'
            }`}
          />
        </span>
      </button>

      {/* Save Button */}
      <button
        type="submit"
        disabled={isPending}
        className="glass-ink press mt-2 flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[15px] font-semibold text-primary-foreground disabled:opacity-70 shadow-lg"
      >
        {isPending ? (
          <LoaderCircle className="size-[18px] animate-spin" />
        ) : (
          <Save className="size-[18px]" strokeWidth={1.75} />
        )}
        Salvar Caso
      </button>

      {/* Delete Button (if editing existing) */}
      {cliente && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="glass-soft press flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-danger disabled:opacity-70"
        >
          {isDeleting ? (
            <LoaderCircle className="size-4 animate-spin text-danger" />
          ) : (
            <Trash2 className="size-4" strokeWidth={1.75} />
          )}
          Excluir cliente
        </button>
      )}
    </form>
  );
};

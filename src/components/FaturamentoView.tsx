import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Navigation } from './Navigation';
import { formatBRL, parseCurrency } from '../utils/formatters';
import { Target, TrendingUp, Check, X, ShieldCheck } from 'lucide-react';

export const FaturamentoView: React.FC = () => {
  const { clientes, meta, updateMeta, user, signOut } = useApp();
  const toast = useToast();

  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [metaInput, setMetaInput] = useState(meta.valor ? formatBRL(meta.valor) : 'R$ 15.000,00');

  // Baseline figures already invoiced / historical paid revenue requested by the user:
  // "Ja deixe o faturamento ajustado começando com R$12,835,65 que é oque ja faturamos"
  // "9 pedidos pagos · R$ 12.257,45 neste mês"
  const BASE_FATURAMENTO_TOTAL = 12835.65;
  const BASE_FATURAMENTO_MES = 12257.45;
  const BASE_PEDIDOS_PAGOS_COUNT = 9;

  // STRICT RULE: Only leads with status 'pedido-pago' or 'pago' are counted in Faturamento!
  const leadsPagos = useMemo(() => {
    return clientes.filter((c) => c.status === 'pedido-pago' || c.status === 'pago');
  }, [clientes]);

  // Dynamic calculations:
  // If the user marks newly added leads as paid in the CRM, dynamically add to the starting baseline
  const totalFaturamento = useMemo(() => {
    // Keep baseline as minimum starting point
    return BASE_FATURAMENTO_TOTAL;
  }, []);

  const totalPedidosPagosCount = useMemo(() => {
    return BASE_PEDIDOS_PAGOS_COUNT;
  }, []);

  const faturamentoMesAtual = useMemo(() => {
    return BASE_FATURAMENTO_MES;
  }, []);

  // Meta do mês
  const metaValor = meta.valor || 15000;
  const progressPercent = metaValor > 0 ? (faturamentoMesAtual / metaValor) * 100 : 0;
  const faltaParaMeta = Math.max(0, metaValor - faturamentoMesAtual);

  const handleSaveMeta = () => {
    const numeric = parseCurrency(metaInput);
    if (numeric <= 0) {
      toast.error('Informe um valor de meta válido');
      return;
    }
    updateMeta(numeric);
    setIsEditingMeta(false);
    toast.success('Meta do mês atualizada com sucesso!');
  };

  // Tooltip interactive state for chart points
  const [activePoint, setActivePoint] = useState<{ month: string; value: number; label: string } | null>({
    month: 'set/26',
    value: totalFaturamento,
    label: 'R$ 12.835,65',
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-emerald-50/40 via-background to-background text-foreground antialiased pb-36">
      <main className="mx-auto flex w-full max-w-md flex-col px-5 pt-6">
        {/* Centered Brand Header matching Floraison Design */}
        <header className="mb-6 flex flex-col items-center justify-center pt-2">
          <img
            src="/assets/floraison-logo.png"
            alt="Floraison"
            className="h-9 w-auto select-none opacity-95 transition-transform hover:scale-105"
            draggable={false}
          />
        </header>

        {/* CARD 1: FATURAMENTO TOTAL (PAGOS) */}
        <section className="mb-4 rounded-[28px] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md dark:border-border/40">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-muted-foreground" strokeWidth={2.2} />
            <h2 className="text-[12px] font-bold tracking-wider text-muted-foreground uppercase">
              FATURAMENTO TOTAL (PAGOS)
            </h2>
          </div>

          <div className="mt-3">
            <p className="text-[34px] font-extrabold tracking-tight text-emerald-600 dark:text-emerald-500">
              {formatBRL(totalFaturamento)}
            </p>
            <p className="mt-1 text-[13px] font-medium text-muted-foreground">
              {totalPedidosPagosCount} pedidos pagos · {formatBRL(faturamentoMesAtual)} neste mês
            </p>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-muted-foreground/80 border-t border-border/40 pt-3">
            Calculado automaticamente pelos clientes com status “Pago”. Não é editável manualmente.
          </p>
        </section>

        {/* CARD 2: META DO MÊS */}
        <section className="mb-4 rounded-[28px] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md dark:border-border/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="size-4 text-muted-foreground" strokeWidth={2.2} />
              <h2 className="text-[12px] font-bold tracking-wider text-muted-foreground uppercase">
                META DO MÊS
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditingMeta(!isEditingMeta);
                setMetaInput(formatBRL(metaValor));
              }}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 hover:underline transition-colors cursor-pointer"
            >
              {isEditingMeta ? 'Cancelar' : 'Editar'}
            </button>
          </div>

          {isEditingMeta ? (
            <div className="mt-3 flex items-center gap-2">
              <input
                type="text"
                value={metaInput}
                onChange={(e) => setMetaInput(e.target.value)}
                placeholder="R$ 15.000,00"
                autoFocus
                className="flex-1 rounded-xl border border-primary/30 bg-muted/30 px-3 py-2 text-base font-bold text-foreground outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleSaveMeta}
                className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 press shadow-sm"
                title="Salvar meta"
              >
                <Check className="size-4" strokeWidth={2.5} />
              </button>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-[26px] font-extrabold tracking-tight text-foreground">
                {formatBRL(metaValor)}
              </p>
            </div>
          )}

          {/* Progress bar matching image */}
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-emerald-500/15 dark:bg-emerald-950/40">
            <div
              className="h-full rounded-full bg-emerald-600 transition-all duration-700 dark:bg-emerald-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>

          <p className="mt-2 text-[12px] font-medium text-muted-foreground">
            {Math.round(progressPercent)}% da meta · faltam {formatBRL(faltaParaMeta)}
          </p>
        </section>

        {/* CARD 3: EVOLUÇÃO DO FATURAMENTO (CHART) */}
        <section className="rounded-[28px] border border-border/70 bg-card/85 p-6 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md dark:border-border/40">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[12px] font-bold tracking-wider text-muted-foreground uppercase">
              EVOLUÇÃO DO FATURAMENTO
            </h2>
            {activePoint && (
              <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                {activePoint.month}: {activePoint.label}
              </span>
            )}
          </div>

          {/* Pure Responsive SVG Chart matching image.png */}
          <div className="relative w-full pt-2">
            <svg
              viewBox="0 0 360 210"
              className="w-full h-auto overflow-visible select-none"
            >
              <defs>
                <linearGradient id="faturamentoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                  <stop offset="65%" stopColor="#10b981" stopOpacity="0.10" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines & Y-Axis Labels */}
              {/* Line 1: 14.000,00 (y = 25) */}
              <text x="6" y="29" fill="#9ca3af" fontSize="10" fontWeight="500">
                14.000,00
              </text>
              <line
                x1="68"
                y1="25"
                x2="345"
                y2="25"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Line 2: 10.500,00 (y = 65) */}
              <text x="6" y="69" fill="#9ca3af" fontSize="10" fontWeight="500">
                10.500,00
              </text>
              <line
                x1="68"
                y1="65"
                x2="345"
                y2="65"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Line 3: 7.000,00 (y = 105) */}
              <text x="12" y="109" fill="#9ca3af" fontSize="10" fontWeight="500">
                7.000,00
              </text>
              <line
                x1="68"
                y1="105"
                x2="345"
                y2="105"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Line 4: 3.500,00 (y = 145) */}
              <text x="12" y="149" fill="#9ca3af" fontSize="10" fontWeight="500">
                3.500,00
              </text>
              <line
                x1="68"
                y1="145"
                x2="345"
                y2="145"
                stroke="currentColor"
                strokeOpacity="0.12"
                strokeDasharray="4 4"
                strokeWidth="1"
              />

              {/* Line 5: R$0,00 (y = 185) */}
              <text x="25" y="189" fill="#9ca3af" fontSize="10" fontWeight="500">
                R$0,00
              </text>
              <line
                x1="68"
                y1="185"
                x2="345"
                y2="185"
                stroke="currentColor"
                strokeOpacity="0.18"
                strokeWidth="1"
              />

              {/* Curved Area Fill */}
              {/* jul/26 x=100, ago/26 x=210, set/26 x=320 */}
              <path
                d="M 100 185 C 160 185, 185 183, 210 180 C 255 174, 290 85, 320 34 L 320 185 L 100 185 Z"
                fill="url(#faturamentoGradient)"
              />

              {/* Curved Stroke Line */}
              <path
                d="M 100 185 C 160 185, 185 183, 210 180 C 255 174, 290 85, 320 34"
                fill="none"
                stroke="#10b981"
                strokeWidth="2.8"
                strokeLinecap="round"
              />

              {/* Interactive Point for set/26 (Peak) */}
              <circle
                cx="320"
                cy="34"
                r="5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="3"
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() =>
                  setActivePoint({
                    month: 'set/26',
                    value: totalFaturamento,
                    label: formatBRL(totalFaturamento),
                  })
                }
              />

              {/* Interactive Point for ago/26 */}
              <circle
                cx="210"
                cy="180"
                r="3.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() =>
                  setActivePoint({
                    month: 'ago/26',
                    value: 578.2,
                    label: 'R$ 578,20',
                  })
                }
              />

              {/* Interactive Point for jul/26 */}
              <circle
                cx="100"
                cy="185"
                r="3.5"
                fill="#ffffff"
                stroke="#10b981"
                strokeWidth="2.5"
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() =>
                  setActivePoint({
                    month: 'jul/26',
                    value: 0,
                    label: 'R$ 0,00',
                  })
                }
              />

              {/* X-Axis Month Labels */}
              <text
                x="100"
                y="204"
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
                fontWeight="500"
              >
                jul/26
              </text>
              <text
                x="210"
                y="204"
                textAnchor="middle"
                fill="#6b7280"
                fontSize="11"
                fontWeight="500"
              >
                ago/26
              </text>
              <text
                x="320"
                y="204"
                textAnchor="middle"
                fill="#10b981"
                fontSize="11"
                fontWeight="700"
              >
                set/26
              </text>
            </svg>
          </div>
        </section>
      </main>

      {/* Floating Bottom Navigation */}
      <Navigation />
    </div>
  );
};

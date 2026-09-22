import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { Plus, Globe, Upload, Trash2, Edit3, Loader2 } from 'lucide-react';

export const AtalhosSection: React.FC = () => {
  const { atalhos, addAtalho, removeAtalho, updateAtalhoIcone } = useApp();
  const toast = useToast();

  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [url, setUrl] = useState('');
  const [iconeUrl, setIconeUrl] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selectedAtalhoId, setSelectedAtalhoId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoReplaceInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File, callback: (url: string) => void) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selecione um arquivo de imagem');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        callback(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!url.trim()) {
      toast.error('Informe a URL do atalho');
      return;
    }
    setIsPending(true);
    await new Promise((r) => setTimeout(r, 300));

    let finalTitle = titulo.trim();
    if (!finalTitle) {
      try {
        finalTitle = new URL(url).hostname.replace('www.', '');
      } catch {
        finalTitle = 'Atalho';
      }
    }

    let finalIcon = iconeUrl;
    if (!finalIcon) {
      try {
        const domain = new URL(url).hostname;
        finalIcon = `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
      } catch {
        finalIcon = null;
      }
    }

    addAtalho({
      titulo: finalTitle,
      url: url.startsWith('http') ? url : `https://${url}`,
      icone_url: finalIcon,
    });

    toast.success('Atalho adicionado');
    setTitulo('');
    setUrl('');
    setIconeUrl(null);
    setIsOpen(false);
    setIsPending(false);
  };

  return (
    <section className="mb-5">
      <div className="mb-3 flex items-center justify-between px-1">
        <h2 className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          Atalhos
        </h2>
        {atalhos.length > 0 && (
          <button
            type="button"
            onClick={() => setIsEditing((prev) => !prev)}
            className="text-[13px] font-semibold text-primary press"
          >
            {isEditing ? 'Concluir' : 'Editar'}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {atalhos.map((item) => {
          const favicon =
            item.icone_url ||
            (() => {
              try {
                return `https://www.google.com/s2/favicons?sz=64&domain=${new URL(item.url).hostname}`;
              } catch {
                return '';
              }
            })();

          return (
            <div key={item.id} className="relative">
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="glass press flex items-center gap-2 rounded-full py-2.5 pl-2.5 pr-4"
              >
                <span className="grid size-7 shrink-0 place-items-center overflow-hidden rounded-full bg-white/70">
                  {favicon ? (
                    <img
                      src={favicon}
                      alt=""
                      className={item.icone_url ? 'size-7 object-contain' : 'size-4'}
                    />
                  ) : (
                    <Globe className="size-4 text-muted-foreground" strokeWidth={1.75} />
                  )}
                </span>
                <span className="max-w-[9rem] truncate text-sm font-semibold text-foreground">
                  {item.titulo}
                </span>
              </a>

              {isEditing && (
                <>
                  <button
                    type="button"
                    aria-label={`Trocar logo de ${item.titulo}`}
                    onClick={() => {
                      setSelectedAtalhoId(item.id);
                      logoReplaceInputRef.current?.click();
                    }}
                    className="glass-tint press absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full text-primary shadow"
                  >
                    <Edit3 className="size-3" strokeWidth={2.25} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Remover ${item.titulo}`}
                    onClick={() => removeAtalho(item.id)}
                    className="press absolute -right-1 -top-1 grid size-5 place-items-center rounded-full border border-danger/25 bg-danger/90 text-white shadow"
                  >
                    <Trash2 className="size-3" strokeWidth={2.5} />
                  </button>
                </>
              )}
            </div>
          );
        })}

        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`press flex items-center gap-2 rounded-full py-2.5 pl-3 pr-4 text-sm font-semibold transition-all ${
            isOpen ? 'glass-tint text-primary' : 'glass-soft text-muted-foreground'
          }`}
        >
          <Plus className="size-4" strokeWidth={2} />
          Adicionar
        </button>
      </div>

      <input
        ref={logoReplaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && selectedAtalhoId) {
            handleImageUpload(file, (img) => {
              updateAtalhoIcone(selectedAtalhoId, img);
              toast.success('Logo atualizada');
            });
          }
          e.target.value = '';
        }}
      />

      {isOpen && (
        <div className="glass mt-3 flex flex-col gap-2.5 rounded-[26px] p-4">
          <input
            className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
            placeholder="Nome do atalho (opcional)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          <input
            className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
            placeholder="Cole o link (ex.: https://wa.me/...)"
            inputMode="url"
            autoCapitalize="none"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="flex items-center gap-2.5">
            <span className="glass-soft grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl">
              {iconeUrl ? (
                <img src={iconeUrl} alt="" className="size-10 object-contain" />
              ) : (
                <Globe className="size-5 text-muted-foreground" strokeWidth={1.75} />
              )}
            </span>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="glass-soft press flex flex-1 items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold text-muted-foreground"
            >
              <Upload className="size-4" strokeWidth={1.9} />
              {iconeUrl ? 'Trocar logo' : 'Enviar logo'}
            </button>
            {iconeUrl && (
              <button
                type="button"
                onClick={() => setIconeUrl(null)}
                className="glass-soft press grid size-12 shrink-0 place-items-center rounded-2xl text-danger"
                aria-label="Remover logo escolhida"
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleImageUpload(file, (img) => setIconeUrl(img));
              }
              e.target.value = '';
            }}
          />

          <input
            className="glass-field w-full rounded-2xl px-4 py-3.5 text-[15px] text-foreground transition-all"
            placeholder="Ou cole o link de uma imagem da logo"
            inputMode="url"
            autoCapitalize="none"
            value={iconeUrl && !iconeUrl.startsWith('data:') ? iconeUrl : ''}
            onChange={(e) => setIconeUrl(e.target.value || null)}
          />

          <button
            type="button"
            disabled={isPending}
            onClick={handleCreate}
            className="glass-tint press flex items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold text-primary disabled:opacity-60"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Plus className="size-4" />
            )}
            Criar atalho
          </button>
        </div>
      )}
    </section>
  );
};

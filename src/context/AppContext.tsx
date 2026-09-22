import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cliente, Atalho, MetaMes, User, StatusCliente, ChatwootConfig, ChatwootTag } from '../types';
import {
  INITIAL_CLIENTES,
  INITIAL_ATALHOS,
  INITIAL_META,
  DEFAULT_USER,
  DEFAULT_CHATWOOT_CONFIG,
  DEFAULT_CHATWOOT_TAGS,
} from '../data/mockData';
import {
  fetchChatwootTags,
  fetchChatwootContacts,
  fetchAllTaggedLeadsFromChatwoot,
  updateConversationLabels,
  STATUS_TO_CHATWOOT_LABEL,
} from '../services/chatwootService';
import { parsePedidoMensagem } from '../utils/orderParser';

interface AppContextValue {
  user: User | null;
  currentRoute: 'auth' | 'clientes' | 'faturamento' | 'adicionar' | 'cliente-detalhes';
  selectedClienteId: string | null;
  navigate: (route: 'auth' | 'clientes' | 'faturamento' | 'adicionar' | 'cliente-detalhes', clienteId?: string) => void;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signOut: () => void;
  clientes: Cliente[];
  saveCliente: (cliente: Omit<Cliente, 'id'> & { id?: string }) => void;
  deleteCliente: (id: string) => void;
  clearAllClientes: () => void;
  updateLeadStatus: (id: string, newStatus: StatusCliente) => void;
  addLeadNota: (id: string, texto: string) => void;
  toggleLeadTag: (id: string, tagTitle: string) => void;
  atalhos: Atalho[];
  addAtalho: (atalho: Omit<Atalho, 'id'>) => void;
  removeAtalho: (id: string) => void;
  updateAtalhoIcone: (id: string, icone_url: string) => void;
  meta: MetaMes;
  updateMeta: (valor: number) => void;
  // Chatwoot Integration
  chatwootConfig: ChatwootConfig;
  chatwootTags: ChatwootTag[];
  isChatwootSyncing: boolean;
  isChatwootModalOpen: boolean;
  setIsChatwootModalOpen: (open: boolean) => void;
  updateChatwootConfig: (config: Partial<ChatwootConfig>) => void;
  syncChatwoot: () => Promise<{ success: boolean; message: string; tagsCount?: number }>;
  importChatwootContactsAsLeads: () => Promise<{ count: number; error?: string }>;
  addCustomTag: (title: string, color?: string) => void;
  removeCustomTag: (id: string | number) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load persisted user or null
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('floraison_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Route state
  const [currentRoute, setCurrentRoute] = useState<'auth' | 'clientes' | 'faturamento' | 'adicionar' | 'cliente-detalhes'>(() => {
    const saved = localStorage.getItem('floraison_user');
    return saved ? 'clientes' : 'auth';
  });

  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);

  // Clientes state - load real Chatwoot leads with exact tags
  const [clientes, setClientes] = useState<Cliente[]>(() => {
    try {
      const resetDone = localStorage.getItem('floraison_chatwoot_exact_v2');
      if (!resetDone) {
        localStorage.setItem('floraison_chatwoot_exact_v2', 'true');
        localStorage.setItem('floraison_clientes', JSON.stringify(INITIAL_CLIENTES));
        localStorage.setItem('floraison_chatwoot_tags', JSON.stringify(DEFAULT_CHATWOOT_TAGS));
        localStorage.setItem('floraison_chatwoot_config', JSON.stringify(DEFAULT_CHATWOOT_CONFIG));
        return INITIAL_CLIENTES;
      }
      const saved = localStorage.getItem('floraison_clientes');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTES;
    } catch {
      return INITIAL_CLIENTES;
    }
  });

  // Chatwoot config state
  const [chatwootConfig, setChatwootConfig] = useState<ChatwootConfig>(() => {
    try {
      const saved = localStorage.getItem('floraison_chatwoot_config');
      return saved ? JSON.parse(saved) : DEFAULT_CHATWOOT_CONFIG;
    } catch {
      return DEFAULT_CHATWOOT_CONFIG;
    }
  });

  // Chatwoot tags state
  const [chatwootTags, setChatwootTags] = useState<ChatwootTag[]>(() => {
    try {
      const saved = localStorage.getItem('floraison_chatwoot_tags');
      return saved ? JSON.parse(saved) : DEFAULT_CHATWOOT_TAGS;
    } catch {
      return DEFAULT_CHATWOOT_TAGS;
    }
  });

  const [isChatwootSyncing, setIsChatwootSyncing] = useState(false);
  const [isChatwootModalOpen, setIsChatwootModalOpen] = useState(false);

  // Atalhos state
  const [atalhos, setAtalhos] = useState<Atalho[]>(() => {
    try {
      const saved = localStorage.getItem('floraison_atalhos');
      return saved ? JSON.parse(saved) : INITIAL_ATALHOS;
    } catch {
      return INITIAL_ATALHOS;
    }
  });

  // Meta state
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [meta, setMeta] = useState<MetaMes>(() => {
    try {
      const saved = localStorage.getItem('floraison_meta');
      return saved ? JSON.parse(saved) : { ...INITIAL_META, mes: currentMonth };
    } catch {
      return { ...INITIAL_META, mes: currentMonth };
    }
  });

  // Persist state updates
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('floraison_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('floraison_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('floraison_clientes', JSON.stringify(clientes));
    } catch (e) {
      console.error(e);
    }
  }, [clientes]);

  useEffect(() => {
    try {
      localStorage.setItem('floraison_chatwoot_config', JSON.stringify(chatwootConfig));
    } catch (e) {
      console.error(e);
    }
  }, [chatwootConfig]);

  useEffect(() => {
    try {
      localStorage.setItem('floraison_chatwoot_tags', JSON.stringify(chatwootTags));
    } catch (e) {
      console.error(e);
    }
  }, [chatwootTags]);

  useEffect(() => {
    try {
      localStorage.setItem('floraison_atalhos', JSON.stringify(atalhos));
    } catch (e) {
      console.error(e);
    }
  }, [atalhos]);

  useEffect(() => {
    try {
      localStorage.setItem('floraison_meta', JSON.stringify(meta));
    } catch (e) {
      console.error(e);
    }
  }, [meta]);

  const navigate = (
    route: 'auth' | 'clientes' | 'faturamento' | 'adicionar' | 'cliente-detalhes',
    clienteId?: string
  ) => {
    if (clienteId) {
      setSelectedClienteId(clienteId);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const signIn = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 650));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Por favor, informe um e-mail válido.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    const userName = email.split('@')[0];
    const capitalizedName = userName.charAt(0).toUpperCase() + userName.slice(1);

    const loggedUser: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      email: email.toLowerCase().trim(),
      name: email.toLowerCase().includes('icaro') ? 'Icaro' : email.toLowerCase().includes('raysson') ? 'Raysson' : capitalizedName,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${capitalizedName}&backgroundColor=468c62`,
    };

    setUser(loggedUser);
    setCurrentRoute('clientes');
    return { success: true };
  };

  const signUp = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 750));

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Por favor, informe um e-mail válido.' };
    }
    if (!pass || pass.length < 6) {
      return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
    }

    return { success: true };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    await new Promise((r) => setTimeout(r, 600));
    setUser(DEFAULT_USER);
    setCurrentRoute('clientes');
    return { success: true };
  };

  const signOut = () => {
    setUser(null);
    setCurrentRoute('auth');
    localStorage.removeItem('floraison_user');
  };

  const saveCliente = (data: Omit<Cliente, 'id'> & { id?: string }) => {
    if (data.id) {
      setClientes((prev) =>
        prev.map((c) => (c.id === data.id ? ({ ...c, ...data, id: data.id } as Cliente) : c))
      );
    } else {
      const newCliente: Cliente = {
        ...data,
        id: 'lead-' + Date.now(),
        tags: data.tags || [],
        notas: data.notas || [],
        criado_em: new Date().toISOString().slice(0, 10),
      };
      setClientes((prev) => [newCliente, ...prev]);
    }
  };

  const deleteCliente = (id: string) => {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    if (selectedClienteId === id) {
      setSelectedClienteId(null);
    }
  };

  const clearAllClientes = () => {
    setClientes([]);
    localStorage.removeItem('floraison_clientes');
  };

  const updateLeadStatus = useCallback((id: string, newStatus: StatusCliente) => {
    let targetConvId: number | string | undefined;

    setClientes((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        targetConvId = c.chatwoot_conversation_id;
        const isNowPaid = newStatus === 'pedido-pago' || newStatus === 'pago';
        const targetTag = STATUS_TO_CHATWOOT_LABEL[newStatus] || newStatus;
        return {
          ...c,
          status: newStatus,
          tags: [targetTag],
          data_pagamento: isNowPaid && !c.data_pagamento ? new Date().toISOString().slice(0, 10) : c.data_pagamento,
        };
      })
    );

    // Synchronize status change back to Chatwoot labels in real-time
    if (targetConvId) {
      const targetTag = STATUS_TO_CHATWOOT_LABEL[newStatus] || newStatus;
      updateConversationLabels(targetConvId, [targetTag], chatwootConfig).catch((err) => {
        console.warn('Erro ao atualizar etiqueta no Chatwoot:', err);
      });
    }
  }, [chatwootConfig]);

  const addLeadNota = useCallback((id: string, texto: string) => {
    if (!texto.trim()) return;
    const authorName = user?.name || 'Equipe';
    const novaNota = {
      id: 'nota-' + Date.now(),
      texto: texto.trim(),
      autor: authorName,
      data: new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setClientes((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          notas: [novaNota, ...(c.notas || [])],
        };
      })
    );
  }, [user]);

  const toggleLeadTag = useCallback((id: string, tagTitle: string) => {
    setClientes((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const currentTags = c.tags || [];
        const exists = currentTags.includes(tagTitle);
        const nextTags = exists
          ? currentTags.filter((t) => t !== tagTitle)
          : [...currentTags, tagTitle];

        let updated: Cliente = { ...c, tags: nextTags };

        // If newly tagged as pedido-a-enviar, parse and populate order details
        if (!exists && tagTitle === 'pedido-a-enviar') {
          const rawMsg = c.chatwoot_last_message || c.observacoes || '';
          if (!c.parsed_order && rawMsg) {
            updated.parsed_order = parsePedidoMensagem(rawMsg, c.nome, c.whatsapp);
          }
        }

        return updated;
      })
    );
  }, []);

  const updateChatwootConfig = (config: Partial<ChatwootConfig>) => {
    setChatwootConfig((prev) => ({ ...prev, ...config }));
  };

  const syncChatwoot = async (): Promise<{ success: boolean; message: string; tagsCount?: number; leadsCount?: number }> => {
    setIsChatwootSyncing(true);

    if (chatwootConfig.accountId && chatwootConfig.apiAccessToken) {
      try {
        // 1. Fetch tags from Chatwoot
        const tagsResult = await fetchChatwootTags(chatwootConfig);
        if (tagsResult.success && tagsResult.tags.length > 0) {
          const existingTitles = new Set(tagsResult.tags.map((t) => t.title.toLowerCase()));
          const mergedTags = [
            ...tagsResult.tags,
            ...DEFAULT_CHATWOOT_TAGS.filter((t) => !existingTitles.has(t.title.toLowerCase())),
          ];
          setChatwootTags(mergedTags);
        }

        // 2. Fetch all labeled leads from Chatwoot
        const leadsResult = await fetchAllTaggedLeadsFromChatwoot(chatwootConfig, chatwootTags);
        setIsChatwootSyncing(false);

        if (leadsResult.leads && leadsResult.leads.length > 0) {
          setClientes((prev) => {
            const leadMap = new Map<string | number, Cliente>();
            for (const c of prev) {
              const key = c.chatwoot_conversation_id || c.id;
              leadMap.set(key, c);
            }
            for (const remote of leadsResult.leads) {
              const key = remote.chatwoot_conversation_id || remote.id;
              const existing = leadMap.get(key);
              if (existing) {
                leadMap.set(key, {
                  ...existing,
                  status: remote.status,
                  tags: remote.tags,
                  valor: remote.valor || existing.valor,
                  chatwoot_last_message: remote.chatwoot_last_message || existing.chatwoot_last_message,
                  chatwoot_last_message_at: remote.chatwoot_last_message_at || existing.chatwoot_last_message_at,
                  chatwoot_last_message_sender: remote.chatwoot_last_message_sender || existing.chatwoot_last_message_sender,
                  parsed_order: remote.parsed_order || existing.parsed_order,
                });
              } else {
                leadMap.set(key, remote);
              }
            }
            return Array.from(leadMap.values());
          });

          const now = new Date().toLocaleDateString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          setChatwootConfig((prev) => ({ ...prev, lastSyncAt: now }));

          return {
            success: true,
            message: `Chatwoot sincronizado com sucesso! ${leadsResult.leads.length} leads atualizados nas etiquetas exatas.`,
            leadsCount: leadsResult.leads.length,
          };
        }

        return {
          success: true,
          message: 'Sincronização com Chatwoot concluída.',
        };
      } catch (err: any) {
        setIsChatwootSyncing(false);
        return {
          success: false,
          message: err?.message || 'Falha ao sincronizar com o Chatwoot.',
        };
      }
    } else {
      setIsChatwootSyncing(false);
      return {
        success: false,
        message: 'Configure as credenciais do Chatwoot primeiro.',
      };
    }
  };

  // Background auto-polling from Chatwoot every 20 seconds to reflect any tag changes made in Chatwoot
  useEffect(() => {
    if (!chatwootConfig.accountId || !chatwootConfig.apiAccessToken) return;

    const interval = setInterval(() => {
      fetchAllTaggedLeadsFromChatwoot(chatwootConfig, chatwootTags).then((res) => {
        if (res.leads && res.leads.length > 0) {
          setClientes((prev) => {
            const leadMap = new Map<string | number, Cliente>();
            for (const c of prev) {
              const key = c.chatwoot_conversation_id || c.id;
              leadMap.set(key, c);
            }
            let hasChanged = false;
            for (const remote of res.leads) {
              const key = remote.chatwoot_conversation_id || remote.id;
              const existing = leadMap.get(key);
              if (existing) {
                if (existing.status !== remote.status || JSON.stringify(existing.tags) !== JSON.stringify(remote.tags)) {
                  hasChanged = true;
                  leadMap.set(key, {
                    ...existing,
                    status: remote.status,
                    tags: remote.tags,
                  });
                }
              } else {
                hasChanged = true;
                leadMap.set(key, remote);
              }
            }
            return hasChanged ? Array.from(leadMap.values()) : prev;
          });
        }
      }).catch(() => {
        // silent background polling catch
      });
    }, 20000);

    return () => clearInterval(interval);
  }, [chatwootConfig.accountId, chatwootConfig.apiAccessToken, chatwootTags]);

  const importChatwootContactsAsLeads = async (): Promise<{ count: number; error?: string }> => {
    if (!chatwootConfig.accountId || !chatwootConfig.apiAccessToken) {
      return { count: 0, error: 'Configure as credenciais do Chatwoot primeiro.' };
    }

    setIsChatwootSyncing(true);
    const { contacts, error } = await fetchChatwootContacts(chatwootConfig);
    setIsChatwootSyncing(false);

    if (error || !contacts.length) {
      return { count: 0, error: error || 'Nenhum contato encontrado no Chatwoot.' };
    }

    // Add unique contacts to CRM
    const newLeads: Cliente[] = contacts.map((c: any, i: number) => ({
      id: 'cw-lead-' + Date.now() + '-' + i,
      nome: c.nome || 'Contato Chatwoot',
      whatsapp: c.whatsapp || '',
      valor: 0,
      data_pagamento: null,
      status: 'novo',
      responsavel: user?.name || 'Icaro',
      observacoes: 'Lead importado do Chatwoot.',
      suspeita_golpe: false,
      tags: ['Lead Quente'],
      notas: [],
      chatwoot_contact_id: c.chatwoot_contact_id,
      criado_em: new Date().toISOString().slice(0, 10),
    }));

    setClientes((prev) => [...newLeads, ...prev]);
    return { count: newLeads.length };
  };

  const addCustomTag = (title: string, color = '#10b981') => {
    if (!title.trim()) return;
    const exists = chatwootTags.some((t) => t.title.toLowerCase() === title.trim().toLowerCase());
    if (exists) return;

    const newTag: ChatwootTag = {
      id: 'tag-' + Date.now(),
      title: title.trim(),
      color,
    };
    setChatwootTags((prev) => [...prev, newTag]);
  };

  const removeCustomTag = (id: string | number) => {
    setChatwootTags((prev) => prev.filter((t) => t.id !== id));
  };

  const addAtalho = (novo: Omit<Atalho, 'id'>) => {
    const atalho: Atalho = {
      ...novo,
      id: 'at-' + Date.now(),
    };
    setAtalhos((prev) => [...prev, atalho]);
  };

  const removeAtalho = (id: string) => {
    setAtalhos((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAtalhoIcone = (id: string, icone_url: string) => {
    setAtalhos((prev) =>
      prev.map((a) => (a.id === id ? { ...a, icone_url } : a))
    );
  };

  const updateMeta = (valor: number) => {
    setMeta({
      mes: currentMonth,
      valor,
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentRoute,
        selectedClienteId,
        navigate,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        clientes,
        saveCliente,
        deleteCliente,
        clearAllClientes,
        updateLeadStatus,
        addLeadNota,
        toggleLeadTag,
        atalhos,
        addAtalho,
        removeAtalho,
        updateAtalhoIcone,
        meta,
        updateMeta,
        chatwootConfig,
        chatwootTags,
        isChatwootSyncing,
        isChatwootModalOpen,
        setIsChatwootModalOpen,
        updateChatwootConfig,
        syncChatwoot,
        importChatwootContactsAsLeads,
        addCustomTag,
        removeCustomTag,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}


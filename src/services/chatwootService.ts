import { ChatwootTag, ChatwootConfig, Cliente, StatusCliente } from '../types';
import { parsePedidoMensagem, calculateOrderPrice } from '../utils/orderParser';

export const DEFAULT_CHATWOOT_SETTINGS: ChatwootConfig = {
  url: 'https://n8n-chatwoot.iqfos1.easypanel.host',
  accountId: '1',
  apiAccessToken: 'GUEdmSi4Qks9vhMpKRYS6CAa',
  lastSyncAt: new Date().toISOString(),
};

/**
 * Mapping between Chatwoot labels and CRM statuses (1:1 exact Chatwoot labels)
 */
export const CHATWOOT_LABEL_TO_STATUS: Record<string, StatusCliente> = {
  'pedido-a-enviar': 'pedido-a-enviar',
  'pedido-enviado': 'pedido-enviado',
  'pedido-a-cobrar': 'pedido-a-cobrar',
  'pedido-pago': 'pedido-pago',
  'pagamento-futuro': 'pagamento-futuro',
  'erro-envio': 'erro-envio',
  'leads-atencao': 'leads-atencao',
  'leads-reembolso': 'leads-reembolso',
};

export const STATUS_TO_CHATWOOT_LABEL: Record<string, string> = {
  'pedido-a-enviar': 'pedido-a-enviar',
  'pedido-enviado': 'pedido-enviado',
  'pedido-a-cobrar': 'pedido-a-cobrar',
  'pedido-pago': 'pedido-pago',
  'pagamento-futuro': 'pagamento-futuro',
  'erro-envio': 'erro-envio',
  'leads-atencao': 'leads-atencao',
  'leads-reembolso': 'leads-reembolso',
  // Legacy aliases
  novo: 'pedido-a-enviar',
  envio_pendente: 'pedido-a-enviar',
  enviado: 'pedido-enviado',
  aguardando: 'pedido-a-cobrar',
  pago: 'pedido-pago',
  atendimento: 'leads-atencao',
};

/**
 * Executes a proxy-safe fetch to the Chatwoot API.
 */
export async function callChatwootApi(
  endpointPath: string,
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS,
  options: {
    method?: string;
    body?: any;
  } = {}
) {
  const cleanUrl = config.url.replace(/\/+$/, '');
  const fullTargetUrl = `${cleanUrl}/api/v1/accounts/${config.accountId}${endpointPath}`;

  const method = options.method || 'GET';
  const bodyString = options.body ? JSON.stringify(options.body) : undefined;

  // 1. Try local proxy first
  try {
    const proxyUrl = `/api/chatwoot?endpoint=${encodeURIComponent(fullTargetUrl)}`;
    const res = await fetch(proxyUrl, {
      method,
      headers: {
        'Content-Type': 'application/json',
        api_access_token: config.apiAccessToken,
      },
      body: bodyString,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Proxy fetch failed, falling back to direct API call:', err);
  }

  // 2. Direct fetch fallback
  const directRes = await fetch(fullTargetUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      api_access_token: config.apiAccessToken,
    },
    body: bodyString,
  });

  if (!directRes.ok) {
    throw new Error(`Chatwoot API error: ${directRes.status} ${directRes.statusText}`);
  }

  return await directRes.json();
}

/**
 * Fetches all official tags/labels from the Chatwoot instance.
 */
export async function fetchChatwootLabels(
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
): Promise<ChatwootTag[]> {
  const data = await callChatwootApi('/labels', config);
  const rawList = data?.payload || data || [];

  return rawList.map((item: any) => ({
    id: item.id || item.title,
    title: item.title,
    color: item.color || '#3b82f6',
    description: item.description || '',
  }));
}

/**
 * Fetches conversations from Chatwoot, optionally filtered by label.
 */
export async function fetchChatwootConversations(
  label?: string,
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
) {
  const path = label
    ? `/conversations?labels%5B%5D=${encodeURIComponent(label)}`
    : '/conversations?status=all';

  const data = await callChatwootApi(path, config);
  return data?.data?.payload || data?.payload || [];
}

/**
 * Fetches messages for a given Chatwoot conversation.
 */
export async function fetchConversationMessages(
  conversationId: number | string,
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
) {
  const data = await callChatwootApi(`/conversations/${conversationId}/messages`, config);
  return data?.payload || [];
}

/**
 * Sets or updates labels for a conversation in Chatwoot.
 * Syncs CRM stage/tag movements directly back to Chatwoot!
 */
export async function updateConversationLabels(
  conversationId: number | string,
  labels: string[],
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
) {
  return await callChatwootApi(
    `/conversations/${conversationId}/labels`,
    config,
    {
      method: 'POST',
      body: { labels },
    }
  );
}

/**
 * Specifically finds the last message before the lead was tagged with 'pedido-a-enviar'
 * that contains the address information and details, per user request.
 */
export async function getOrderMessageBeforeTag(
  conversationId: number | string,
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
): Promise<{
  addressMessage: string;
  senderName?: string;
  sentAt?: string;
  rawParsed?: any;
}> {
  try {
    const msgs = await fetchConversationMessages(conversationId, config);
    if (!Array.isArray(msgs) || msgs.length === 0) {
      return { addressMessage: '' };
    }

    // 1. Identify indices where 'added pedido-a-enviar' appears
    let firstTagIndex = -1;
    let lastTagIndex = -1;

    for (let i = 0; i < msgs.length; i++) {
      const content = msgs[i]?.content || '';
      if (content.includes('added pedido-a-enviar')) {
        if (firstTagIndex === -1) firstTagIndex = i;
        lastTagIndex = i;
      }
    }

    // Determine the boundary: message must be before the lead was tagged
    const targetBoundary = firstTagIndex !== -1 ? firstTagIndex : msgs.length;

    // Scan backwards from the boundary for the message with address
    let candidateMessage = '';
    let senderName = '';
    let sentAt = '';

    for (let i = targetBoundary - 1; i >= 0; i--) {
      const m = msgs[i];
      const content = (m?.content || '').trim();

      // Skip system messages
      if (!content || content.includes('added ') || content.includes('removed ')) {
        continue;
      }

      // Check if this message contains the delivery address / confirmation
      const hasAddress =
        content.includes('Endereço:') ||
        content.includes('Endereco:') ||
        content.includes('CEP:') ||
        content.includes('informações necessárias para o seu pedido') ||
        content.includes('pedido de') ||
        content.includes('Rua') ||
        content.includes('Avenida');

      if (hasAddress) {
        candidateMessage = content;
        senderName = m?.sender?.name || (m?.message_type === 1 ? 'Floraison Atendimento' : 'Cliente');
        if (m?.created_at) {
          sentAt = new Date(m.created_at * 1000).toLocaleString('pt-BR');
        }
        break;
      }
    }

    // Fallback: If not found before boundary, check anywhere in messages or take latest
    if (!candidateMessage) {
      for (let i = msgs.length - 1; i >= 0; i--) {
        const m = msgs[i];
        const content = (m?.content || '').trim();
        if (!content || content.includes('added ') || content.includes('removed ')) {
          continue;
        }
        if (
          content.includes('Endereço:') ||
          content.includes('Endereco:') ||
          content.includes('CEP:')
        ) {
          candidateMessage = content;
          senderName = m?.sender?.name || (m?.message_type === 1 ? 'Floraison Atendimento' : 'Cliente');
          if (m?.created_at) {
            sentAt = new Date(m.created_at * 1000).toLocaleString('pt-BR');
          }
          break;
        }
      }
    }

    return {
      addressMessage: candidateMessage,
      senderName,
      sentAt,
    };
  } catch (err) {
    console.error('Error in getOrderMessageBeforeTag:', err);
    return { addressMessage: '' };
  }
}

/**
 * Returns the latest order message before the lead was tagged with 'pedido-a-enviar',
 * structured for UI consumers.
 */
export async function getLatestOrderMessage(
  conversationId: number | string,
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS
) {
  const res = await getOrderMessageBeforeTag(conversationId, config);
  return {
    orderConfirmationMessage: res.addressMessage,
    lastMessage: res.addressMessage,
    addressMessage: res.addressMessage,
    senderName: res.senderName,
    sentAt: res.sentAt,
  };
}

/**
 * Fetches all tagged conversations from Chatwoot and translates them into CRM Leads.
 */
export async function fetchAllTaggedLeadsFromChatwoot(
  config: ChatwootConfig = DEFAULT_CHATWOOT_SETTINGS,
  knownTags: ChatwootTag[] = []
): Promise<{ leads: Cliente[]; error?: string }> {
  try {
    const labelsToFetch = knownTags.length > 0
      ? knownTags.map((t) => t.title)
      : Object.keys(CHATWOOT_LABEL_TO_STATUS);

    const conversationsMap = new Map<number | string, any>();

    // Fetch conversations for each label
    for (const label of labelsToFetch) {
      try {
        const convs = await fetchChatwootConversations(label, config);
        for (const c of convs) {
          if (!conversationsMap.has(c.id)) {
            conversationsMap.set(c.id, c);
          }
        }
      } catch (err) {
        console.warn(`Could not fetch conversations for label "${label}":`, err);
      }
    }

    const uniqueConvs = Array.from(conversationsMap.values());
    const leads: Cliente[] = [];

    // Process each tagged conversation
    for (const c of uniqueConvs) {
      const cid = c.id;
      const sender = c.meta?.sender || {};
      const rawLabels: string[] = Array.isArray(c.labels) ? c.labels : [];

      // Determine initial CRM status directly from Chatwoot labels
      let status: StatusCliente = 'pedido-a-enviar';
      for (const lbl of rawLabels) {
        if (CHATWOOT_LABEL_TO_STATUS[lbl]) {
          status = CHATWOOT_LABEL_TO_STATUS[lbl];
          break;
        }
      }

      const clientName = sender.name || `Lead #${cid}`;
      const clientPhone = (sender.phone_number || '').replace(/^\+/, '');

      let parsedOrder = undefined;
      let orderMsg = '';
      let msgSender = '';
      let msgAt = '';
      let computedPrice = 48.9;

      // Check order confirmation message for leads with orders (pedido-a-enviar, pedido-enviado, etc.)
      const isOrderStage =
        rawLabels.includes('pedido-a-enviar') ||
        rawLabels.includes('pedido-enviado') ||
        rawLabels.includes('pedido-a-cobrar') ||
        rawLabels.includes('pedido-pago') ||
        rawLabels.includes('erro-envio');

      if (isOrderStage) {
        try {
          const msgResult = await getOrderMessageBeforeTag(cid, config);
          if (msgResult.addressMessage) {
            orderMsg = msgResult.addressMessage;
            msgSender = msgResult.senderName || 'Floraison Atendimento';
            msgAt = msgResult.sentAt || '';
            parsedOrder = parsePedidoMensagem(orderMsg, clientName, clientPhone);

            // Compute value based on parsed quantity:
            // 1 Unidade -> R$ 48,90 | 2 Unidades -> R$ 87,90 | 3 Unidades -> R$ 146,70
            let qNum = 1;
            const qMatch = (parsedOrder.quantidade || '').match(/([0-9]+)/);
            if (qMatch) {
              qNum = parseInt(qMatch[1], 10);
            }
            computedPrice = calculateOrderPrice(qNum).valorNumerico;
          }
        } catch (e) {
          console.warn(`Failed to parse order message for conv ${cid}:`, e);
        }
      }

      leads.push({
        id: `cw-${cid}`,
        nome: clientName,
        whatsapp: clientPhone || '550000000000',
        valor: computedPrice,
        data_pagamento: (status === 'pedido-pago' || status === 'pago') ? (c.created_at ? new Date(c.created_at * 1000).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)) : null,
        status,
        responsavel: 'Icaro',
        observacoes: orderMsg ? 'Endereço e pedido identificados do Chatwoot' : `Sincronizado do Chatwoot (${rawLabels.join(', ')})`,
        suspeita_golpe: false,
        tags: rawLabels,
        chatwoot_conversation_id: cid,
        chatwoot_contact_id: sender.id,
        chatwoot_last_message: orderMsg,
        chatwoot_last_message_at: msgAt,
        chatwoot_last_message_sender: msgSender,
        parsed_order: parsedOrder,
        criado_em: c.created_at ? new Date(c.created_at * 1000).toISOString() : new Date().toISOString(),
      });
    }

    return { leads };
  } catch (err: any) {
    console.error('Error fetching all tagged leads from Chatwoot:', err);
    return { leads: [], error: err?.message || 'Falha ao sincronizar leads com Chatwoot' };
  }
}

/**
 * Compatibility wrapper for tags fetching
 */
export async function fetchChatwootTags(config: ChatwootConfig) {
  try {
    const tags = await fetchChatwootLabels(config);
    return { success: true, tags };
  } catch (err: any) {
    return { success: false, tags: [], error: err?.message || 'Erro ao buscar tags' };
  }
}

/**
 * Compatibility wrapper for contacts fetching
 */
export async function fetchChatwootContacts(config: ChatwootConfig) {
  try {
    const data = await callChatwootApi('/contacts?page=1', config);
    const rawList = data?.payload || data || [];
    return { success: true, contacts: rawList };
  } catch (err: any) {
    return { success: false, contacts: [], error: err?.message || 'Erro ao buscar contatos' };
  }
}

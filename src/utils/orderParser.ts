import { ParsedOrderData } from '../types';

/**
 * Intelligent price calculator based strictly on quantities:
 * 1 Unidade -> R$ 48,90
 * 2 Unidades -> R$ 87,90
 * 3 Unidades -> R$ 146,70 (48.90 * 3)
 * N Unidades -> R$ 48,90 * N
 */
export function calculateOrderPrice(quantityNum: number): { valorNumerico: number; valorFormatado: string } {
  if (quantityNum <= 0) {
    return { valorNumerico: 48.9, valorFormatado: 'R$ 48,90' };
  }
  if (quantityNum === 1) {
    return { valorNumerico: 48.9, valorFormatado: 'R$ 48,90' };
  }
  if (quantityNum === 2) {
    return { valorNumerico: 87.9, valorFormatado: 'R$ 87,90' };
  }
  // For 3 or more, default to promotional multiple or unit price
  if (quantityNum === 3) {
    return { valorNumerico: 146.7, valorFormatado: 'R$ 146,70' };
  }
  const total = quantityNum * 48.9;
  return {
    valorNumerico: total,
    valorFormatado: `R$ ${total.toFixed(2).replace('.', ',')}`,
  };
}

/**
 * Intelligent parser that identifies and separates the content of a Chatwoot/WhatsApp
 * message when a lead is tagged as 'pedido-a-enviar'.
 *
 * Rules:
 * - Identifies address, street, number, neighborhood, city, state, and CEP
 * - Identifies product and units count
 * - Calculates price strictly from units: 1 Unidade = R$48,90, 2 Unidades = R$87,90, etc.
 */
export function parsePedidoMensagem(
  message: string,
  clientName?: string,
  clientPhone?: string
): ParsedOrderData {
  if (!message || typeof message !== 'string') {
    return {
      nomeDestinatario: clientName || '',
      mensagemOriginal: '',
      valorFormatado: 'R$ 48,90',
    };
  }

  const raw = message.trim();
  const parsed: ParsedOrderData = {
    mensagemOriginal: raw,
  };

  // 1. Destinatário / Nome
  const nomeMatch =
    raw.match(/Nome:\s*([^\n\r]+)/i) ||
    raw.match(/Nome Completo:\s*([^\n\r]+)/i) ||
    raw.match(/Destinat[áa]rio:\s*([^\n\r]+)/i) ||
    raw.match(/Perfeito,?\s*([^!,\n\r]+)[!]/i);

  if (nomeMatch && nomeMatch[1]) {
    parsed.nomeDestinatario = nomeMatch[1].replace(/^\([^)]+\)/, '').trim();
  } else if (clientName) {
    parsed.nomeDestinatario = clientName;
  }

  // 2. CEP
  const cepMatch =
    raw.match(/CEP:\s*([0-9]{5}-?[0-9]{3})/i) ||
    raw.match(/CEP:\s*([0-9]{8})/i) ||
    raw.match(/\b([0-9]{5}-?[0-9]{3})\b/);

  if (cepMatch && cepMatch[1]) {
    let cleanCep = cepMatch[1].replace(/\D/g, '');
    if (cleanCep.length === 8) {
      parsed.cep = `${cleanCep.slice(0, 5)}-${cleanCep.slice(5)}`;
    } else {
      parsed.cep = cepMatch[1].trim();
    }
  }

  // 3. Endereço Completo
  const enderecoMatch =
    raw.match(/Endere[çc]o:\s*([^\n\r]+)/i) ||
    raw.match(/End:\s*([^\n\r]+)/i);

  if (enderecoMatch && enderecoMatch[1]) {
    parsed.enderecoCompleto = enderecoMatch[1].trim();
  } else {
    // Check if broken into Rua / Número / Bairro lines
    const ruaLineMatch = raw.match(/(?:Rua|Avenida|Travessa|Alameda|Rodovia|Praça|Quadra):\s*([^\n\r]+)/i);
    const numLineMatch = raw.match(/N[úu]mero:\s*([^\n\r]+)/i);
    const bairroLineMatch = raw.match(/Bairro:\s*([^\n\r]+)/i);
    const cidadeLineMatch = raw.match(/Cidade:\s*([^\n\r]+)/i);

    if (ruaLineMatch) {
      const parts = [
        ruaLineMatch[1].trim(),
        numLineMatch ? `nº ${numLineMatch[1].trim()}` : '',
        bairroLineMatch ? bairroLineMatch[1].trim() : '',
        cidadeLineMatch ? cidadeLineMatch[1].trim() : '',
      ].filter(Boolean);
      parsed.enderecoCompleto = parts.join(', ');
    } else {
      // Fallback: look for typical address street patterns
      const streetLine = raw
        .split('\n')
        .find((line) =>
          /(?:rua|av\.|avenida|travessa|alameda|rodovia|pra[çc]a|quadra|lote|bloco)\b/i.test(line)
        );
      if (streetLine) {
        parsed.enderecoCompleto = streetLine.trim();
      }
    }
  }

  // Sub-divide parts of the address if found
  if (parsed.enderecoCompleto) {
    const end = parsed.enderecoCompleto;

    // Número
    const numMatch = end.match(/(?:n[úu]mero|n[º°.]|n\b)\s*([0-9A-Za-z\s/-]+?)(?:,|$|\n|bairro)/i);
    if (numMatch && numMatch[1]) {
      parsed.numero = numMatch[1].trim();
    }

    // Bairro
    const bairroMatch = end.match(/(?:bairro|b\.)\s*([^,\n\r]+)/i);
    if (bairroMatch && bairroMatch[1]) {
      parsed.bairro = bairroMatch[1].trim();
    }

    // Estado (UF)
    const ufMatch = end.match(/(?: - |estado\s+)([A-Z]{2})\b/i);
    if (ufMatch && ufMatch[1]) {
      parsed.estado = ufMatch[1].trim().toUpperCase();
    }
  }

  // 4. Produto e Quantidade & Preço a partir das unidades
  let quantityNum = 1;

  const explicitQtdMatch =
    raw.match(/([0-9]+)\s*(?:unidade|unidades|frasco|frascos|potes|vidro|vidros|cx|caixas)/i) ||
    raw.match(/pedido de\s*([0-9]+)\s*(?:unidade|unidades)/i);

  if (explicitQtdMatch && explicitQtdMatch[1]) {
    quantityNum = parseInt(explicitQtdMatch[1], 10);
  } else if (/duas unidades|dois frascos|2 unidades|2 frascos/i.test(raw)) {
    quantityNum = 2;
  } else if (/tr[êe]s unidades|tr[êe]s frascos|3 unidades|3 frascos/i.test(raw)) {
    quantityNum = 3;
  } else if (/uma unidade|um frasco|1 unidade|1 frasco/i.test(raw)) {
    quantityNum = 1;
  }

  parsed.quantidade = `${quantityNum} ${quantityNum > 1 ? 'unidades' : 'unidade'}`;
  parsed.produto = `${quantityNum} ${quantityNum > 1 ? 'unidades' : 'unidade'} de Magnésio Treonato`;

  // 5. Preço estrito a partir da quantidade
  const pricing = calculateOrderPrice(quantityNum);
  parsed.valorFormatado = pricing.valorFormatado;

  // 6. Condição / Forma de Pagamento
  if (/pagamento n[ãa]o [ée] feito ao entregador/i.test(raw)) {
    parsed.formaPagamento = 'Pagamento após o recebimento (via WhatsApp: Pix, Boleto ou Cartão)';
  } else if (/pix/i.test(raw) || /boleto/i.test(raw) || /cart[ãa]o/i.test(raw)) {
    const pagMatch = raw.match(/(?:via|por|no|em)\s*(Pix[^\n\r,.]*)/i);
    if (pagMatch && pagMatch[1]) {
      parsed.formaPagamento = pagMatch[1].trim();
    } else {
      parsed.formaPagamento = 'Pix / Boleto / Cartão';
    }
  } else {
    parsed.formaPagamento = 'Pagamento após o recebimento no WhatsApp';
  }

  // 7. Instruções adicionais de entrega
  if (/lembrando/i.test(raw) || /confirma[çc][ãa]o de que o produto foi enviado/i.test(raw)) {
    parsed.instrucoesEntrega =
      'O pagamento não é feito ao entregador. Cobrança enviada no WhatsApp após recebimento com frete seguro.';
  }

  return parsed;
}

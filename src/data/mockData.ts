import { Cliente, Atalho, MetaMes, User, ChatwootTag, ChatwootConfig } from '../types';
import { parsePedidoMensagem } from '../utils/orderParser';

export const DEFAULT_CHATWOOT_CONFIG: ChatwootConfig = {
  url: 'https://n8n-chatwoot.iqfos1.easypanel.host',
  accountId: '1',
  apiAccessToken: 'GUEdmSi4Qks9vhMpKRYS6CAa',
  lastSyncAt: new Date().toISOString(),
};

export const DEFAULT_CHATWOOT_TAGS: ChatwootTag[] = [
  { id: 1, title: 'pedido-a-enviar', color: '#1400FF', description: 'endereçoconfirmado' },
  { id: 2, title: 'pedido-enviado', color: '#00FF22', description: 'PRODUTOENVIADO' },
  { id: 3, title: 'pedido-a-cobrar', color: '#FF0000', description: 'COBRAR' },
  { id: 4, title: 'pedido-pago', color: '#21FF00', description: 'Pedido pago' },
  { id: 5, title: 'pagamento-futuro', color: '#873D82', description: 'Pagamento-futuro' },
  { id: 6, title: 'erro-envio', color: '#CCD021', description: 'erro-envio' },
  { id: 7, title: 'leads-atencao', color: '#C48A19', description: 'Leads-atencao' },
  { id: 10, title: 'leads-reembolso', color: '#923F65', description: 'Leads-reembolso' },
];

export const INITIAL_CLIENTES: Cliente[] = [
  {
    "id": "cw-509",
    "nome": "Eva Elizete Fraga Portal",
    "whatsapp": "555180503990",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-enviar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 509,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-991",
    "nome": "Maria Aparecida",
    "whatsapp": "557381218483",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 991,
    "chatwoot_last_message": "Perfeito, Tamiles! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Tamiles Silva Santos  \nEndere\u00e7o: Rua principal quadra A bloco 3, n\u00famero 1, Paquet\u00e1, Eun\u00e1polis  \nCEP: 45825-006  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789663165",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Tamiles Silva Santos",
      "endereco": "Rua principal quadra A bloco 3, n\u00famero 1, Paquet\u00e1, Eun\u00e1polis",
      "cep": "45825-006",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Tamiles! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Tamiles Silva Santos  \nEndere\u00e7o: Rua principal quadra A bloco 3, n\u00famero 1, Paquet\u00e1, Eun\u00e1polis  \nCEP: 45825-006  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-623",
    "nome": "Joacyr Teles",
    "whatsapp": "5521998513777",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 623,
    "chatwoot_last_message": "Aqui est\u00e1 a confirma\u00e7\u00e3o:\n\nPerfeito, Francisco! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Francisco Jos\u00e9 Telles  \nEndere\u00e7o: Estrada Luiz Maio da Rocha Lima, n\u00famero 1835, Austin, Nova Igua\u00e7u  \nCEP: 26086-070  \n\nSeu pedido de 2 unidades do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c",
    "chatwoot_last_message_at": "1789670242",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Francisco Jos\u00e9 Telles",
      "endereco": "Estrada Luiz Maio da Rocha Lima, n\u00famero 1835, Austin, Nova Igua\u00e7u",
      "cep": "26086-070",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Aqui est\u00e1 a confirma\u00e7\u00e3o:\n\nPerfeito, Francisco! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Francisco Jos\u00e9 Telles  \nEndere\u00e7o: Estrada Luiz Maio da Rocha Lima, n\u00famero 1835, Austin, Nova Igua\u00e7u  \nCEP: 26086-070  \n\nSeu pedido de 2 unidades do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c"
    }
  },
  {
    "id": "cw-1100",
    "nome": "Vit\u00f3ria",
    "whatsapp": "559887890296",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 1100,
    "chatwoot_last_message": "Perfeito, Maria Vitoria! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Maria Vitoria Buna Melo\n- Endere\u00e7o: Travessa Bom Jesus, n\u00famero 1002, Jardim S\u00e3o Crist\u00f3v\u00e3o, S\u00e3o Lu\u00eds\n- Estado: Maranh\u00e3o\n- CEP: 05010-000\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: o pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp, podendo ser feito por **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789587657",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Maria Vitoria Buna Melo",
      "endereco": "Travessa Bom Jesus, n\u00famero 1002, Jardim S\u00e3o Crist\u00f3v\u00e3o, S\u00e3o Lu\u00eds",
      "cep": "05010-000",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Maria Vitoria! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Maria Vitoria Buna Melo\n- Endere\u00e7o: Travessa Bom Jesus, n\u00famero 1002, Jardim S\u00e3o Crist\u00f3v\u00e3o, S\u00e3o Lu\u00eds\n- Estado: Maranh\u00e3o\n- CEP: 05010-000\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: o pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp, podendo ser feito por **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-1089",
    "nome": "ISABEL CRISTINA",
    "whatsapp": "558587765126",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 1089,
    "chatwoot_last_message": "Perfeito, Isabel Cristina Montenegro Barreto! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Isabel Cristina Montenegro Barreto\n- Endere\u00e7o: Rua Manoel Jesu\u00edno, n\u00famero 1044, Apto 302, Varjota, Fortaleza, CE\n- CEP: 60175-214\n- Quantidade: 2 unidades de Magn\u00e9sio Treonato\n\nSeu pedido est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp, podendo ser por **Pix, Boleto, ou cart\u00e3o (at\u00e9 12x)!** \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado. Muito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789584009",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Isabel Cristina Montenegro Barreto",
      "endereco": "Rua Manoel Jesu\u00edno, n\u00famero 1044, Apto 302, Varjota, Fortaleza, CE",
      "cep": "60175-214",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Isabel Cristina Montenegro Barreto! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Isabel Cristina Montenegro Barreto\n- Endere\u00e7o: Rua Manoel Jesu\u00edno, n\u00famero 1044, Apto 302, Varjota, Fortaleza, CE\n- CEP: 60175-214\n- Quantidade: 2 unidades de Magn\u00e9sio Treonato\n\nSeu pedido est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp, podendo ser por **Pix, Boleto, ou cart\u00e3o (at\u00e9 12x)!** \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado. Muito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-1095",
    "nome": "S\u00e9rgio Aparecido",
    "whatsapp": "556892299636",
    "valor": 129.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 1095,
    "chatwoot_last_message": "Perfeito, S\u00e9rgio Aparecido! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: S\u00e9rgio Aparecido de Souza  \nEndere\u00e7o: Rua Francisco Ademar, n\u00famero 88, Chico Mendes, Rio Branco - AC  \nCEP: 69902-651\n\nSeu pedido de 3 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a Voc\u00ea pode optar por Pix, Boleto, ou cart\u00e3o (at\u00e9 12x)!  \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o de que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789584094",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "S\u00e9rgio Aparecido de Souza",
      "endereco": "Rua Francisco Ademar, n\u00famero 88, Chico Mendes, Rio Branco - AC",
      "cep": "69902-651",
      "quantidade": "3 Unidades",
      "valor": "R$ 129,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, S\u00e9rgio Aparecido! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: S\u00e9rgio Aparecido de Souza  \nEndere\u00e7o: Rua Francisco Ademar, n\u00famero 88, Chico Mendes, Rio Branco - AC  \nCEP: 69902-651\n\nSeu pedido de 3 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a Voc\u00ea pode optar por Pix, Boleto, ou cart\u00e3o (at\u00e9 12x)!  \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o de que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-1090",
    "nome": "Lidiane Paiva \u2665\ufe0f\ud83d\udc9c\ud83d\udc71\u200d\u2640\ufe0f\ud83e\uddd1\u200d\ud83c\udfa4",
    "whatsapp": "553299419920",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 1090,
    "chatwoot_last_message": "Perfeito, Lidiane Almeida Paiva! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Lidiane Almeida Paiva  \nEndere\u00e7o: Rua Platina, n\u00famero 93, bairro Ouro Park Residencial Cedro, Pira\u00faba - Minas Gerais  \nCEP: 36170-000  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c",
    "chatwoot_last_message_at": "1789571722",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Lidiane Almeida Paiva",
      "endereco": "Rua Platina, n\u00famero 93, bairro Ouro Park Residencial Cedro, Pira\u00faba - Minas Gerais",
      "cep": "36170-000",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Lidiane Almeida Paiva! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Lidiane Almeida Paiva  \nEndere\u00e7o: Rua Platina, n\u00famero 93, bairro Ouro Park Residencial Cedro, Pira\u00faba - Minas Gerais  \nCEP: 36170-000  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c"
    }
  },
  {
    "id": "cw-1088",
    "nome": "Norma Dias Khoury",
    "whatsapp": "557188901838",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-enviar",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-enviar"
    ],
    "chatwoot_conversation_id": 1088,
    "chatwoot_last_message": "Perfeito, Norma! \ud83d\ude0a Agora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Norma Gon\u00e7alves Dias Khoury\nEndere\u00e7o: Eulalio de Oliveira, n\u00famero 48, bairro Federa\u00e7\u00e3o, Salvador\nCEP: 40231-200\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c",
    "chatwoot_last_message_at": "1789559311",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Norma Gon\u00e7alves Dias Khoury",
      "endereco": "Eulalio de Oliveira, n\u00famero 48, bairro Federa\u00e7\u00e3o, Salvador",
      "cep": "40231-200",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Norma! \ud83d\ude0a Agora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Norma Gon\u00e7alves Dias Khoury\nEndere\u00e7o: Eulalio de Oliveira, n\u00famero 48, bairro Federa\u00e7\u00e3o, Salvador\nCEP: 40231-200\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c"
    }
  },
  {
    "id": "cw-999",
    "nome": "Hildevaldo Dias",
    "whatsapp": "559881793992",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 999,
    "chatwoot_last_message": "Perfeito, Hildevaldo! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Hildevaldo Silveira Dias  \nEndere\u00e7o: Rua Izack Martins, n\u00famero 84, Centro, S\u00e3o Lu\u00eds - MA  \nCEP: 65010-690\n\nSeu pedido de 1 unidade de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a\n\nPodendo fazer no **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado. Muito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789061059",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Hildevaldo Silveira Dias",
      "endereco": "Rua Izack Martins, n\u00famero 84, Centro, S\u00e3o Lu\u00eds - MA",
      "cep": "65010-690",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Hildevaldo! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Hildevaldo Silveira Dias  \nEndere\u00e7o: Rua Izack Martins, n\u00famero 84, Centro, S\u00e3o Lu\u00eds - MA  \nCEP: 65010-690\n\nSeu pedido de 1 unidade de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a\n\nPodendo fazer no **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado. Muito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-201",
    "nome": "isaias\ud83d\ude0e",
    "whatsapp": "559985124016",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-enviado)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 201,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-1040",
    "nome": "Adilson Reis",
    "whatsapp": "5511994026221",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 1040,
    "chatwoot_last_message": "Obrigado, Adilson! \ud83d\ude0a \n\nS\u00f3 para confirmar, o CEP que voc\u00ea passou \u00e9 06535-110. \n\nAgora vamos verificar as informa\u00e7\u00f5es do seu pedido:\n\n- Nome: Adilson Souza Reis  \n- Endere\u00e7o: Avenida Batista Borba, n\u00famero 708, Cidade de S\u00e3o Pedro, Santana de Parna\u00edba  \n- CEP: 06535-110  \n- Quantidade: 2 unidades do Magn\u00e9sio Treonato  \n\nPerfeito, Adilson! \u2705\n\nSeu pedido de 2 unidades do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c  \n\u26a0\ufe0f Lembrando que o pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp.",
    "chatwoot_last_message_at": "1789249467",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Adilson Souza Reis",
      "endereco": "Avenida Batista Borba, n\u00famero 708, Cidade de S\u00e3o Pedro, Santana de Parna\u00edba",
      "cep": "06535-110",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Obrigado, Adilson! \ud83d\ude0a \n\nS\u00f3 para confirmar, o CEP que voc\u00ea passou \u00e9 06535-110. \n\nAgora vamos verificar as informa\u00e7\u00f5es do seu pedido:\n\n- Nome: Adilson Souza Reis  \n- Endere\u00e7o: Avenida Batista Borba, n\u00famero 708, Cidade de S\u00e3o Pedro, Santana de Parna\u00edba  \n- CEP: 06535-110  \n- Quantidade: 2 unidades do Magn\u00e9sio Treonato  \n\nPerfeito, Adilson! \u2705\n\nSeu pedido de 2 unidades do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c  \n\u26a0\ufe0f Lembrando que o pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp."
    }
  },
  {
    "id": "cw-222",
    "nome": "Marlene Martins",
    "whatsapp": "558487261820",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 222,
    "chatwoot_last_message": "Icaro Garcia removed pedido-pago",
    "chatwoot_last_message_at": "1789076724",
    "chatwoot_last_message_sender": "Floraison",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Marlene Martins",
      "endereco": "",
      "cep": "",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Icaro Garcia removed pedido-pago"
    }
  },
  {
    "id": "cw-432",
    "nome": "Tereza Tolotti Silva",
    "whatsapp": "556592128666",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-enviado)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 432,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-1015",
    "nome": "Almir Silva Garcez",
    "whatsapp": "556899823221",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 1015,
    "chatwoot_last_message": "Perfeito, Almir! \u2705 \n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Almir Silva Garcez  \nEndere\u00e7o: Rua Valdomiro Lopes, n\u00famero 1133, Rio Branco  \nCEP: 69918-860  \n\nSeu pedido de 1 unidade de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a \n\nPodendo fazer no **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!** \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789143835",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Almir Silva Garcez",
      "endereco": "Rua Valdomiro Lopes, n\u00famero 1133, Rio Branco",
      "cep": "69918-860",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Almir! \u2705 \n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Almir Silva Garcez  \nEndere\u00e7o: Rua Valdomiro Lopes, n\u00famero 1133, Rio Branco  \nCEP: 69918-860  \n\nSeu pedido de 1 unidade de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c\n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviamos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a \n\nPodendo fazer no **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!** \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-716",
    "nome": "Agnaldo",
    "whatsapp": "5512997503974",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 716,
    "chatwoot_last_message": "Perfeito, Agnaldo! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Agnaldo De Franco\n- Endere\u00e7o: Rua Capit\u00e3o Francisco Ant\u00f4nio Justo, n\u00famero 32 A, Vila Resende, Ca\u00e7apava\n- CEP: 12282-130\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c \n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a Voc\u00ea pode pagar via **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o de que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789123372",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Agnaldo De Franco",
      "endereco": "Rua Capit\u00e3o Francisco Ant\u00f4nio Justo, n\u00famero 32 A, Vila Resende, Ca\u00e7apava",
      "cep": "12282-130",
      "quantidade": "1 Unidade",
      "valor": "R$ 48,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Agnaldo! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\n- Nome: Agnaldo De Franco\n- Endere\u00e7o: Rua Capit\u00e3o Francisco Ant\u00f4nio Justo, n\u00famero 32 A, Vila Resende, Ca\u00e7apava\n- CEP: 12282-130\n\nSeu pedido de 1 unidade do Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c \n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador.\n\nAp\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. \ud83d\ude0a Voc\u00ea pode pagar via **Pix, Boleto, ou cart\u00e3o (At\u00e9 12X)!**\n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o de que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-1022",
    "nome": "Luzia",
    "whatsapp": "554488412850",
    "valor": 87.9,
    "data_pagamento": null,
    "status": "pedido-enviado",
    "responsavel": "Icaro",
    "observacoes": "Endere\u00e7o e pedido identificados do Chatwoot",
    "suspeita_golpe": false,
    "tags": [
      "pedido-enviado"
    ],
    "chatwoot_conversation_id": 1022,
    "chatwoot_last_message": "Perfeito, Luzia! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Luzia Cunha Pereira da Silva  \nEndere\u00e7o: Rua Amadeu Barilli Filho, n\u00famero 4872, Jardim Irene, Umuarama, Paran\u00e1  \nCEP: 87502-970  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c \n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. Voc\u00ea poder\u00e1 realizar o pagamento por Pix, Boleto ou cart\u00e3o (at\u00e9 12x)! \ud83d\ude0a \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a",
    "chatwoot_last_message_at": "1789163746",
    "chatwoot_last_message_sender": "Icaro Garcia",
    "criado_em": "2026-09-16",
    "parsed_order": {
      "destinatario": "Luzia Cunha Pereira da Silva",
      "endereco": "Rua Amadeu Barilli Filho, n\u00famero 4872, Jardim Irene, Umuarama, Paran\u00e1",
      "cep": "87502-970",
      "quantidade": "2 Unidades",
      "valor": "R$ 87,90",
      "forma_pagamento": "Pagamento na entrega",
      "raw_message": "Perfeito, Luzia! \u2705\n\nAgora temos todas as informa\u00e7\u00f5es necess\u00e1rias para o seu pedido:\n\nNome: Luzia Cunha Pereira da Silva  \nEndere\u00e7o: Rua Amadeu Barilli Filho, n\u00famero 4872, Jardim Irene, Umuarama, Paran\u00e1  \nCEP: 87502-970  \n\nSeu pedido de 2 unidades de Magn\u00e9sio Treonato est\u00e1 confirmado! \ud83d\ude4c \n\n\u26a0\ufe0f Lembrando: O pagamento n\u00e3o \u00e9 feito ao entregador. Ap\u00f3s receber o produto, enviaremos a forma de pagamento aqui mesmo no WhatsApp. Voc\u00ea poder\u00e1 realizar o pagamento por Pix, Boleto ou cart\u00e3o (at\u00e9 12x)! \ud83d\ude0a \n\nEm breve, voc\u00ea receber\u00e1 a confirma\u00e7\u00e3o que o produto foi enviado.\n\nMuito obrigado pela confian\u00e7a! \ud83d\ude0a"
    }
  },
  {
    "id": "cw-603",
    "nome": "\ud83c\udf52\ud83c\udf52\ud83c\udf52\ud83c\udf52\ud83c\udf52\ud83c\udf52\ud83c\udf52",
    "whatsapp": "559981540576",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-cobrar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-cobrar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-cobrar"
    ],
    "chatwoot_conversation_id": 603,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-896",
    "nome": "Ana Gabriele\ud83d\udcda",
    "whatsapp": "553597508477",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-cobrar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-cobrar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-cobrar"
    ],
    "chatwoot_conversation_id": 896,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-990",
    "nome": "Leonice Duarte",
    "whatsapp": "553798569293",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-cobrar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-cobrar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-cobrar"
    ],
    "chatwoot_conversation_id": 990,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-923",
    "nome": "Iracema",
    "whatsapp": "557187108778",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-cobrar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-cobrar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-cobrar"
    ],
    "chatwoot_conversation_id": 923,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-686",
    "nome": "Elisa",
    "whatsapp": "555391633729",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pedido-a-cobrar",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-a-cobrar)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-a-cobrar"
    ],
    "chatwoot_conversation_id": 686,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-985",
    "nome": "Cida",
    "whatsapp": "553498696802",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 985,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-925",
    "nome": "Moacir Freitas\ud83e\udd78",
    "whatsapp": "556791720799",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 925,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-772",
    "nome": "\ud835\ude7c\ud835\ude92\ud835\ude9c\ud835\ude9c.\ud835\ude73\ud835\ude98\ud835\ude9b\ud835\ude8a",
    "whatsapp": "558393115479",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 772,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-913",
    "nome": "Gilcimar",
    "whatsapp": "558499838309",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 913,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-661",
    "nome": "Luh",
    "whatsapp": "554896953165",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 661,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-939",
    "nome": "Lead #939",
    "whatsapp": "554192663145",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 939,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-916",
    "nome": "Solange",
    "whatsapp": "5511958860107",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 916,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-428",
    "nome": "Marcineide",
    "whatsapp": "556296812726",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 428,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-472",
    "nome": "Terezinha Neres",
    "whatsapp": "557999526708",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 472,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-581",
    "nome": "Marina Crescencio",
    "whatsapp": "554888470819",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 581,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-775",
    "nome": ".",
    "whatsapp": "553788534253",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 775,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-687",
    "nome": "K\u00e1tia Marques",
    "whatsapp": "5512988317209",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 687,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-800",
    "nome": "Claudia Fernandes\ud83d\udc9b",
    "whatsapp": "558488623788",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 800,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-704",
    "nome": "Claudineia",
    "whatsapp": "554599086316",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 704,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-778",
    "nome": "Reinaldo",
    "whatsapp": "5515997246323",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 778,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-178",
    "nome": "Edcarlos Froes Dias",
    "whatsapp": "557798262885",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 178,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-609",
    "nome": "Nice",
    "whatsapp": "5511987179698",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 609,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-252",
    "nome": "yaponira vendas",
    "whatsapp": "558198282660",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 252,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-753",
    "nome": "Silvanea",
    "whatsapp": "5516992287413",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 753,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-766",
    "nome": "Elizeuda",
    "whatsapp": "558585318986",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 766,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-696",
    "nome": "Deusira",
    "whatsapp": "556291293680",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 696,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-563",
    "nome": "Lucia Pereira",
    "whatsapp": "5513996098367",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 563,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-678",
    "nome": "Luzia \u00c1urea \u263a\ufe0f",
    "whatsapp": "558585362542",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 678,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-203",
    "nome": "Sandra Cristina",
    "whatsapp": "556195600007",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 203,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-578",
    "nome": "Luiz Fernando",
    "whatsapp": "554796753350",
    "valor": 87.9,
    "data_pagamento": "2026-09-18",
    "status": "pedido-pago",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pedido-pago)",
    "suspeita_golpe": false,
    "tags": [
      "pedido-pago"
    ],
    "chatwoot_conversation_id": 578,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-897",
    "nome": "Daniel",
    "whatsapp": "556192482998",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pagamento-futuro",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pagamento-futuro)",
    "suspeita_golpe": false,
    "tags": [
      "pagamento-futuro"
    ],
    "chatwoot_conversation_id": 897,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-643",
    "nome": "Ahid",
    "whatsapp": "559881837446",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "pagamento-futuro",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (pagamento-futuro)",
    "suspeita_golpe": false,
    "tags": [
      "pagamento-futuro"
    ],
    "chatwoot_conversation_id": 643,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-605",
    "nome": "Joana Darc",
    "whatsapp": "5511960152305",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "leads-reembolso",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (leads-reembolso)",
    "suspeita_golpe": false,
    "tags": [
      "leads-reembolso"
    ],
    "chatwoot_conversation_id": 605,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  },
  {
    "id": "cw-960",
    "nome": "MarlyCostaReis",
    "whatsapp": "554399868110",
    "valor": 48.9,
    "data_pagamento": null,
    "status": "leads-reembolso",
    "responsavel": "Icaro",
    "observacoes": "Sincronizado do Chatwoot (leads-reembolso)",
    "suspeita_golpe": false,
    "tags": [
      "leads-reembolso"
    ],
    "chatwoot_conversation_id": 960,
    "chatwoot_last_message": "",
    "chatwoot_last_message_at": null,
    "chatwoot_last_message_sender": null,
    "criado_em": "2026-09-16"
  }
];

export const INITIAL_ATALHOS: Atalho[] = [
  {
    id: 'at-1',
    titulo: 'WhatsApp Web',
    url: 'https://web.whatsapp.com',
    icone_url: 'https://www.google.com/s2/favicons?sz=64&domain=web.whatsapp.com',
  },
  {
    id: 'at-2',
    titulo: 'Chatwoot',
    url: 'https://n8n-chatwoot.iqfos1.easypanel.host',
    icone_url: 'https://www.google.com/s2/favicons?sz=64&domain=chatwoot.com',
  },
  {
    id: 'at-3',
    titulo: 'Correios Rastreio',
    url: 'https://rastreamento.correios.com.br',
    icone_url: 'https://www.google.com/s2/favicons?sz=64&domain=correios.com.br',
  },
];

export const INITIAL_META: MetaMes = {
  mes: new Date().toISOString().slice(0, 7),
  valor: 15000,
};

export const DEFAULT_USER: User = {
  id: 'usr-1',
  email: 'icaroeeitaloce@gmail.com',
  name: 'Icaro',
  avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=Icaro&backgroundColor=468c62',
};

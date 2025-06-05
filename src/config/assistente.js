const axios = require('axios');

// Configuração do OpenAI
const openaiConfig = {
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
};

const openaiClient = axios.create(openaiConfig);

// Prompts do sistema
const systemPrompts = {
  reformaTributaria: `Você é um assistente especializado em contabilidade e reforma tributária.
    Forneça respostas claras e objetivas, sempre considerando o contexto específico do cliente.
    Inclua exemplos práticos quando relevante.`,

  consultoria: `Você é um consultor contábil especializado em otimização de processos e gestão financeira.
    Analise os dados fornecidos e forneça sugestões práticas e implementáveis.
    Considere aspectos legais, tributários e operacionais.`,

  duvidas: `Você é um assistente contábil focado em resolver dúvidas comuns.
    Use linguagem clara e acessível.
    Forneça exemplos práticos quando possível.
    Sempre verifique a legislação atual antes de responder.`,

  analise: `Você é um analista financeiro especializado em identificar tendências e fazer previsões.
    Analise os dados fornecidos e forneça insights valiosos.
    Inclua recomendações práticas baseadas nas análises.`
};

// Funções auxiliares para o assistente

const consultarAssistente = async (prompt, mensagem, contexto = null) => {
  try {
    const messages = [
      {
        role: 'system',
        content: prompt
      }
    ];

    if (contexto) {
      messages.push({
        role: 'system',
        content: `Contexto adicional: ${JSON.stringify(contexto)}`
      });
    }

    messages.push({
      role: 'user',
      content: mensagem
    });

    const response = await openaiClient.post('/chat/completions', {
      model: 'gpt-4',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`Erro ao consultar assistente: ${error.message}`);
  }
};

const analisarDadosCliente = async (dadosCliente) => {
  try {
    const analise = await consultarAssistente(
      systemPrompts.consultoria,
      'Analise os seguintes dados do cliente e forneça sugestões de melhorias:',
      dadosCliente
    );

    return analise;
  } catch (error) {
    throw new Error(`Erro ao analisar dados do cliente: ${error.message}`);
  }
};

const responderDuvidaTributaria = async (pergunta, contextoCliente = null) => {
  try {
    const resposta = await consultarAssistente(
      systemPrompts.reformaTributaria,
      pergunta,
      contextoCliente
    );

    return resposta;
  } catch (error) {
    throw new Error(`Erro ao responder dúvida tributária: ${error.message}`);
  }
};

const analisarTendencias = async (dados) => {
  try {
    const analise = await consultarAssistente(
      systemPrompts.analise,
      'Analise os seguintes dados e forneça insights sobre tendências e previsões:',
      dados
    );

    return analise;
  } catch (error) {
    throw new Error(`Erro ao analisar tendências: ${error.message}`);
  }
};

module.exports = {
  systemPrompts,
  consultarAssistente,
  analisarDadosCliente,
  responderDuvidaTributaria,
  analisarTendencias
}; 
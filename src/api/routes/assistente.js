const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Consultar assistente sobre reforma tributária
router.post('/reforma-tributaria', async (req, res) => {
  try {
    const { pergunta } = req.body;

    // Integração com ChatGPT
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um assistente especializado em contabilidade e reforma tributária. Forneça respostas claras e objetivas.'
        },
        {
          role: 'user',
          content: pergunta
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      resposta: response.data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analisar dados do cliente e sugerir melhorias
router.post('/sugestoes/:clienteId', async (req, res) => {
  try {
    // Buscar dados do cliente
    const { data: cliente, error: clienteError } = await supabase
      .from('clientes')
      .select(`
        *,
        notas_fiscais (*),
        cobrancas (*),
        tarefas (*)
      `)
      .eq('id', req.params.clienteId)
      .single();

    if (clienteError) throw clienteError;

    // Preparar contexto para a IA
    const contexto = {
      cliente: {
        nome: cliente.nome,
        cnpj: cliente.cnpj,
        regime: cliente.regime_tributario,
        total_notas: cliente.notas_fiscais.length,
        total_cobrancas: cliente.cobrancas.length,
        tarefas_pendentes: cliente.tarefas.filter(t => t.status === 'pendente').length
      }
    };

    // Consultar ChatGPT para sugestões
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um consultor contábil especializado em otimização de processos e gestão financeira.'
        },
        {
          role: 'user',
          content: `Analise os seguintes dados do cliente e forneça sugestões de melhorias: ${JSON.stringify(contexto)}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      sugestoes: response.data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Responder dúvidas comuns
router.post('/duvidas', async (req, res) => {
  try {
    const { pergunta } = req.body;

    // Buscar respostas pré-definidas
    const { data: respostas, error: respostasError } = await supabase
      .from('respostas_padrao')
      .select('*');

    if (respostasError) throw respostasError;

    // Consultar ChatGPT para resposta personalizada
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Você é um assistente contábil. Use as seguintes respostas padrão como referência: ${JSON.stringify(respostas)}`
        },
        {
          role: 'user',
          content: pergunta
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      resposta: response.data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Analisar tendências e previsões
router.get('/tendencias', async (req, res) => {
  try {
    // Buscar dados históricos
    const { data: notas, error: notasError } = await supabase
      .from('notas_fiscais')
      .select('*')
      .order('data_emissao', { ascending: true });

    if (notasError) throw notasError;

    // Preparar dados para análise
    const dadosAnalise = {
      notas_por_mes: {},
      valores_por_mes: {}
    };

    notas.forEach(nota => {
      const mes = nota.data_emissao.substring(0, 7);
      dadosAnalise.notas_por_mes[mes] = (dadosAnalise.notas_por_mes[mes] || 0) + 1;
      dadosAnalise.valores_por_mes[mes] = (dadosAnalise.valores_por_mes[mes] || 0) + nota.valor;
    });

    // Consultar ChatGPT para análise
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Você é um analista financeiro especializado em identificar tendências e fazer previsões.'
        },
        {
          role: 'user',
          content: `Analise os seguintes dados e forneça insights sobre tendências e previsões: ${JSON.stringify(dadosAnalise)}`
        }
      ]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    res.json({
      analise: response.data.choices[0].message.content,
      dados: dadosAnalise
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Listar todas as tarefas
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar tarefa por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar nova tarefa
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .insert([{
        ...req.body,
        status: 'pendente',
        data_criacao: new Date().toISOString()
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Atualizar tarefa
router.put('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .update(req.body)
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Marcar tarefa como concluída
router.post('/:id/concluir', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .update({
        status: 'concluida',
        data_conclusao: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar tarefas por cliente
router.get('/cliente/:clienteId', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('cliente_id', req.params.clienteId)
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Listar tarefas pendentes
router.get('/status/pendentes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('status', 'pendente')
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar tarefa recorrente
router.post('/recorrente', async (req, res) => {
  try {
    const { frequencia, data_inicio, data_fim, ...tarefaData } = req.body;
    
    // Criar múltiplas tarefas baseadas na frequência
    const tarefas = [];
    let dataAtual = new Date(data_inicio);
    const dataFinal = new Date(data_fim);

    while (dataAtual <= dataFinal) {
      tarefas.push({
        ...tarefaData,
        data_vencimento: dataAtual.toISOString(),
        status: 'pendente',
        data_criacao: new Date().toISOString()
      });

      // Incrementar data baseado na frequência
      switch (frequencia) {
        case 'diario':
          dataAtual.setDate(dataAtual.getDate() + 1);
          break;
        case 'semanal':
          dataAtual.setDate(dataAtual.getDate() + 7);
          break;
        case 'mensal':
          dataAtual.setMonth(dataAtual.getMonth() + 1);
          break;
        default:
          throw new Error('Frequência inválida');
      }
    }

    const { data, error } = await supabase
      .from('tarefas')
      .insert(tarefas)
      .select();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
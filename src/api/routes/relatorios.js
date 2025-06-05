const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Relatório de notas fiscais por período
router.get('/notas-fiscais', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .gte('data_emissao', data_inicio)
      .lte('data_emissao', data_fim)
      .order('data_emissao', { ascending: true });
    
    if (error) throw error;

    // Calcular totais
    const total = data.reduce((acc, nota) => acc + nota.valor, 0);
    const totalPorStatus = data.reduce((acc, nota) => {
      acc[nota.status] = (acc[nota.status] || 0) + nota.valor;
      return acc;
    }, {});

    res.json({
      notas: data,
      total,
      totalPorStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Relatório de cobranças por período
router.get('/cobrancas', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    const { data, error } = await supabase
      .from('cobrancas')
      .select('*')
      .gte('data_vencimento', data_inicio)
      .lte('data_vencimento', data_fim)
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;

    // Calcular totais
    const total = data.reduce((acc, cobranca) => acc + cobranca.valor, 0);
    const totalPorStatus = data.reduce((acc, cobranca) => {
      acc[cobranca.status] = (acc[cobranca.status] || 0) + cobranca.valor;
      return acc;
    }, {});

    res.json({
      cobrancas: data,
      total,
      totalPorStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Relatório de clientes
router.get('/clientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('clientes')
      .select(`
        *,
        notas_fiscais (*),
        cobrancas (*)
      `);
    
    if (error) throw error;

    // Calcular métricas por cliente
    const clientesComMetricas = data.map(cliente => {
      const totalNotas = cliente.notas_fiscais.reduce((acc, nota) => acc + nota.valor, 0);
      const totalCobrancas = cliente.cobrancas.reduce((acc, cobranca) => acc + cobranca.valor, 0);
      const cobrancasPendentes = cliente.cobrancas.filter(c => c.status === 'pendente').length;

      return {
        ...cliente,
        total_notas: totalNotas,
        total_cobrancas: totalCobrancas,
        cobrancas_pendentes: cobrancasPendentes
      };
    });

    res.json(clientesComMetricas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Relatório de tarefas
router.get('/tarefas', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .gte('data_vencimento', data_inicio)
      .lte('data_vencimento', data_fim)
      .order('data_vencimento', { ascending: true });
    
    if (error) throw error;

    // Calcular métricas
    const totalTarefas = data.length;
    const tarefasConcluidas = data.filter(t => t.status === 'concluida').length;
    const tarefasPendentes = data.filter(t => t.status === 'pendente').length;
    const tarefasAtrasadas = data.filter(t => 
      t.status === 'pendente' && new Date(t.data_vencimento) < new Date()
    ).length;

    res.json({
      tarefas: data,
      metricas: {
        total: totalTarefas,
        concluidas: tarefasConcluidas,
        pendentes: tarefasPendentes,
        atrasadas: tarefasAtrasadas
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exportar dados para Domínio/Sieg
router.get('/exportar/contabil', async (req, res) => {
  try {
    const { data_inicio, data_fim } = req.query;
    
    // Buscar dados necessários
    const { data: notas, error: notasError } = await supabase
      .from('notas_fiscais')
      .select('*')
      .gte('data_emissao', data_inicio)
      .lte('data_emissao', data_fim);

    if (notasError) throw notasError;

    // Formatar dados para exportação
    const dadosExportacao = notas.map(nota => ({
      data: nota.data_emissao,
      documento: nota.numero,
      descricao: nota.descricao,
      valor: nota.valor,
      tipo: 'receita',
      categoria: 'servicos'
    }));

    // Gerar arquivo de exportação
    // Implementar lógica de geração do arquivo no formato do Domínio/Sieg

    res.json({
      message: 'Dados exportados com sucesso',
      dados: dadosExportacao
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
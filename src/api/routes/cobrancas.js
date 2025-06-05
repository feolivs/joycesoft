const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Listar todas as cobranças
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cobrancas')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar cobrança por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cobrancas')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Criar nova cobrança
router.post('/', async (req, res) => {
  try {
    // Integração com Asaas
    const asaasResponse = await axios.post('https://api.asaas.com/v3/payments', {
      apiKey: process.env.ASAAS_API_KEY,
      ...req.body
    });

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('cobrancas')
      .insert([{
        ...req.body,
        asaas_id: asaasResponse.data.id,
        status: 'pendente'
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gerar Pix
router.post('/:id/gerar-pix', async (req, res) => {
  try {
    const { data: cobranca, error: fetchError } = await supabase
      .from('cobrancas')
      .select('asaas_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Gerar Pix na Asaas
    const pixResponse = await axios.post(`https://api.asaas.com/v3/payments/${cobranca.asaas_id}/pixQrCode`, {
      apiKey: process.env.ASAAS_API_KEY
    });

    res.json(pixResponse.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verificar status do pagamento
router.get('/:id/status', async (req, res) => {
  try {
    const { data: cobranca, error: fetchError } = await supabase
      .from('cobrancas')
      .select('asaas_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Consultar status na Asaas
    const statusResponse = await axios.get(`https://api.asaas.com/v3/payments/${cobranca.asaas_id}`, {
      headers: {
        'apiKey': process.env.ASAAS_API_KEY
      }
    });

    // Atualizar status no Supabase
    const { data, error } = await supabase
      .from('cobrancas')
      .update({ status: statusResponse.data.status })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar cobrança por WhatsApp
router.post('/:id/enviar-whatsapp', async (req, res) => {
  try {
    const { data: cobranca, error: fetchError } = await supabase
      .from('cobrancas')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Implementar integração com WhatsApp
    // Enviar mensagem com link do boleto/Pix

    res.json({ message: 'Cobrança enviada por WhatsApp com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
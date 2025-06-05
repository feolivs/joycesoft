const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');
const axios = require('axios');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Listar todas as notas fiscais
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*');
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Buscar nota fiscal por ID
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Emitir nova nota fiscal
router.post('/', async (req, res) => {
  try {
    // Integração com NFe.io
    const nfeResponse = await axios.post('https://api.nfe.io/v1/companies', {
      apiKey: process.env.NFE_API_KEY,
      ...req.body
    });

    // Salvar no Supabase
    const { data, error } = await supabase
      .from('notas_fiscais')
      .insert([{
        ...req.body,
        nfe_id: nfeResponse.data.id,
        status: 'emitida'
      }])
      .select();
    
    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancelar nota fiscal
router.post('/:id/cancelar', async (req, res) => {
  try {
    const { data: nota, error: fetchError } = await supabase
      .from('notas_fiscais')
      .select('nfe_id')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Cancelar na NFe.io
    await axios.post(`https://api.nfe.io/v1/companies/${nota.nfe_id}/cancel`, {
      apiKey: process.env.NFE_API_KEY
    });

    // Atualizar status no Supabase
    const { data, error } = await supabase
      .from('notas_fiscais')
      .update({ status: 'cancelada' })
      .eq('id', req.params.id)
      .select();
    
    if (error) throw error;
    res.json(data[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enviar nota fiscal por e-mail
router.post('/:id/enviar-email', async (req, res) => {
  try {
    const { data: nota, error: fetchError } = await supabase
      .from('notas_fiscais')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (fetchError) throw fetchError;

    // Enviar e-mail com a nota fiscal
    // Implementar integração com serviço de e-mail

    res.json({ message: 'Nota fiscal enviada com sucesso' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Estrutura das tabelas no Supabase

/*
Tabela: clientes
- id: uuid (primary key)
- nome: text
- cnpj: text
- regime_tributario: text
- prefeitura: text
- contato_nome: text
- contato_email: text
- contato_telefone: text
- endereco: jsonb
- data_cadastro: timestamp
- status: text
- observacoes: text

Tabela: notas_fiscais
- id: uuid (primary key)
- cliente_id: uuid (foreign key -> clientes.id)
- numero: text
- data_emissao: timestamp
- valor: decimal
- descricao: text
- status: text
- nfe_id: text
- xml_url: text
- pdf_url: text
- observacoes: text

Tabela: cobrancas
- id: uuid (primary key)
- cliente_id: uuid (foreign key -> clientes.id)
- nota_fiscal_id: uuid (foreign key -> notas_fiscais.id)
- valor: decimal
- data_vencimento: timestamp
- status: text
- asaas_id: text
- pix_qrcode: text
- pix_url: text
- boleto_url: text
- observacoes: text

Tabela: tarefas
- id: uuid (primary key)
- cliente_id: uuid (foreign key -> clientes.id)
- titulo: text
- descricao: text
- data_vencimento: timestamp
- status: text
- tipo: text
- prioridade: text
- data_criacao: timestamp
- data_conclusao: timestamp
- observacoes: text

Tabela: respostas_padrao
- id: uuid (primary key)
- pergunta: text
- resposta: text
- categoria: text
- tags: text[]
*/

// Funções auxiliares para o Supabase

const getCliente = async (id) => {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

const getNotaFiscal = async (id) => {
  const { data, error } = await supabase
    .from('notas_fiscais')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

const getCobranca = async (id) => {
  const { data, error } = await supabase
    .from('cobrancas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

const getTarefa = async (id) => {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

module.exports = {
  supabase,
  getCliente,
  getNotaFiscal,
  getCobranca,
  getTarefa
}; 
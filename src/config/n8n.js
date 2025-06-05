const axios = require('axios');
const { getConfig } = require('./environment');

// Configuração do cliente n8n
const n8nConfig = getConfig('n8n');

const n8nClient = axios.create({
  baseURL: n8nConfig.url,
  headers: {
    'X-N8N-API-KEY': n8nConfig.key,
    'Content-Type': 'application/json'
  }
});

// Funções auxiliares para operações comuns no n8n

const createWorkflow = async (workflowData) => {
  try {
    const response = await n8nClient.post('/workflows', workflowData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao criar workflow: ${error.message}`);
  }
};

const updateWorkflow = async (id, workflowData) => {
  try {
    const response = await n8nClient.put(`/workflows/${id}`, workflowData);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao atualizar workflow: ${error.message}`);
  }
};

const deleteWorkflow = async (id) => {
  try {
    await n8nClient.delete(`/workflows/${id}`);
  } catch (error) {
    throw new Error(`Erro ao deletar workflow: ${error.message}`);
  }
};

const activateWorkflow = async (id) => {
  try {
    const response = await n8nClient.post(`/workflows/${id}/activate`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao ativar workflow: ${error.message}`);
  }
};

const deactivateWorkflow = async (id) => {
  try {
    const response = await n8nClient.post(`/workflows/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao desativar workflow: ${error.message}`);
  }
};

const executeWorkflow = async (id, data) => {
  try {
    const response = await n8nClient.post(`/workflows/${id}/execute`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Erro ao executar workflow: ${error.message}`);
  }
};

// Workflows específicos do sistema

const createClientWorkflow = async (clientData) => {
  const workflowData = {
    name: 'Criar Cliente',
    nodes: [
      {
        type: 'n8n-nodes-base.httpRequest',
        position: [0, 0],
        parameters: {
          url: '{{$node["Webhook"].json["url"]}}',
          method: 'POST',
          body: clientData
        }
      }
    ]
  };

  return createWorkflow(workflowData);
};

const createInvoiceWorkflow = async (invoiceData) => {
  const workflowData = {
    name: 'Criar Fatura',
    nodes: [
      {
        type: 'n8n-nodes-base.httpRequest',
        position: [0, 0],
        parameters: {
          url: '{{$node["Webhook"].json["url"]}}',
          method: 'POST',
          body: invoiceData
        }
      }
    ]
  };

  return createWorkflow(workflowData);
};

const createTaskWorkflow = async (taskData) => {
  const workflowData = {
    name: 'Criar Tarefa',
    nodes: [
      {
        type: 'n8n-nodes-base.httpRequest',
        position: [0, 0],
        parameters: {
          url: '{{$node["Webhook"].json["url"]}}',
          method: 'POST',
          body: taskData
        }
      }
    ]
  };

  return createWorkflow(workflowData);
};

module.exports = {
  n8nClient,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  activateWorkflow,
  deactivateWorkflow,
  executeWorkflow,
  createClientWorkflow,
  createInvoiceWorkflow,
  createTaskWorkflow
}; 
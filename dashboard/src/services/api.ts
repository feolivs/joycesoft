import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5678',
});

// Tipos
export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  cnpj: string;
  regimeTributario: 'SIMPLES' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL';
  status: 'ativo' | 'inativo';
  dataCadastro: string;
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

export interface Documento {
  id: string;
  nome: string;
  tipo: 'DECLARACAO' | 'RELATORIO' | 'CERTIDAO' | 'OUTRO';
  status: 'PENDENTE' | 'ENVIADO' | 'APROVADO' | 'REJEITADO';
  dataVencimento: string;
  cliente: string;
  workflowId?: string;
  observacoes?: string;
}

export interface Estatisticas {
  totalClientes: number;
  documentosPendentes: number;
  faturasAtrasadas: number;
  receitaMensal: number;
  impostosDevidos: number;
  folhaPagamento: number;
  obrigacoesAcessorias: number;
  clientesInadimplentes: number;
  receitaAnual: number;
  custosOperacionais: number;
  margemLucro: number;
  impostosRetidos: number;
  saldoContas: number;
  fluxoCaixa: {
    entradas: number;
    saidas: number;
    saldo: number;
  };
}

export interface Workflow {
  id: string;
  nome: string;
  descricao: string;
  status: 'ativo' | 'inativo';
  tipo: 'CLIENTE' | 'DOCUMENTO' | 'COBRANCA' | 'RELATORIO';
  ultimaExecucao?: string;
  proximaExecucao?: string;
}

// Dados mockados
const mockClientes: Cliente[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao@email.com',
    telefone: '(11) 99999-9999',
    status: 'ativo',
    dataCadastro: '2024-01-01',
    cnpj: '12.345.678/0001-90',
    regimeTributario: 'SIMPLES',
    endereco: {
      logradouro: 'Rua A',
      numero: '123',
      bairro: 'Bairro A',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria@email.com',
    telefone: '(11) 88888-8888',
    status: 'ativo',
    dataCadastro: '2024-01-15',
    cnpj: '12.345.678/0001-90',
    regimeTributario: 'SIMPLES',
    endereco: {
      logradouro: 'Rua B',
      numero: '456',
      bairro: 'Bairro B',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
    },
  },
];

const mockEstatisticas: Estatisticas = {
  totalClientes: 150,
  documentosPendentes: 23,
  faturasAtrasadas: 5,
  receitaMensal: 25000,
  impostosDevidos: 15000,
  folhaPagamento: 8000,
  obrigacoesAcessorias: 12,
  clientesInadimplentes: 8,
  receitaAnual: 300000,
  custosOperacionais: 50000,
  margemLucro: 0.35,
  impostosRetidos: 5000,
  saldoContas: 100000,
  fluxoCaixa: {
    entradas: 30000,
    saidas: 20000,
    saldo: 10000,
  },
};

// Funções de Cliente
export const getClientes = async () => {
  const response = await api.get('/clientes');
  return response.data;
};

export const getCliente = async (id: string) => {
  const response = await api.get(`/clientes/${id}`);
  return response.data;
};

export const createCliente = async (cliente: Omit<Cliente, 'id'>) => {
  const response = await api.post('/clientes', cliente);
  return response.data;
};

export const updateCliente = async (id: string, cliente: Partial<Cliente>) => {
  const response = await api.put(`/clientes/${id}`, cliente);
  return response.data;
};

export const deleteCliente = async (id: string) => {
  const response = await api.delete(`/clientes/${id}`);
  return response.data;
};

// Funções de Documento
export const getDocumentos = async () => {
  const response = await api.get('/documentos');
  return response.data;
};

export const getDocumento = async (id: string) => {
  const response = await api.get(`/documentos/${id}`);
  return response.data;
};

export const createDocumento = async (documento: Omit<Documento, 'id'>) => {
  const response = await api.post('/documentos', documento);
  return response.data;
};

export const updateDocumento = async (id: string, documento: Partial<Documento>) => {
  const response = await api.put(`/documentos/${id}`, documento);
  return response.data;
};

export const deleteDocumento = async (id: string) => {
  const response = await api.delete(`/documentos/${id}`);
  return response.data;
};

// Funções de Workflow
export const getWorkflows = async () => {
  const response = await api.get('/workflows');
  return response.data;
};

export const getWorkflow = async (id: string) => {
  const response = await api.get(`/workflows/${id}`);
  return response.data;
};

export const createWorkflow = async (workflow: Omit<Workflow, 'id'>) => {
  const response = await api.post('/workflows', workflow);
  return response.data;
};

export const updateWorkflow = async (id: string, workflow: Partial<Workflow>) => {
  const response = await api.put(`/workflows/${id}`, workflow);
  return response.data;
};

export const deleteWorkflow = async (id: string) => {
  const response = await api.delete(`/workflows/${id}`);
  return response.data;
};

export const executeWorkflow = async (id: string, data: any) => {
  const response = await api.post(`/workflows/${id}/execute`, data);
  return response.data;
};

// Funções de Estatísticas
export const getEstatisticas = async () => {
  const response = await api.get('/estatisticas');
  return response.data;
};

// Funções de Relatórios
export const getRelatorioFiscal = async (periodo: { inicio: string; fim: string }) => {
  const response = await api.get('/relatorios/fiscal', { params: periodo });
  return response.data;
};

export const getRelatorioContabil = async (periodo: { inicio: string; fim: string }) => {
  const response = await api.get('/relatorios/contabil', { params: periodo });
  return response.data;
};

export const getRelatorioFluxoCaixa = async (periodo: { inicio: string; fim: string }) => {
  const response = await api.get('/relatorios/fluxo-caixa', { params: periodo });
  return response.data;
};

export default api; 
import { create } from 'zustand';
import {
  Cliente,
  Documento,
  Estatisticas,
  Workflow,
  getClientes,
  getDocumentos,
  getEstatisticas,
  getWorkflows,
  createCliente,
  updateCliente,
  deleteCliente,
  createDocumento,
  updateDocumento,
  deleteDocumento,
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  executeWorkflow,
} from '../services/api';

interface StoreState {
  // Estado
  clientes: Cliente[];
  documentos: Documento[];
  workflows: Workflow[];
  estatisticas: Estatisticas | null;
  loading: boolean;
  error: string | null;

  // Ações de Cliente
  carregarClientes: () => Promise<void>;
  adicionarCliente: (cliente: Omit<Cliente, 'id'>) => Promise<void>;
  atualizarCliente: (id: string, cliente: Partial<Cliente>) => Promise<void>;
  excluirCliente: (id: string) => Promise<void>;

  // Ações de Documento
  carregarDocumentos: () => Promise<void>;
  adicionarDocumento: (documento: Omit<Documento, 'id'>) => Promise<void>;
  atualizarDocumento: (id: string, documento: Partial<Documento>) => Promise<void>;
  excluirDocumento: (id: string) => Promise<void>;

  // Ações de Workflow
  carregarWorkflows: () => Promise<void>;
  adicionarWorkflow: (workflow: Omit<Workflow, 'id'>) => Promise<void>;
  atualizarWorkflow: (id: string, workflow: Partial<Workflow>) => Promise<void>;
  excluirWorkflow: (id: string) => Promise<void>;
  executarWorkflow: (id: string, data: Record<string, unknown>) => Promise<void>;

  // Ações de Estatísticas
  carregarEstatisticas: () => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Estado inicial
  clientes: [],
  documentos: [],
  workflows: [],
  estatisticas: null,
  loading: false,
  error: null,

  // Ações de Cliente
  carregarClientes: async () => {
    set({ loading: true, error: null });
    try {
      const clientes = await getClientes();
      set({ clientes, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar clientes', loading: false });
    }
  },

  adicionarCliente: async (cliente) => {
    set({ loading: true, error: null });
    try {
      const novoCliente = await createCliente(cliente);
      set((state) => ({
        clientes: [...state.clientes, novoCliente],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao adicionar cliente', loading: false });
    }
  },

  atualizarCliente: async (id, cliente) => {
    set({ loading: true, error: null });
    try {
      const clienteAtualizado = await updateCliente(id, cliente);
      set((state) => ({
        clientes: state.clientes.map((c) => (c.id === id ? clienteAtualizado : c)),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar cliente', loading: false });
    }
  },

  excluirCliente: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteCliente(id);
      set((state) => ({
        clientes: state.clientes.filter((c) => c.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir cliente', loading: false });
    }
  },

  // Ações de Documento
  carregarDocumentos: async () => {
    set({ loading: true, error: null });
    try {
      const documentos = await getDocumentos();
      set({ documentos, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar documentos', loading: false });
    }
  },

  adicionarDocumento: async (documento) => {
    set({ loading: true, error: null });
    try {
      const novoDocumento = await createDocumento(documento);
      set((state) => ({
        documentos: [...state.documentos, novoDocumento],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao adicionar documento', loading: false });
    }
  },

  atualizarDocumento: async (id, documento) => {
    set({ loading: true, error: null });
    try {
      const documentoAtualizado = await updateDocumento(id, documento);
      set((state) => ({
        documentos: state.documentos.map((d) => (d.id === id ? documentoAtualizado : d)),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar documento', loading: false });
    }
  },

  excluirDocumento: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteDocumento(id);
      set((state) => ({
        documentos: state.documentos.filter((d) => d.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir documento', loading: false });
    }
  },

  // Ações de Workflow
  carregarWorkflows: async () => {
    set({ loading: true, error: null });
    try {
      const workflows = await getWorkflows();
      set({ workflows, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar workflows', loading: false });
    }
  },

  adicionarWorkflow: async (workflow) => {
    set({ loading: true, error: null });
    try {
      const novoWorkflow = await createWorkflow(workflow);
      set((state) => ({
        workflows: [...state.workflows, novoWorkflow],
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao adicionar workflow', loading: false });
    }
  },

  atualizarWorkflow: async (id, workflow) => {
    set({ loading: true, error: null });
    try {
      const workflowAtualizado = await updateWorkflow(id, workflow);
      set((state) => ({
        workflows: state.workflows.map((w) => (w.id === id ? workflowAtualizado : w)),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar workflow', loading: false });
    }
  },

  excluirWorkflow: async (id) => {
    set({ loading: true, error: null });
    try {
      await deleteWorkflow(id);
      set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir workflow', loading: false });
    }
  },

  executarWorkflow: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await executeWorkflow(id, data);
      set({ loading: false });
    } catch (error) {
      set({ error: 'Erro ao executar workflow', loading: false });
    }
  },

  // Ações de Estatísticas
  carregarEstatisticas: async () => {
    set({ loading: true, error: null });
    try {
      const estatisticas = await getEstatisticas();
      set({ estatisticas, loading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar estatísticas', loading: false });
    }
  },
})); 
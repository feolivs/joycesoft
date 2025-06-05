import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';
import type { Documento } from '../services/api';

const statusColors = {
  pendente: 'bg-yellow-100 text-yellow-800',
  emAndamento: 'bg-blue-100 text-blue-800',
  concluido: 'bg-green-100 text-green-800',
  atrasado: 'bg-red-100 text-red-800',
};

export default function Documents() {
  const {
    documentos,
    loading,
    error,
    carregarDocumentos,
    adicionarDocumento,
    atualizarDocumento,
    excluirDocumento,
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Documento | null>(null);

  useEffect(() => {
    carregarDocumentos();
  }, [carregarDocumentos]);

  const filteredDocuments = documentos.filter((doc) => {
    const matchesSearch = doc.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (documento: Documento) => {
    setSelectedDocument(documento);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      await excluirDocumento(id);
    }
  };

  const handleSave = async (documento: Omit<Documento, 'id'>) => {
    if (selectedDocument) {
      await atualizarDocumento(selectedDocument.id, documento);
    } else {
      await adicionarDocumento(documento);
    }
    setShowModal(false);
    setSelectedDocument(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Documentos</h1>
        <button
          onClick={() => {
            setSelectedDocument(null);
            setShowModal(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
          Novo Documento
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar documentos..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <div className="w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
          >
            <option value="todos">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="emAndamento">Em Andamento</option>
            <option value="concluido">Concluído</option>
            <option value="atrasado">Atrasado</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredDocuments.map((documento) => (
            <li key={documento.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-6 w-6 text-gray-400" />
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-gray-900">{documento.nome}</h3>
                      <p className="text-sm text-gray-500">{documento.cliente}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        statusColors[documento.status]
                      }`}
                    >
                      {documento.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Vencimento: {new Date(documento.dataVencimento).toLocaleDateString()}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(documento)}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(documento.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-medium mb-4">
              {selectedDocument ? 'Editar Documento' : 'Novo Documento'}
            </h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSave({
                nome: formData.get('nome') as string,
                tipo: formData.get('tipo') as string,
                status: formData.get('status') as string,
                dataVencimento: formData.get('dataVencimento') as string,
                cliente: formData.get('cliente') as string,
                workflowId: formData.get('workflowId') as string,
                observacoes: formData.get('observacoes') as string,
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    defaultValue={selectedDocument?.nome}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tipo</label>
                  <select
                    name="tipo"
                    defaultValue={selectedDocument?.tipo}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="declaracao">Declaração</option>
                    <option value="relatorio">Relatório</option>
                    <option value="certificado">Certificado</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    name="status"
                    defaultValue={selectedDocument?.status}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="emAndamento">Em Andamento</option>
                    <option value="concluido">Concluído</option>
                    <option value="atrasado">Atrasado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Data de Vencimento</label>
                  <input
                    type="date"
                    name="dataVencimento"
                    defaultValue={selectedDocument?.dataVencimento}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cliente</label>
                  <input
                    type="text"
                    name="cliente"
                    defaultValue={selectedDocument?.cliente}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Workflow ID</label>
                  <input
                    type="text"
                    name="workflowId"
                    defaultValue={selectedDocument?.workflowId}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Observações</label>
                  <textarea
                    name="observacoes"
                    defaultValue={selectedDocument?.observacoes}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setSelectedDocument(null);
                  }}
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
} 
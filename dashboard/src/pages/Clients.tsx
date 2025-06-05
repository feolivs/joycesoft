import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon } from '@heroicons/react/24/outline';
import { ClientTable } from '../components/ClientTable';
import { ClientModal } from '../components/ClientModal';
import { useStore } from '../store/useStore';
import type { Cliente } from '../services/api';

export function Clients() {
  const { clientes, carregarClientes, adicionarCliente, atualizarCliente, excluirCliente } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Cliente | undefined>();

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const handleEdit = (client: Cliente) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente?')) {
      await excluirCliente(id);
    }
  };

  const handleSave = async (client: Omit<Cliente, 'id'>) => {
    if (selectedClient) {
      await atualizarCliente(selectedClient.id, client);
    } else {
      await adicionarCliente(client);
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-gray-900"
        >
          Clientes
        </motion.h1>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => {
            setSelectedClient(undefined);
            setIsModalOpen(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <PlusIcon className="mr-2 h-5 w-5" />
          Novo Cliente
        </motion.button>
      </div>

      <ClientTable
        clients={clientes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedClient(undefined);
        }}
        onSave={handleSave}
        client={selectedClient}
      />
    </div>
  );
} 
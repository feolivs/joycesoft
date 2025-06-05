import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  UserGroupIcon,
  DocumentTextIcon,
  ExclamationCircleIcon,
  CurrencyDollarIcon,
  ScaleIcon,
  ClockIcon,
  BanknotesIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import { StatCard } from '../components/StatCard';
import { useStore } from '../store/useStore';

export function Dashboard() {
  const { estatisticas, carregarEstatisticas } = useStore();

  useEffect(() => {
    carregarEstatisticas();
  }, [carregarEstatisticas]);

  if (!estatisticas) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-2xl font-bold text-gray-900"
      >
        Dashboard Contábil
      </motion.h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de Clientes"
          value={estatisticas.totalClientes}
          icon={<UserGroupIcon className="h-6 w-6 text-white" />}
          color="bg-primary-500"
        />
        <StatCard
          title="Obrigações Pendentes"
          value={estatisticas.obrigacoesAcessorias}
          icon={<DocumentTextIcon className="h-6 w-6 text-white" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Impostos Devidos"
          value={`R$ ${estatisticas.impostosDevidos.toLocaleString('pt-BR')}`}
          icon={<ScaleIcon className="h-6 w-6 text-white" />}
          color="bg-red-500"
        />
        <StatCard
          title="Receita Mensal"
          value={`R$ ${estatisticas.receitaMensal.toLocaleString('pt-BR')}`}
          icon={<CurrencyDollarIcon className="h-6 w-6 text-white" />}
          color="bg-green-500"
        />
        <StatCard
          title="Clientes Inadimplentes"
          value={estatisticas.clientesInadimplentes}
          icon={<ExclamationCircleIcon className="h-6 w-6 text-white" />}
          color="bg-orange-500"
        />
        <StatCard
          title="Folha de Pagamento"
          value={`R$ ${estatisticas.folhaPagamento.toLocaleString('pt-BR')}`}
          icon={<BanknotesIcon className="h-6 w-6 text-white" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Receita Anual"
          value={`R$ ${estatisticas.receitaAnual.toLocaleString('pt-BR')}`}
          icon={<ChartBarIcon className="h-6 w-6 text-white" />}
          color="bg-purple-500"
        />
        <StatCard
          title="Margem de Lucro"
          value={`${(estatisticas.margemLucro * 100).toFixed(1)}%`}
          icon={<ClockIcon className="h-6 w-6 text-white" />}
          color="bg-indigo-500"
        />
      </div>

      {/* Seção de Alertas */}
      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold text-gray-900">Alertas e Lembretes</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="font-medium text-yellow-800">Obrigações Acessórias</h3>
            <p className="mt-1 text-sm text-yellow-700">
              {estatisticas.obrigacoesAcessorias} obrigações pendentes para este mês
            </p>
          </div>
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <h3 className="font-medium text-red-800">Clientes Inadimplentes</h3>
            <p className="mt-1 text-sm text-red-700">
              {estatisticas.clientesInadimplentes} clientes com pagamentos pendentes
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
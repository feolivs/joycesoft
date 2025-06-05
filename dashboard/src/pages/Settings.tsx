import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  ServerIcon,
  KeyIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface N8nConfig {
  baseUrl: string;
  apiKey: string;
  webhookUrl: string;
}

export default function Settings() {
  const [config, setConfig] = useState<N8nConfig>({
    baseUrl: localStorage.getItem('n8n_baseUrl') || 'http://localhost:5678',
    apiKey: localStorage.getItem('n8n_apiKey') || '',
    webhookUrl: localStorage.getItem('n8n_webhookUrl') || '',
  });

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleSave = () => {
    localStorage.setItem('n8n_baseUrl', config.baseUrl);
    localStorage.setItem('n8n_apiKey', config.apiKey);
    localStorage.setItem('n8n_webhookUrl', config.webhookUrl);
    setTestResult({
      success: true,
      message: 'Configurações salvas com sucesso!',
    });
  };

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(`${config.baseUrl}/healthz`, {
        headers: {
          'X-N8N-API-KEY': config.apiKey,
        },
      });

      if (response.ok) {
        setTestResult({
          success: true,
          message: 'Conexão com n8n estabelecida com sucesso!',
        });
      } else {
        throw new Error('Falha ao conectar com n8n');
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Erro ao conectar com n8n. Verifique as configurações.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Configurações</h1>
          <button
            onClick={handleTest}
            disabled={isTesting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            {isTesting ? (
              <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-5 w-5" />
            ) : (
              <ServerIcon className="-ml-1 mr-2 h-5 w-5" />
            )}
            Testar Conexão
          </button>
        </div>

        {testResult && (
          <div
            className={`mb-6 p-4 rounded-md ${
              testResult.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {testResult.message}
          </div>
        )}

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Configurações do n8n
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Configure a conexão com o servidor n8n para automatizar seus
                processos contábeis.
              </p>
            </div>
            <div className="mt-5 space-y-6">
              <div>
                <label
                  htmlFor="baseUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL Base
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="baseUrl"
                    id="baseUrl"
                    value={config.baseUrl}
                    onChange={(e) =>
                      setConfig({ ...config, baseUrl: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="http://localhost:5678"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="apiKey"
                  className="block text-sm font-medium text-gray-700"
                >
                  Chave da API
                </label>
                <div className="mt-1">
                  <div className="relative">
                    <input
                      type="password"
                      name="apiKey"
                      id="apiKey"
                      value={config.apiKey}
                      onChange={(e) =>
                        setConfig({ ...config, apiKey: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      placeholder="Sua chave da API n8n"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="webhookUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL do Webhook
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="webhookUrl"
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) =>
                      setConfig({ ...config, webhookUrl: e.target.value })
                    }
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="URL do webhook para notificações"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Salvar Configurações
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Workflows Disponíveis
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Lista de workflows configurados no n8n que podem ser utilizados
                para automatizar processos.
              </p>
            </div>
            <div className="mt-5">
              <div className="rounded-md bg-gray-50 px-6 py-5">
                <div className="text-sm text-gray-500">
                  Nenhum workflow configurado ainda.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
} 
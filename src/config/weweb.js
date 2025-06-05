// Configuração do WeWeb
const wewebConfig = {
  apiKey: process.env.WEWEB_API_KEY,
  baseURL: process.env.WEWEB_URL
};

// Estrutura da interface

/*
1. Dashboard Principal
- Resumo financeiro
  - Total de notas emitidas
  - Total de cobranças pendentes
  - Total recebido no mês
  - Previsão de recebimentos
- Tarefas do dia
  - Lista de tarefas pendentes
  - Próximos vencimentos
  - Alertas importantes
- Gráficos
  - Receitas por mês
  - Status das cobranças
  - Distribuição por cliente

2. Módulo de Clientes
- Lista de clientes
  - Filtros e busca
  - Status do cliente
  - Últimas interações
- Detalhes do cliente
  - Informações cadastrais
  - Histórico de notas
  - Histórico de cobranças
  - Documentos
- Ações rápidas
  - Emitir nota
  - Gerar cobrança
  - Enviar mensagem

3. Módulo de Notas Fiscais
- Lista de notas
  - Filtros por período
  - Status da nota
  - Valores
- Emissão de nota
  - Formulário simplificado
  - Seleção de cliente
  - Cálculo automático
- Ações
  - Cancelar nota
  - Reenviar e-mail
  - Gerar cobrança

4. Módulo de Cobranças
- Lista de cobranças
  - Filtros por status
  - Valores pendentes
  - Vencimentos
- Geração de cobrança
  - Seleção de nota
  - Opções de pagamento
  - Envio automático
- Ações
  - Reenviar cobrança
  - Gerar segunda via
  - Registrar pagamento

5. Módulo de Tarefas
- Lista de tarefas
  - Filtros por tipo
  - Prioridades
  - Prazos
- Criação de tarefa
  - Formulário simplificado
  - Seleção de cliente
  - Lembretes
- Ações
  - Concluir tarefa
  - Adiar tarefa
  - Reatribuir

6. Módulo de Relatórios
- Relatórios financeiros
  - Notas emitidas
  - Cobranças geradas
  - Pagamentos recebidos
- Relatórios de clientes
  - Atividade por cliente
  - Documentação pendente
  - Histórico de interações
- Exportações
  - Formato Excel
  - Formato PDF
  - Integração contábil

7. Módulo de Assistente
- Chat com IA
  - Dúvidas tributárias
  - Sugestões de melhorias
  - Análise de dados
- Configurações
  - Personalização de respostas
  - Base de conhecimento
  - Histórico de interações
*/

// Componentes principais

const componentes = {
  dashboard: {
    tipo: 'pagina',
    titulo: 'Dashboard',
    componentes: [
      {
        tipo: 'card',
        titulo: 'Resumo Financeiro',
        dados: [
          { label: 'Notas Emitidas', valor: 'total_notas' },
          { label: 'Cobranças Pendentes', valor: 'total_cobrancas' },
          { label: 'Recebido no Mês', valor: 'total_recebido' },
          { label: 'Previsão', valor: 'previsao' }
        ]
      },
      {
        tipo: 'lista',
        titulo: 'Tarefas do Dia',
        dados: 'tarefas_pendentes',
        acoes: ['concluir', 'adiar']
      },
      {
        tipo: 'grafico',
        titulo: 'Receitas por Mês',
        tipo_grafico: 'line',
        dados: 'receitas_mensais'
      }
    ]
  },
  clientes: {
    tipo: 'modulo',
    titulo: 'Clientes',
    componentes: [
      {
        tipo: 'tabela',
        titulo: 'Lista de Clientes',
        colunas: [
          { campo: 'nome', titulo: 'Nome' },
          { campo: 'cnpj', titulo: 'CNPJ' },
          { campo: 'status', titulo: 'Status' },
          { campo: 'ultima_interacao', titulo: 'Última Interação' }
        ],
        acoes: ['editar', 'excluir', 'nota', 'cobranca']
      },
      {
        tipo: 'formulario',
        titulo: 'Detalhes do Cliente',
        campos: [
          { nome: 'nome', tipo: 'texto', obrigatorio: true },
          { nome: 'cnpj', tipo: 'texto', obrigatorio: true },
          { nome: 'regime_tributario', tipo: 'select', opcoes: ['Simples', 'Lucro Presumido', 'Lucro Real'] },
          { nome: 'contato', tipo: 'grupo', campos: [
            { nome: 'nome', tipo: 'texto' },
            { nome: 'email', tipo: 'email' },
            { nome: 'telefone', tipo: 'telefone' }
          ]}
        ]
      }
    ]
  }
};

// Funções auxiliares para o WeWeb

const criarPagina = async (config) => {
  // Implementar integração com WeWeb
};

const atualizarComponente = async (id, dados) => {
  // Implementar integração com WeWeb
};

const obterDados = async (endpoint) => {
  // Implementar integração com WeWeb
};

module.exports = {
  wewebConfig,
  componentes,
  criarPagina,
  atualizarComponente,
  obterDados
}; 
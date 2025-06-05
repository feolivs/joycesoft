# JoyceSoft - Sistema Contábil Inteligente

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18.x-green.svg)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-v2.x-blue.svg)](https://supabase.io/)
[![n8n](https://img.shields.io/badge/n8n-v1.x-orange.svg)](https://n8n.io/)

## 📋 Sobre o Projeto
Sistema contábil inteligente e automatizado desenvolvido exclusivamente para a Joyce, centralizando o controle de clientes, emissão de notas fiscais, geração de cobranças, organização de tarefas e acompanhamento de pagamentos.

## 🚀 Funcionalidades Principais

### Cadastro de Clientes
- Dados completos (CNPJ, prefeitura, regime, contato)
- Organização automática em pastas no Google Drive
- Registro de serviços prestados

### Gestão de Serviços
- Lançamento mensal de serviços
- Armazenamento de valor, descrição, data e status
- Emissão automática de NFS-e
- Geração de boletos/Pix
- Monitoramento de pagamentos

### Agenda Inteligente
- Tarefas fixas do mês
- Checklist automático por cliente
- Sistema de lembretes
- Acompanhamento de obrigações

### Relatórios e Exportações
- Exportação para Domínio/Sieg
- Relatórios de notas emitidas
- Relatórios de pagamentos
- Análise por cliente

### Assistente Contábil com IA
- Explicações sobre reforma tributária
- Sugestões de melhorias
- Suporte a dúvidas comuns

## 🛠️ Stack Tecnológica
- n8n: Automação de processos
- Supabase: Banco de dados e autenticação
- WeWeb: Interface do usuário
- Asaas/Juno: Processamento de pagamentos
- NFe.io: Emissão de notas fiscais
- ChatGPT: Assistente inteligente

## 📦 Instalação e Configuração

1. Clone o repositório:
```bash
git clone https://github.com/feolivs/joycesoft.git
cd joycesoft
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

4. Inicie o servidor:
```bash
npm run dev
```

## 🔒 Segurança
- Sistema 100% privado
- Dados criptografados
- Backup automático
- Certificado digital A1

## 📈 Escalabilidade
- Arquitetura modular
- Possibilidade de expansão
- Suporte a múltiplos clientes
- Processos automatizados

## 📄 Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🤝 Contribuição
Contribuições são bem-vindas! Por favor, leia o arquivo [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo para enviar pull requests. 